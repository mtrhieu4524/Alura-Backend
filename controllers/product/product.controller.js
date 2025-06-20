const Product = require('../models/product.model'); // giả định bạn có model
const cloudinary = require('../utils/cloudinary');

// Tạo sản phẩm mới và upload ảnh
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file?.path;

    const product = await Product.create({
      name,
      price,
      description,
      imageUrl: image,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Tạo sản phẩm thất bại', detail: error.message });
  }
};

// Nhận ảnh từ người dùng, chạy detect AI
exports.detectProductFromImage = async (req, res) => {
  try {
    const image = req.file?.path;

    if (!image) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // TODO: Gửi ảnh đến AI service (của bạn hoặc 3rd-party)
    const detectedProduct = await detectProductWithAI(image);

    res.json({ image, detectedProduct });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi detect sản phẩm', detail: err.message });
  }
};

// Placeholder hàm gọi AI
const detectProductWithAI = async (imageUrl) => {
  // Giả lập kết quả
  return {
    name: 'Serum Vitamin C',
    brand: 'SomeBrand',
    confidence: 0.92,
  };
};
