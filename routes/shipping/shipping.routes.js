// routes/shipping.route.js
const express = require('express');
const router = express.Router();
const shippingController = require('../../controllers/shipping/shipping.controller');
const authenticate = require('../../middlewares/auth/auth.middleware'); 
const {authorizeStaff} = require('../../middlewares/auth/role.middleware'); 

// Authenticated staff or admin
router.put('/:shippingId/status', authenticate, shippingController.updateShippingStatus);
router.get('/:shippingId', authenticate, shippingController.getShippingDetail);

module.exports = router;
