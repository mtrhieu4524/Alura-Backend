const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/order/order.controller");
const authenticate = require("../../middlewares/auth/auth.middleware");
const {
  authorizeStaff,
  authorizeUser,
} = require("../../middlewares/auth/role.middleware");




//user
router.post("/place", authenticate, authorizeUser, orderController.placeOrder);
router.post(
  "/prepare-vnpay",
  authenticate,
  authorizeUser,
  orderController.prepareOrderVnpay
);
router.put(
  "/cancel/:orderId",
  authenticate,
  authorizeUser,
  orderController.cancelOrderByUser
);

//staff
router.get("/all", authenticate, authorizeStaff, orderController.getAllOrders);

router.get("/:userId", authenticate, orderController.getOrderByUserId);

router.get("/by-user/:userId", authenticate, authorizeUser, orderController.getOrderByUserId);
router.get(
  "/by-order/:orderId",
  authenticate,
  orderController.viewOrderByOrderId
);

//staff
router.put(
  "/update-cod/:orderId",
  authenticate,
  authorizeStaff,
  orderController.updateOrderCodById
);



module.exports = router;
