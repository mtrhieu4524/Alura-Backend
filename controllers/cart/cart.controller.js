const Cart = require('../../models/cart/cart.model');
const CartItem = require('../../models/cart/cartItem.model');
const Product = require('../../models/product.model');

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    if (!productId || quantity <= 0) {
      return res.status(400).json({ message: 'Thiếu thông tin hoặc số lượng không hợp lệ' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isPublic) {
      return res.status(400).json({ message: 'Sản phẩm không hợp lệ hoặc đã bị ẩn' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Sản phẩm không đủ số lượng hàng cho yêu cầu' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    let cartItem = await CartItem.findOne({ cartId: cart._id, productId });

    if (cartItem) {
      const totalQuantity = cartItem.quantity + quantity;
      if (totalQuantity > product.stock) {
        return res.status(400).json({ message: `Chỉ còn ${product.stock} sản phẩm trong kho` });
      }

      cartItem.quantity = totalQuantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart._id,
        productId,
        quantity,
        unitPrice: product.price
      });
    }

    res.status(200).json({ message: 'Đã thêm vào giỏ hàng', cartItem });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};


exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(200).json({ items: [], totalAmount: 0 });

    let items = await CartItem.find({ cartId: cart._id }).populate('productId');

    // Chỉ giữ lại sản phẩm isPublic: true
    items = items.filter(item => item.productId && item.productId.isPublic);

    const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    res.status(200).json({
      cartId: cart._id,
      totalAmount,
      items,
      
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};


exports.updateCartItem = async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  try {
    const cartItem = await CartItem.findById(cartItemId).populate('productId');
    if (!cartItem) return res.status(404).json({ message: 'Không tìm thấy cart item' });

    if (!cartItem.productId || !cartItem.productId.isPublic) {
      return res.status(400).json({ message: 'Sản phẩm này không còn khả dụng để cập nhật' });
    }

    if (quantity > cartItem.productId.stock) {
      return res.status(400).json({ message: 'Sản phẩm không đủ số lượng hàng cho yêu cầu' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: 'Đã cập nhật số lượng', cartItem });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};


exports.removeCartItem = async (req, res) => {
  const { cartItemId } = req.params;

  try {
    const cartItem = await CartItem.findByIdAndDelete(cartItemId);
    if (!cartItem) return res.status(404).json({ message: 'Không tìm thấy cart item' });

    res.status(200).json({ message: 'Đã xoá sản phẩm khỏi giỏ hàng' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
