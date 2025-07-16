// controllers/payment.controller.js
const qs = require("qs");
const moment = require("moment");
const crypto = require("crypto");
const mongoose = require("mongoose");

const BatchStock = require("../../models/batch/batchStock.model");
const Batch = require("../../models/batch/batch.model");

const Product = require("../../models/product.model");
const Order = require("../../models/order/order.model");
const OrderItem = require("../../models/order/orderItem.model");
const Promotion = require("../../models/promotion/promotion.model"); 
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
    await TempOrder.create({
      tempId: orderId,
      orderData: orderData,
    });

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
    return res.json({ paymentUrl });
  } catch (error) {
    console.error("Error creating payment URL:", error);
    return res.status(500).json({ error: "Failed to create payment URL" });
  }
};

exports.vnpayReturn = async (req, res) => {
  try {
    const vnp_Params = { ...req.query };
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

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

    if (vnp_Params["vnp_ResponseCode"] === "00") {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const tempOrderId = vnp_Params["vnp_TxnRef"];

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

        if (!userId || !shippingAddress || !orderItems || !orderItems.length) {
          console.error("Missing required order data fields");
          await session.abortTransaction();
          session.endSession();

          return res.redirect(
            `${process.env.FRONTEND_URL}/cart?responseCode=99`
          );
        }

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

        // for (const item of orderItems) {
        //   await OrderItem.create(
        //     [
        //       {
        //         orderId: createdOrder._id,
        //         ...item,
        //       },
        //     ],
        //     { session }
        //   );

        //   await Product.findByIdAndUpdate(
        //     item.productId,
        //     {
        //       $inc: { stock: -item.quantity, sold: item.quantity },
        //     },
        //     { session }
        //   );
        // }

        // for (const item of orderItems) {
        //   await OrderItem.create(
        //     [
        //       {
        //         orderId: createdOrder._id,
        //         ...item,
        //       },
        //     ],
        //     { session }
        //   );

        //   // FIFO: Lấy batch cũ nhất có stock > 0 từ store
        //   const availableBatches = await BatchStock.find({
        //     productId: item.productId,
        //     remaining: { $gt: 0 },
        //     isOrigin: false // Chỉ lấy từ store
        //   }).populate('batchId').sort({ 'batchId.expiryDate': 1 });

        //   let remainingToDeduct = item.quantity;
          
        //   for (const batchStock of availableBatches) {
        //     if (remainingToDeduct <= 0) break;
            
        //     const canDeduct = Math.min(batchStock.remaining, remainingToDeduct);
            
        //     await BatchStock.findByIdAndUpdate(batchStock._id, {
        //       $inc: { remaining: -canDeduct }
        //     }, { session });
            
        //     remainingToDeduct -= canDeduct;
        //   }

        //   // Cập nhật tổng stock và sold trong Product
        //   await Product.findByIdAndUpdate(
        //     item.productId,
        //     {
        //       $inc: { stock: -item.quantity, sold: item.quantity },
        //     },
        //     { session }
        //   );
        // }

        for (const item of orderItems) {
          const availableBatches = await BatchStock.find({
            productId: item.productId,
            remaining: { $gt: 0 },
            isOrigin: false
          }).populate("batchId").sort({ "batchId.expiryDate": 1 });

          let remainingToDeduct = item.quantity;

          for (const batchStock of availableBatches) {
            if (remainingToDeduct <= 0) break;

            const canDeduct = Math.min(batchStock.remaining, remainingToDeduct);

            await BatchStock.findByIdAndUpdate(batchStock._id, {
              $inc: { remaining: -canDeduct }
            }, { session });

            
            await OrderItem.create([
              {
                orderId: createdOrder._id,
                productId: item.productId,
                quantity: canDeduct,
                unitPrice: item.unitPrice,
                productName: item.productName,
                productImgUrl: item.productImgUrl,
                batchId: batchStock.batchId._id,
              }
            ], { session });

            remainingToDeduct -= canDeduct;
          }

          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity, sold: item.quantity }
          }, { session });
        }

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

        await Shipping.create(
          [
            {
              orderId: createdOrder._id,
              deliveryStatus: "Shipping",
            },
          ],
          { session }
        );

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

        return res.redirect(
          `${process.env.FRONTEND_URL}/order-history?orderId=${createdOrder._id}&paymentMethod=VNPAY&status=success`
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
      return res.redirect(
        `${process.env.FRONTEND_URL}/cart?responseCode=${vnp_Params["vnp_ResponseCode"]}`
      );
    }
  } catch (error) {
    console.error("Lỗi xử lý VNPay return:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/cart?responseCode=500`);
  }
};
