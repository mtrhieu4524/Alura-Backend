// controllers/payment.controller.js
const qs = require("qs");
const moment = require("moment");
const crypto = require("crypto");
const Order = require("../../models/order/order.model");
const Shipping = require("../../models/shipping/shipping.model");

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => sorted[key] = obj[key]);
  return sorted;
}

exports.createPaymentUrl = (req, res) => {
  const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_HASH_SECRET;
  const vnpUrl = process.env.VNP_PAYMENT_URL;
  const returnUrl = process.env.VNP_RETURN_URL;

  const date = moment();
  const createDate = date.format("YYYYMMDDHHmmss");
  const orderId = req.body.orderId;
  const amount = req.body.amount;
  const bankCode = req.body.bankCode || "";

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  vnp_Params["vnp_SecureHash"] = signed;
  const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;

  return res.json({ paymentUrl });
};

exports.vnpayReturn = async (req, res) => {
  const vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const orderId = vnp_Params["vnp_TxnRef"];
  const signData = qs.stringify(sortObject(vnp_Params), { encode: false });
  const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash !== signed) {
    return res.status(400).json({ message: "Xác thực VNPay thất bại" });
  }

  // Check nếu giao dịch thành công
  if (vnp_Params["vnp_ResponseCode"] !== "00") {
    return res.redirect(`${process.env.FRONTEND_URL}/checkout-failure?reason=${vnp_Params["vnp_ResponseCode"]}`);
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (order.paymentStatus !== 'Paid') {
      order.paymentStatus = "Paid";
      order.paymentMethod = "VNPAY";
      order.paymentTransactionId = vnp_Params["vnp_TransazctionNo"];
      order.orderStatus = "Confirmed";
      await order.save();

      const shipping = await Shipping.findOne({ orderId: order._id });
      if (shipping && shipping.deliveryStatus === 'Pending') {
        shipping.deliveryStatus = 'Shipping';
        await shipping.save();
      }
    }

    return res.redirect(`${process.env.FRONTEND_URL}/checkout-success?orderId=${order._id}`);
  } catch (err) {
    console.error("Lỗi xử lý VNPay:", err);
    return res.status(500).json({ message: "Lỗi cập nhật đơn hàng sau thanh toán" });
  }
};
