const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/order/order.controller');
const authenticate = require('../../middlewares/auth/auth.middleware');

router.post('/place', authenticate, orderController.placeOrder);
router.post('/prepare-vnpay', authenticate, orderController.prepareOrderVnpay);

module.exports = router;
