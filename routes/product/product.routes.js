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
  upload.array("imgUrl", 1),
  //   authMiddleware,
  // productHandler.createProduct,
  productController.createProduct.bind(productController)
);

module.exports = router;
