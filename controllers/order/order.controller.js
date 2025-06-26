const mongoose = require('mongoose');
const Cart = require('../../models/cart/cart.model');
const CartItem = require('../../models/cart/cartItem.model');
const Product = require('../../models/product.model');
const Promotion = require('../../models/promotion/promotion.model');
const PromotionUsage = require('../../models/promotion/promotionUsage.model');
const Order = require('../../models/order/order.model');
const OrderItem = require('../../models/order/orderItem.model');
const Shipping = require('../../models/shipping/shipping.model');

const FALLBACK_IMG = 'https://via.placeholder.com/150';

exports.placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const {
      shippingAddress,
      shippingMethod,
      promotionId,
      note,
      paymentMethod
    } = req.body;

    if (!shippingAddress || typeof shippingAddress !== 'string' || shippingAddress.trim().length < 5 || shippingAddress.length > 255) {
      return res.status(400).json({ message: 'Địa chỉ giao hàng không hợp lệ' });
    }

    if (!shippingMethod || !paymentMethod) {
      return res.status(400).json({ message: 'Thiếu thông tin đơn hàng' });
    }

    if (!['STANDARD', 'EXPRESS'].includes(shippingMethod)) {
      return res.status(400).json({ message: 'Phương thức giao hàng không hợp lệ' });
    }

    if (promotionId && !mongoose.Types.ObjectId.isValid(promotionId)) {
      return res.status(400).json({ message: 'promotionId không hợp lệ' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(400).json({ message: 'Giỏ hàng trống' });

    const cartItems = await CartItem.find({ cartId: cart._id }).populate('productId');
    if (cartItems.length === 0) return res.status(400).json({ message: 'Giỏ hàng không có sản phẩm' });

    let subTotal = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const product = item.productId;
      if (!product || !product.isPublic || product.stock < item.quantity || item.quantity <= 0) continue;

      subTotal += item.unitPrice * item.quantity;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        productName: product.name,
        productImgUrl: product.imgUrls?.[0] || FALLBACK_IMG,
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: 'Không có sản phẩm hợp lệ trong giỏ hàng để đặt' });
    }

    let discountAmount = 0;
    if (promotionId) {
      const promo = await Promotion.findById(promotionId);
      const now = new Date();

      if (!promo || !promo.isPublic || promo.startDate > now || promo.endDate < now) {
        return res.status(400).json({ message: 'Mã khuyến mãi không hợp lệ hoặc đã hết hạn' });
      }

      const existedUsage = await PromotionUsage.findOne({ promotionId, userId });
      if (existedUsage) {
        return res.status(400).json({ message: 'Bạn đã sử dụng mã khuyến mãi này trước đó' });
      }

      if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) {
        return res.status(400).json({ message: 'Mã khuyến mãi đã đạt giới hạn sử dụng' });
      }

      if (subTotal < promo.minimumOrderAmount) {
        return res.status(400).json({ message: `Cần tối thiểu ${promo.minimumOrderAmount} để áp dụng mã` });
      }

      discountAmount = promo.discountType === 'percentage'
        ? (subTotal * promo.discountValue) / 100
        : promo.discountValue;
    }

    const shippingFee = shippingMethod === 'STANDARD'
      ? parseInt(process.env.SHIPPING_FEE_STANDARD || '30000', 10)
      : parseInt(process.env.SHIPPING_FEE_EXPRESS || '50000', 10);

    const totalAmount = Math.max(subTotal - discountAmount + shippingFee, 0);

    const createdOrder = await Order.create([{
      userId,
      shippingAddress,
      subTotal,
      discountAmount,
      shippingFee,
      totalAmount,
      promotionId: promotionId || null,
      shippingMethod,
      orderStatus: 'Pending',
      paymentStatus: 'Pending',
      paymentMethod: paymentMethod || 'COD',
      orderDate: new Date(),
      note,
    }], { session }).then(order => order[0]);

    for (const item of orderItems) {
      await OrderItem.create([{
        orderId: createdOrder._id,
        ...item
      }], { session });

      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      }, { session });
    }

    if (promotionId && discountAmount > 0) {
      await PromotionUsage.create([{
        promotionId,
        userId,
        orderId: createdOrder._id,
        discountAmount,
      }], { session });

      await Promotion.findByIdAndUpdate(promotionId, {
        $inc: { usedCount: 1 }
      }, { session });
    }

    await Shipping.create([{
      orderId: createdOrder._id,
      deliveryStatus: 'Pending'
    }], { session });

    await CartItem.deleteMany({ cartId: cart._id }, { session });
    await Cart.findByIdAndDelete(cart._id, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: 'Đặt hàng thành công',
      orderId: createdOrder._id
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Đặt hàng thất bại:', error);
    return res.status(500).json({ message: 'Đặt hàng thất bại' });
  }
};



