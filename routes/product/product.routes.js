const express = require("express");
const router = express.Router();
const productController = require("../../controllers/product/product.controller");
const productHandler = require("../../dtos/product.handler");
const upload = require("../../middlewares/cloudiary/upload.middleware");
// const authMiddleware = require("../../middlewares/auth/auth.middleware");

// Upload ảnh từ người dùng để AI detect
// router.post('/detect', upload.single('image'), productController.detectProductFromImage);

router.post(
  "/",
  upload.array("imgUrls", 5),
  //   authMiddleware,
  productHandler.createProduct,
  productController.createProduct.bind(productController)
);

// Get all products
router.get(
  "/",
  productHandler.getAllProducts,
  productController.getAllProducts
);

// Get product by ID
router.get(
  "/:id",
  productHandler.getProductById,
  productController.getProductById
);

// Update product by ID
router.put(
  "/:id",
  upload.array("imgUrls", 5),
  //   authMiddleware,
  productHandler.updateProductById,
  productController.updateProductById.bind(productController)
);

module.exports = router;
