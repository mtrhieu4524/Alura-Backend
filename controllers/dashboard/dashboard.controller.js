// controllers/dashboard.controller.js

const User = require('../../models/user/user.model');
const Order = require('../../models/order/order.model');
const moment = require('moment');

exports.getSummary = async (req, res) => {
  try {
    
    const month = parseInt(req.query.month) || moment().month() + 1; // month() trả 0-11
    const year = parseInt(req.query.year) || moment().year();

    //Xác định startOfMonth & endOfMonth
    const startOfMonth = moment(`${year}-${month}-01`).startOf('month').toDate();
    const endOfMonth = moment(`${year}-${month}-01`).endOf('month').toDate();

    
    const lastMonth = moment(startOfMonth).subtract(1, 'month');
    const startOfLastMonth = lastMonth.clone().startOf('month').toDate();
    const endOfLastMonth = lastMonth.clone().endOf('month').toDate();

    //USER đã từng mua hàng
    const userIds = await Order.distinct('userId');
    const customers = await User.countDocuments({
      _id: { $in: userIds },
      role: 'USER'
    });

    //Orders this month (Success)
    const ordersThisMonth = await Order.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      orderStatus: 'Success'
    });

    //Orders last month (Success)
    const ordersLastMonth = await Order.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      orderStatus: 'Success'
    });

    //Earnings this month
    const earningsAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          orderStatus: 'Success',
          paymentStatus: 'Paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const earnings = earningsAgg.length > 0 ? earningsAgg[0].total : 0;

    // ✅ Calculate growth (% tăng số order)
    let growth = 0;
    if (ordersLastMonth === 0 && ordersThisMonth > 0) {
      growth = 100;
    } else if (ordersLastMonth === 0 && ordersThisMonth === 0) {
      growth = 0;
    } else {
      growth = ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100;
    }

    // ✅ Response
    res.status(200).json({
      customers,
      orders: ordersThisMonth,
      earnings,
      growth: parseFloat(growth.toFixed(2))
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
