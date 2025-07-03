const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth/auth.middleware");
const productController = require("../../controllers/product/product.controller");
const productHandler = require("../../dtos/product.handler");
const upload = require("../../middlewares/cloudiary/upload.middleware");
const {
  authorizeUser,
  authorizeAdmin,
  authorizeAdminOrStaff,
} = require("../../middlewares/auth/role.middleware");

router.post(
  "/",
  upload.array("imgUrls", 5),
  authMiddleware,
  authorizeAdmin,
  productHandler.createProduct,
  productController.createProduct.bind(productController)
);

// Get all products
router.get(
  "/",
  productHandler.getAllProducts,
  productController.getAllProducts.bind(productController)
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
  authMiddleware,
  authorizeAdminOrStaff,
  productHandler.updateProductById,
  productController.updateProductById.bind(productController)
);

// Find products by image
router.post(
  "/find-by-image",
  upload.array("imgUrls", 1),
  productController.analyzeProduct.bind(productController)
);

// Disable product by ID
router.put(
  "/disable/:id",
  authMiddleware,
  authorizeAdminOrStaff,
  productController.disableProduct.bind(productController)
);

// Enable product by ID
router.put(
  "/enable/:id",
  authMiddleware,
  authorizeAdminOrStaff,
  productController.enableProduct.bind(productController)
);

// Delete product by ID
router.delete(
  "/:id",
  authMiddleware,
  authorizeAdmin,
  productController.deleteProductById.bind(productController)
);

module.exports = router;
