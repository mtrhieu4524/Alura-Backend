// jobs/autoCancelUnpaidOrders.js
const cron = require("node-cron");
const mongoose = require("mongoose");
const Order = require("../../models/order/order.model");
const OrderItem = require("../../models/order/orderItem.model");
const Product = require("../../models/product.model");

const autoCancelUnpaidOrders = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    try {
      //áp dụng cho đơn thanh toán online
      const expiredOrders = await Order.find({
        paymentStatus: "Pending",
        createdAt: { $lt: oneHourAgo },
        orderStatus: "Pending",
        paymentMethod: { $ne: "COD" }, //xử lý đơn không phải COD
      });

      let orderCount = 0;

      for (const order of expiredOrders) {
        const orderItems = await OrderItem.find({ orderId: order._id });

        for (const item of orderItems) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: item.quantity },
          });
        }

        order.paymentStatus = "Failed";
        order.orderStatus = "Cancelled";
        await order.save();

        orderCount += 1;
        console.log(`Đã hủy đơn: ${order._id}`);
      }

      if (orderCount > 0) {
        console.log(`Tổng đơn bị hủy do treo quá 60 phút: ${orderCount}`);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý AUTO-CANCEL đơn:", error);
    }
  });

  console.log("Đã bật JOB AUTO-CANCEL đơn treo sau 60 PHÚT");
};

module.exports = autoCancelUnpaidOrders;