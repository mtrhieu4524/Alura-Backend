const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middlewares/upload.middleware');

// Tạo sản phẩm với ảnh
router.post('/products', upload.single('image'), productController.createProduct);

// Upload ảnh từ người dùng để AI detect
router.post('/detect', upload.single('image'), productController.detectProductFromImage);

module.exports = router;
