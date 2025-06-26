// jobs/autoCancelUnpaidOrders.js
const cron = require("node-cron");
const mongoose = require("mongoose");
const Order = require("../../models/order/order.model");
const OrderItem = require("../../models/order/orderItem.model");
const Product = require("../../models/product.model");

const autoCancelUnpaidOrders = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    try {
      const expiredOrders = await Order.find({
        paymentStatus: "Pending",
        createdAt: { $lt: fifteenMinutesAgo },
        orderStatus: "Pending",
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
        console.log(`🔁 Đã hủy đơn: ${order._id}`);
      }

      if (orderCount > 0) {
        console.log(`📊 Tổng đơn bị hủy do treo quá 15 phút: ${orderCount}`);
      }
    } catch (error) {
      console.error("❌ Lỗi khi xử lý auto-cancel đơn:", error);
    }
  });

  console.log("✅ Đã bật job auto-cancel đơn treo sau 15 phút.");
};

module.exports = autoCancelUnpaidOrders;