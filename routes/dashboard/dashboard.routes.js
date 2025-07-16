// routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/dashboard/dashboard.controller');
const authMiddleware = require("../../middlewares/auth/auth.middleware");
const { authorizeAdmin } = require("../../middlewares/auth/role.middleware");

router.get('/summary', authMiddleware, authorizeAdmin, dashboardController.getSummary);
router.get('/top-products', authMiddleware, authorizeAdmin, dashboardController.getTopProducts);



module.exports = router;