exports.prepareOrderVnpay = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const {
      shippingAddress,
      shippingMethod,
      promotionId,
      note
    } = req.body;

    if (!shippingAddress || typeof shippingAddress !== 'string' || shippingAddress.trim().length < 5 || shippingAddress.length > 255) {
      return res.status(400).json({ message: 'Địa chỉ giao hàng không hợp lệ' });
    }

    if (!shippingMethod) {
      return res.status(400).json({ message: 'Thiếu phương thức vận chuyển' });
    }

    if (!['STANDARD', 'EXPRESS'].includes(shippingMethod)) {
      return res.status(400).json({ message: 'Phương thức giao hàng không hợp lệ' });
    }

    if (promotionId && !mongoose.Types.ObjectId.isValid(promotionId)) {
      return res.status(400).json({ message: 'promotionId không hợp lệ' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(400).json({ message: 'Giỏ hàng trống' });

    const cartItems = await CartItem.find({ cartId: cart._id }).populate('productId');
    if (cartItems.length === 0) return res.status(400).json({ message: 'Không có sản phẩm trong giỏ hàng' });

    let subTotal = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const product = item.productId;
      if (!product || !product.isPublic || product.stock < item.quantity || item.quantity <= 0) continue;

      subTotal += item.unitPrice * item.quantity;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        productName: product.name,
        productImgUrl: product.imgUrls?.[0] || FALLBACK_IMG,
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: 'Không có sản phẩm hợp lệ trong giỏ hàng' });
    }

    let discountAmount = 0;
    if (promotionId) {
      const promo = await Promotion.findById(promotionId);
      const now = new Date();

      if (!promo || !promo.isPublic || promo.startDate > now || promo.endDate < now) {
        return res.status(400).json({ message: 'Mã khuyến mãi không hợp lệ' });
      }

      const existedUsage = await PromotionUsage.findOne({ promotionId, userId });
      if (existedUsage) {
        return res.status(400).json({ message: 'Bạn đã dùng mã này rồi' });
      }

      if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) {
        return res.status(400).json({ message: 'Mã đã đạt giới hạn' });
      }

      if (subTotal < promo.minimumOrderAmount) {
        return res.status(400).json({ message: `Đơn tối thiểu ${promo.minimumOrderAmount} mới dùng mã` });
      }

      discountAmount = promo.discountType === 'percentage'
        ? (subTotal * promo.discountValue) / 100
        : promo.discountValue;
    }

    const shippingFee = shippingMethod === 'STANDARD'
      ? parseInt(process.env.SHIPPING_FEE_STANDARD || '30000', 10)
      : parseInt(process.env.SHIPPING_FEE_EXPRESS || '50000', 10);

    const totalAmount = Math.max(subTotal - discountAmount + shippingFee, 0);

    const createdOrder = await Order.create([{
      userId,
      shippingAddress,
      subTotal,
      discountAmount,
      shippingFee,
      totalAmount,
      promotionId: promotionId || null,
      shippingMethod,
      orderStatus: 'Pending',
      paymentStatus: 'Pending',
      paymentMethod: 'VNPAY',
      orderDate: new Date(),
      note,
    }], { session }).then(order => order[0]);

    for (const item of orderItems) {
      await OrderItem.create([{
        orderId: createdOrder._id,
        ...item
      }], { session });

      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      }, { session });
    }

    if (promotionId && discountAmount > 0) {
      await PromotionUsage.create([{
        promotionId,
        userId,
        orderId: createdOrder._id,
        discountAmount,
      }], { session });

      await Promotion.findByIdAndUpdate(promotionId, {
        $inc: { usedCount: 1 }
      }, { session });
    }

    await Shipping.create([{
      orderId: createdOrder._id,
      deliveryStatus: 'Pending'
    }], { session });

    await CartItem.deleteMany({ cartId: cart._id }, { session });
    await Cart.findByIdAndDelete(cart._id, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: 'Tạo đơn thành công. Tiếp tục thanh toán VNPay.',
      orderId: createdOrder._id,
      amount: createdOrder.totalAmount
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Lỗi khi chuẩn bị đơn VNPAY:', error);
    return res.status(500).json({ message: 'Lỗi khi tạo đơn hàng VNPay' });
  }
};

