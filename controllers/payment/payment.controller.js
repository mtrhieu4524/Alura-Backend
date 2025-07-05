// controllers/payment.controller.js
const qs = require("qs");
const moment = require("moment");
const crypto = require("crypto");

const Product = require("../../models/product.model");
const Order = require("../../models/order/order.model");
const OrderItem = require("../../models/order/orderItem.model");

const Cart = require("../../models/cart/cart.model");
const CartItem = require("../../models/cart/cartItem.model");
const Shipping = require("../../models/shipping/shipping.model");

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

exports.createPaymentUrl = (req, res) => {
  const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_HASH_SECRET;
  const vnpUrl = process.env.VNP_PAYMENT_URL;
  const returnUrl = process.env.VNP_RETURN_URL;

  console.log("return Payment urrl hehe: " + returnUrl);

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
    vnp_OrderInfo: `Thanh-toan-don-hang-${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
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

// exports.vnpayReturn = async (req, res) => {
//   console.log("VNPay return called with query:", req.query);
//   // const vnp_Params = req.query;
//   // const secureHash = vnp_Params["vnp_SecureHash"];
//   // delete vnp_Params["vnp_SecureHash"];
//   // delete vnp_Params["vnp_SecureHashType"];

//   // const orderId = vnp_Params["vnp_TxnRef"];
//   // const signData = qs.stringify(sortObject(vnp_Params), { encode: false });
//   // const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
//   // const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
//   // console.log("VNPay signed data:", signed);
//   // if (secureHash !== signed) {
//   //   return res.status(400).json({ message: "Xác thực VNPay thất bại" });
//   // }

//   const vnp_Params = { ...req.query };
//   const secureHash = vnp_Params["vnp_SecureHash"];

//   console.log("Received secure hash:", secureHash);

//   // Remove hash parameters
//   delete vnp_Params["vnp_SecureHash"];
//   delete vnp_Params["vnp_SecureHashType"];

//   const orderId = vnp_Params["vnp_TxnRef"];
//   console.log("Processing order ID:", orderId);

//   // Sort and create signature
//   const sortedParams = sortObject(vnp_Params);
//   const signData = qs.stringify(sortedParams, { encode: false });

//   console.log("Sign data:", signData);

//   const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
//   const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

//   console.log("Generated hash:", signed);
//   console.log("Received hash:", secureHash);

//   if (secureHash !== signed) {
//     console.error("Hash validation failed!");
//     return res.status(400).json({
//       success: false,
//       message: "Xác thực VNPay thất bại",
//       debug: {
//         expectedHash: signed,
//         receivedHash: secureHash,
//         signData: signData,
//       },
//     });
//   }

//   // Check nếu giao dịch thành công
//   // if (vnp_Params["vnp_ResponseCode"] !== "00") {
//   //   return res.redirect(
//   //     `${process.env.FRONTEND_URL}/checkout-failure?reason=${vnp_Params["vnp_ResponseCode"]}`
//   //   );
//   // }

//   try {
//     console.log("Fetching order with ID:", orderId);
//     const order = await Order.findById(orderId);
//     if (!order)
//       return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

//     if (order.paymentStatus !== "Paid") {
//       order.paymentStatus = "Paid";
//       order.paymentMethod = "VNPAY";
//       order.paymentTransactionId = vnp_Params["vnp_TransazctionNo"];
//       order.orderStatus = "Processing";
//       await order.save();

//       const shipping = await Shipping.findOne({ orderId: order._id });
//       if (shipping && shipping.deliveryStatus === "Pending") {
//         shipping.deliveryStatus = "Shipping";
//         await shipping.save();
//       }
//     }

//     return res.redirect(
//       `${process.env.FRONTEND_URL}/checkout-success?orderId=${order._id}`
//     );
//   } catch (err) {
//     console.error("Lỗi xử lý VNPay:", err);
//     return res
//       .status(500)
//       .json({ message: "Lỗi cập nhật đơn hàng sau thanh toán" });
//   }
// };

exports.vnpayReturn = async (req, res) => {
  const vnp_Params = { ...req.query };
  const secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const orderId = vnp_Params["vnp_TxnRef"];

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });

  const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash !== signed) {
    return res.status(400).json({ message: "Xác thực VNPay thất bại" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    const orderItems = await OrderItem.find({ orderId: order._id });

    if (vnp_Params["vnp_ResponseCode"] === "00") {
      // Payment success
      if (order.paymentStatus !== "Paid") {
        // Trừ stock
        for (const item of orderItems) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity }
          });
        }

        // Delete CartItems
        const cart = await Cart.findOne({ userId: order.userId });
        if (cart) {
          for (const item of orderItems) {
            await CartItem.deleteOne({
              cartId: cart._id,
              productId: item.productId
            });
          }
          const remainingItems = await CartItem.find({ cartId: cart._id });
          if (remainingItems.length === 0) {
            await Cart.findByIdAndDelete(cart._id);
          }
        }

        order.paymentStatus = "Paid";
        order.orderStatus = "Processing";
        order.paymentMethod = "VNPAY";
        order.paymentTransactionId = vnp_Params["vnp_TransactionNo"];
        await order.save();
      }

      // Comment redirect để test Postman
      // return res.redirect(`${process.env.FRONTEND_URL}/checkout-success?orderId=${order._id}`);

      return res.json({
        message: "Payment SUCCESSFUL",
        orderId: order._id
      });
    } else {
      order.orderStatus = "Cancelled";
      order.paymentStatus = "Failed";
      await order.save();

      // Comment redirect để test Postman
      // return res.redirect(`${process.env.FRONTEND_URL}/checkout-failure`);

      return res.json({
        message: "Payment FAILED",
        orderId: order._id
      });
    }
  } catch (err) {
    console.error("Lỗi xử lý VNPay:", err);
    return res.status(500).json({ message: "Lỗi cập nhật đơn hàng sau thanh toán" });
  }
};
