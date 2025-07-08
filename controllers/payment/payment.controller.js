// controllers/payment.controller.js
const qs = require("qs");
const moment = require("moment");
const crypto = require("crypto");
const mongoose = require("mongoose");

const Product = require("../../models/product.model");
const Order = require("../../models/order/order.model");
const OrderItem = require("../../models/order/orderItem.model");
const Promotion = require("../../models/promotion/promotion.model"); // Thêm dòng này
const PromotionUsage = require("../../models/promotion/promotionUsage.model");

const Cart = require("../../models/cart/cart.model");
const CartItem = require("../../models/cart/cartItem.model");
const Shipping = require("../../models/shipping/shipping.model");
const TempOrder = require("../../models/order/tempOrder.model");
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

exports.createPaymentUrl = async (req, res) => {
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
  const orderInfo = req.body.orderInfo || `Thanh-toan-don-hang-${orderId}`;

  const orderData = {
    userId: req.body.userId,
    shippingAddress: req.body.shippingAddress,
    subTotal: req.body.subTotal,
    discountAmount: req.body.discountAmount || 0,
    shippingFee: req.body.shippingFee || 0,
    totalAmount: req.body.totalAmount,
    promotionId: req.body.promotionId,
    shippingMethod: req.body.shippingMethod,
    note: req.body.note || "",
    selectedCartItemIds: req.body.selectedCartItemIds || [],
    orderItems: req.body.orderItems || [],
  };

  try {
    // LƯU VÀO DATABASE TEMP THAY VÌ STRINGIFY VÀO URL
    await TempOrder.create({
      tempId: orderId,
      orderData: orderData,
    });

    console.log("Order data saved to temp storage:", orderId);

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
    const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, {
      encode: false,
    })}`;

    console.log("Payment URL created successfully");
    return res.json({ paymentUrl });
  } catch (error) {
    console.error("Error creating payment URL:", error);
    return res.status(500).json({ error: "Failed to create payment URL" });
  }
};
exports.vnpayReturn = async (req, res) => {
  console.log("VNPay return called with query:", req.query);

  try {
    const vnp_Params = { ...req.query };
    const secureHash = vnp_Params["vnp_SecureHash"];

    // Remove hash parameters
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    // Verify signature
    const sortedParams = sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash !== signed) {
      console.error("Hash validation failed!");
      return res.redirect(
        `${process.env.FRONTEND_URL}/cart?responseCode=97` //Chữ ký không hợp lệ
      );
    }

    // Check payment success
    if (vnp_Params["vnp_ResponseCode"] === "00") {
      // THANH TOÁN THÀNH CÔNG - TẠO ORDER VÀ TRỪ STOCK
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Lấy order data từ vnp_OrderInfo với error handling
        // let orderData;
        // try {
        //   console.log("Raw vnp_OrderInfo:", vnp_Params["vnp_OrderInfo"]);
        //   orderData = JSON.parse(vnp_Params["vnp_OrderInfo"]);
        //   console.log("Parsed orderData:", orderData);
        // } catch (parseError) {
        //   console.error("JSON parse error:", parseError);
        //   console.error("vnp_OrderInfo content:", vnp_Params["vnp_OrderInfo"]);

        //   await session.abortTransaction();
        //   session.endSession();

        //   return res.redirect(
        //     `${process.env.FRONTEND_URL}/cart?responseCode=99`
        //   );
        // }

        const tempOrderId = vnp_Params["vnp_TxnRef"];

        // LẤY ORDER DATA TỪ DATABASE TEMP
        const tempOrder = await TempOrder.findOne({ tempId: tempOrderId });
        if (!tempOrder) {
          console.error("Temp order not found:", tempOrderId);
          await session.abortTransaction();
          session.endSession();
          return res.redirect(
            `${process.env.FRONTEND_URL}/cart?responseCode=99`
          );
        }

        const orderData = tempOrder.orderData;
        console.log("Order data retrieved from temp storage: kkkk", orderData);

        const {
          userId,
          shippingAddress,
          subTotal,
          discountAmount,
          shippingFee,
          totalAmount,
          promotionId,
          shippingMethod,
          note,
          selectedCartItemIds,
          orderItems,
        } = orderData;

        console.log("Order data retrieved from temp storage:", orderData);
        // Validate required fields
        if (!userId || !shippingAddress || !orderItems || !orderItems.length) {
          console.error("Missing required order data fields");
          await session.abortTransaction();
          session.endSession();

          return res.redirect(
            `${process.env.FRONTEND_URL}/cart?responseCode=99`
          );
        }

        // TẠO ORDER SAU KHI THANH TOÁN THÀNH CÔNG
        const createdOrder = await Order.create(
          [
            {
              userId,
              shippingAddress,
              subTotal,
              discountAmount,
              shippingFee,
              totalAmount,
              promotionId,
              shippingMethod,
              orderStatus: "Processing",
              paymentStatus: "Paid",
              paymentMethod: "VNPAY",
              paymentTransactionId: vnp_Params["vnp_TransactionNo"],
              orderDate: new Date(),
              note,
            },
          ],
          { session }
        ).then((order) => order[0]);

        // Tạo order items và TRỪ STOCK
        for (const item of orderItems) {
          await OrderItem.create(
            [
              {
                orderId: createdOrder._id,
                ...item,
              },
            ],
            { session }
          );

          // TRỪ STOCK KHI THANH TOÁN THÀNH CÔNG
          await Product.findByIdAndUpdate(
            item.productId,
            {
              $inc: { stock: -item.quantity },
            },
            { session }
          );
        }

        // Xử lý promotion
        if (promotionId && discountAmount > 0) {
          await PromotionUsage.create(
            [
              {
                promotionId,
                userId,
                orderId: createdOrder._id,
                discountAmount,
              },
            ],
            { session }
          );

          await Promotion.findByIdAndUpdate(
            promotionId,
            {
              $inc: { usedCount: 1 },
            },
            { session }
          );
        }

        // Tạo shipping
        await Shipping.create(
          [
            {
              orderId: createdOrder._id,
              deliveryStatus: "Shipping",
            },
          ],
          { session }
        );

        // Xóa cart items
        if (selectedCartItemIds && selectedCartItemIds.length > 0) {
          await CartItem.deleteMany(
            { _id: { $in: selectedCartItemIds } },
            { session }
          );

          const cart = await Cart.findOne({ userId });
          if (cart) {
            const remainingItems = await CartItem.find({ cartId: cart._id });
            if (remainingItems.length === 0) {
              await Cart.findByIdAndDelete(cart._id, { session });
            }
          }
        }

        await TempOrder.deleteOne({ tempId: tempOrderId }, { session });

        await session.commitTransaction();
        session.endSession();

        console.log(
          "Payment processed successfully for order:",
          createdOrder._id
        );

        // REDIRECT TỚI SUCCESS PAGE
        return res.redirect(
          `${process.env.FRONTEND_URL}/invoice?orderId=${createdOrder._id}&paymentMethod=VNPAY&status=success`
        );
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Lỗi tạo đơn hàng sau thanh toán:", error);

        return res.redirect(
          `${process.env.FRONTEND_URL}/cart?responseCode=500` // Lỗi server
        );
      }
    } else {
      console.log(
        "Payment failed with response code:",
        vnp_Params["vnp_ResponseCode"]
      );

      console.log("Full VNPay response:", vnp_Params);

      return res.redirect(
        `${process.env.FRONTEND_URL}/cart?responseCode=${vnp_Params["vnp_ResponseCode"]}`
      );
    }
  } catch (error) {
    console.error("Lỗi xử lý VNPay return:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/cart?responseCode=500`);
  }
};
