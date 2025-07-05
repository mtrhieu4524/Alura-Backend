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
      // paymentMethod,
      selectedCartItemIds
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

    if (paymentMethod !== 'COD') {
      return res.status(400).json({ message: 'Phương thức thanh toán chỉ hỗ trợ COD' });
    }


    if (!Array.isArray(selectedCartItemIds) || selectedCartItemIds.length === 0) {
      return res.status(400).json({ message: 'Bạn cần chọn ít nhất 1 sản phẩm để đặt hàng' });
    }

    if (promotionId && !mongoose.Types.ObjectId.isValid(promotionId)) {
      return res.status(400).json({ message: 'promotionId không hợp lệ' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(400).json({ message: 'Giỏ hàng trống' });

    // const cartItems = await CartItem.find({ cartId: cart._id }).populate('productId');
    const cartItems = await CartItem.find({
      _id: { $in: selectedCartItemIds },
      cartId: cart._id
    }).populate('productId');
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

      discountAmount = (subTotal * promo.discountValue) / 100;

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
      // paymentStatus: paymentMethod === 'COD' ? 'Unpaid' : 'Pending',
      // paymentMethod: paymentMethod || 'COD',
      paymentStatus: 'Unpaid',
      paymentMethod: 'COD',
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

    // await CartItem.deleteMany({ cartId: cart._id }, { session });
    // await Cart.findByIdAndDelete(cart._id, { session });


    await CartItem.deleteMany({ _id: { $in: selectedCartItemIds } }, { session });

    // Nếu giỏ hàng không còn item nào → xoá luôn
    const remainingItems = await CartItem.find({ cartId: cart._id });
    if (remainingItems.length === 0) {
      await Cart.findByIdAndDelete(cart._id, { session });
    }

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
      note, 
      selectedCartItemIds 
    } = req.body;

    // Validate inputs
    if (!shippingAddress || typeof shippingAddress !== 'string' || shippingAddress.trim().length < 5 || shippingAddress.length > 255) {
      return res.status(400).json({ message: 'Địa chỉ giao hàng không hợp lệ' });
    }
    if (!shippingMethod || !['STANDARD', 'EXPRESS'].includes(shippingMethod)) {
      return res.status(400).json({ message: 'Phương thức giao hàng không hợp lệ' });
    }
    if (!Array.isArray(selectedCartItemIds) || selectedCartItemIds.length === 0) {
      return res.status(400).json({ message: 'Bạn cần chọn ít nhất 1 sản phẩm để đặt hàng' });
    }
    if (promotionId && !mongoose.Types.ObjectId.isValid(promotionId)) {
      return res.status(400).json({ message: 'promotionId không hợp lệ' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(400).json({ message: 'Giỏ hàng trống' });

    const cartItems = await CartItem.find({
      _id: { $in: selectedCartItemIds },
      cartId: cart._id
    }).populate('productId');

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

    // Calculate promotion
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

      discountAmount = (subTotal * promo.discountValue) / 100;
    }

    const shippingFee = shippingMethod === 'STANDARD'
      ? parseInt(process.env.SHIPPING_FEE_STANDARD || '30000', 10)
      : parseInt(process.env.SHIPPING_FEE_EXPRESS || '50000', 10);

    const totalAmount = Math.max(subTotal - discountAmount + shippingFee, 0);

    // Create order with status Pending
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
    }

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



exports.getOrderByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID người dùng không hợp lệ' });
    }

    const orders = await Order.find({ userId })
      .sort({ orderDate: -1 })
      .populate({
        path: 'promotionId',
        select: 'code discountValue'
      });

    const orderIds = orders.map(order => order._id);

    const orderItems = await OrderItem.find({ orderId: { $in: orderIds } });

    const result = orders.map(order => ({
      ...order.toObject(),
      items: orderItems.filter(item => item.orderId.toString() === order._id.toString())
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error('Lỗi khi lấy đơn hàng theo userId:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng của user' });
  }
};

exports.viewOrderByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'ID đơn hàng không hợp lệ' });
    }

    const order = await Order.findById(orderId)
      .populate({ path: 'promotionId', select: 'code discountValue' })
      .populate({ path: 'userId', select: 'name email phone' });

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    const orderItems = await OrderItem.find({ orderId });

    return res.status(200).json({
      ...order.toObject(),
      items: orderItems
    });
  } catch (error) {
    console.error('Lỗi khi xem chi tiết đơn hàng:', error);
    return res.status(500).json({ message: 'Lỗi server khi lấy chi tiết đơn hàng' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ orderDate: -1 })
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .populate({
        path: 'promotionId',
        select: 'code discountValue'
      });

    const orderIds = orders.map(order => order._id);

    const orderItems = await OrderItem.find({ orderId: { $in: orderIds } });

    const result = orders.map(order => ({
      ...order.toObject(),
      items: orderItems.filter(item => item.orderId.toString() === order._id.toString())
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error('Lỗi khi lấy tất cả đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy tất cả đơn hàng' });
  }
};

exports.updateOrderCodById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Success', 'Cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ' });
    }

    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Chặn chuyển trạng thái sai flow
    const transitions = {
      Pending: ['Processing', 'Cancelled'],
      Processing: ['Shipped', 'Cancelled'],
      Shipped: ['Delivered'],
      Delivered: ['Success']
    };
    const currentStatus = existingOrder.orderStatus;
    if (
      currentStatus !== orderStatus &&
      transitions[currentStatus] &&
      !transitions[currentStatus].includes(orderStatus)
    ) {
      return res.status(400).json({ message: `Không thể chuyển từ ${currentStatus} sang ${orderStatus}` });
    }

    const updateData = { orderStatus };

    if (orderStatus === 'Delivered' || orderStatus === 'Success') {
      updateData.paymentStatus = 'Paid';
    }

    if (orderStatus === 'Cancelled') {
      // Hoàn stock nếu chưa hoàn
      if (!existingOrder.hasRestocked) {
        const orderItems = await OrderItem.find({ orderId });
        for (const item of orderItems) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: item.quantity }
          });
        }
        updateData.hasRestocked = true;
      }
      updateData.paymentStatus = existingOrder.paymentMethod === 'COD' ? 'Failed' : 'Refunded';
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

    return res.status(200).json({
      message: 'Cập nhật trạng thái đơn hàng thành công',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn:', error);
    return res.status(500).json({ message: 'Cập nhật đơn hàng thất bại' });
  }
};

exports.cancelOrderByUser = async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    if (!['Pending', 'Processing'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Chỉ có thể hủy đơn hàng ở trạng thái Pending hoặc Processing' });
    }

    if (order.hasRestocked) {
      return res.status(400).json({ message: 'Đơn hàng này đã được hoàn lại tồn kho trước đó' });
    }

    // Hoàn lại stock
    const orderItems = await OrderItem.find({ orderId: order._id });
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity }
      });
    }

    // Cập nhật trạng thái đơn hàng và đánh dấu đã hoàn stock
    order.orderStatus = 'Cancelled';
    order.paymentStatus = order.paymentMethod === 'COD' ? 'Failed' : 'Refunded';
    order.hasRestocked = true;
    await order.save();

    return res.status(200).json({ message: 'Đơn hàng đã được hủy và hoàn tồn kho thành công' });
  } catch (error) {
    console.error('Lỗi khi hủy đơn hàng:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi hủy đơn hàng' });
  }
};





