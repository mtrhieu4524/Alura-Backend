const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/payment/payment.controller");

router.post("/vnpay/createPaymentUrl", paymentController.createPaymentUrl);
router.get("/vnpay/return", paymentController.vnpayReturn);

module.exports = router;
