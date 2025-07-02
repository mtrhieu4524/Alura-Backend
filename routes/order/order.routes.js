const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/order/order.controller');
const authenticate = require('../../middlewares/auth/auth.middleware');
const { authorizeStaff, authorizeUser } = require('../../middlewares/auth/role.middleware');

//user
router.post('/place', authenticate,authorizeUser, orderController.placeOrder);
router.post('/prepare-vnpay', authenticate, authorizeUser, orderController.prepareOrderVnpay);
router.put('/cancel/:orderId', authenticate, authorizeUser, orderController.cancelOrderByUser);
router.get('/:userId', authenticate, orderController.getOrderByUserId);

//staff
router.put('/update/:orderId', authenticate, orderController.updateOrderById);

//admin
router.get('/all', authenticate,  orderController.getAllOrders);



module.exports = router;
