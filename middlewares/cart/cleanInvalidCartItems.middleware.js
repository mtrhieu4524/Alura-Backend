const CartItem = require("../../models/cart/cartItem.model");
const Product = require("../../models/product.model");

// Middleware để tự động xóa items có sản phẩm không public khỏi cart
const cleanInvalidCartItems = async (req, res, next) => {
  try {
    // Tìm và xóa các cart items có sản phẩm không public
    await CartItem.deleteMany({
      cartId: { $exists: true },
      $or: [
        { productId: null },
        {
          productId: {
            $in: await Product.find({ isPublic: false }).select("_id"),
          },
        },
      ],
    });

    next();
  } catch (error) {
    console.error("Error cleaning invalid cart items:", error);
    next(); // Continue anyway
  }
};

module.exports = cleanInvalidCartItems;
