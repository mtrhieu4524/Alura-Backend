// routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/dashboard/dashboard.controller');
const authMiddleware = require("../../middlewares/auth/auth.middleware");
const { authorizeAdmin } = require("../../middlewares/auth/role.middleware");

router.get('/summary', authMiddleware, authorizeAdmin, dashboardController.getSummary);
router.get('/top-products', authMiddleware, authorizeAdmin, dashboardController.getTopProducts);
router.get('/top-homepage-products', dashboardController.getTopProductsForHomepage);
router.get('/products-sold-by-category', authMiddleware, authorizeAdmin, dashboardController.getProductsSoldByCategory);
router.get('/products-sold-by-type', authMiddleware, authorizeAdmin, dashboardController.getProductsSoldByType);


module.exports = router;
