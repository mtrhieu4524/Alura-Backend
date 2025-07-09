const Cart = require("../../models/cart/cart.model");
const CartItem = require("../../models/cart/cartItem.model");
const Promotion = require("../../models/promotion/promotion.model");
const PromotionUsage = require("../../models/promotion/promotionUsage.model");
const Product = require("../../models/product.model");

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    if (!productId || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin hoặc số lượng không hợp lệ" });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isPublic) {
      return res
        .status(400)
        .json({ message: "Sản phẩm không hợp lệ hoặc đã bị ẩn" });
    }

    if (product.stock < quantity) {
      return res
        .status(400)
        .json({ message: "Sản phẩm không đủ số lượng hàng cho yêu cầu" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    let cartItem = await CartItem.findOne({ cartId: cart._id, productId });

    if (cartItem) {
      const totalQuantity = cartItem.quantity + quantity;
      if (totalQuantity > product.stock) {
        return res
          .status(400)
          .json({ message: `Chỉ còn ${product.stock} sản phẩm trong kho` });
      }

      cartItem.quantity = totalQuantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart._id,
        productId,
        quantity,
        unitPrice: product.price,
      });
    }

    res.status(200).json({ message: "Đã thêm vào giỏ hàng", cartItem });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(200).json({ items: [], totalAmount: 0 });

    let items = await CartItem.find({ cartId: cart._id }).populate({
      path: "productId",
      populate: { path: "productTypeId", select: "name" },
    });

    items = items.filter((item) => item.productId && item.productId.isPublic);

    const mappedItems = items.map((item) => ({
      _id: item._id,
      productId: item.productId._id,
      productName: item.productId.name,
      productType: item.productId.productTypeId?.name || "",
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalItemPrice: item.unitPrice * item.quantity,
      imgUrls: item.productId.imgUrls,
    }));

    const totalAmount = mappedItems.reduce(
      (sum, item) => sum + item.totalItemPrice,
      0
    );

    res.status(200).json({
      cartId: cart._id,
      totalAmount,
      items: mappedItems,
    });
  } catch (err) {
    console.error("Lỗi getCart:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.previewCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { selectedCartItemIds, promotionId, shippingMethod } = req.body;

    if (
      !Array.isArray(selectedCartItemIds) ||
      selectedCartItemIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Bạn cần chọn ít nhất 1 sản phẩm" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(400).json({ message: "Giỏ hàng trống" });

    const cartItems = await CartItem.find({
      _id: { $in: selectedCartItemIds },
      cartId: cart._id,
    }).populate({
      path: "productId",
      populate: { path: "productTypeId", select: "name" },
    });

    let subTotal = 0;
    const items = [];

    for (const item of cartItems) {
      const product = item.productId;
      if (
        !product ||
        !product.isPublic ||
        product.stock < item.quantity ||
        item.quantity <= 0
      )
        continue;

      const totalItemPrice = item.unitPrice * item.quantity;
      subTotal += totalItemPrice;

      items.push({
        productId: product._id,
        productName: product.name,
        productType: product.productTypeId?.name || "",
        productImgUrl: product.imgUrls?.[0] || FALLBACK_IMG,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalItemPrice,
      });
    }

    let discountAmount = 0;

    if (promotionId) {
      const promo = await Promotion.findById(promotionId);
      const now = new Date();

      const existedUsage = await PromotionUsage.findOne({
        promotionId,
        userId,
      });

      if (
        promo &&
        promo.isPublic &&
        promo.startDate <= now &&
        promo.endDate >= now &&
        (promo.usageLimit === 0 || promo.usedCount < promo.usageLimit) &&
        !existedUsage &&
        subTotal >= promo.minimumOrderAmount
      ) {
        discountAmount = (subTotal * promo.discountValue) / 100;
      }
    }

    const shippingFee =
      shippingMethod === "EXPRESS"
        ? parseInt(process.env.SHIPPING_FEE_EXPRESS || "50000", 10)
        : parseInt(process.env.SHIPPING_FEE_STANDARD || "30000", 10);

    const total = Math.max(subTotal - discountAmount + shippingFee, 0);

    return res.status(200).json({
      items,
      subTotal,
      discountAmount,
      shippingFee,
      total,
    });
  } catch (error) {
    console.error("Lỗi preview giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi server khi preview giỏ hàng" });
  }
};

exports.updateCartItem = async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  try {
    const cartItem = await CartItem.findById(cartItemId).populate("productId");
    if (!cartItem)
      return res.status(404).json({ message: "Không tìm thấy cart item" });

    if (!cartItem.productId || !cartItem.productId.isPublic) {
      return res
        .status(400)
        .json({ message: "Sản phẩm này không còn khả dụng để cập nhật" });
    }

    if (quantity > cartItem.productId.stock) {
      return res
        .status(400)
        .json({ message: "Sản phẩm không đủ số lượng hàng cho yêu cầu" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: "Đã cập nhật số lượng", cartItem });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  const { cartItemId } = req.params;

  try {
    const cartItem = await CartItem.findByIdAndDelete(cartItemId);
    if (!cartItem)
      return res.status(404).json({ message: "Không tìm thấy cart item" });

    res.status(200).json({ message: "Đã xoá sản phẩm khỏi giỏ hàng" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
