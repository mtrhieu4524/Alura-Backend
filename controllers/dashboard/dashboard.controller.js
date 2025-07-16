// controllers/dashboard.controller.js

const User = require('../../models/user/user.model');
const Order = require('../../models/order/order.model');
const Product = require('../../models/product.model');
const Batch = require('../../models/batch/batch.model');
const moment = require('moment');

exports.getSummary = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || moment().month() + 1;
    const year = parseInt(req.query.year) || moment().year();

    const startOfMonth = moment(`${year}-${month}-01`).startOf('month').toDate();
    const endOfMonth = moment(`${year}-${month}-01`).endOf('month').toDate();

    const lastMonth = moment(startOfMonth).subtract(1, 'month');
    const startOfLastMonth = lastMonth.clone().startOf('month').toDate();
    const endOfLastMonth = lastMonth.clone().endOf('month').toDate();

    // USER đã từng mua hàng
    const userIds = await Order.distinct('userId');
    const customers = await User.countDocuments({
      _id: { $in: userIds },
      role: 'USER'
    });

    // Orders Success tháng này & tháng trước
    const ordersThisMonth = await Order.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      orderStatus: 'Success'
    });

    const ordersLastMonth = await Order.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      orderStatus: 'Success'
    });

    // Revenue tháng này
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
    const revenue = earningsAgg.length > 0 ? earningsAgg[0].total : 0;

    // % tăng trưởng đơn hàng
    let growth = 0;
    if (ordersLastMonth === 0 && ordersThisMonth > 0) {
      growth = 100;
    } else if (ordersLastMonth === 0 && ordersThisMonth === 0) {
      growth = 0;
    } else {
      growth = ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100;
    }

  
  const totalProducts = await Product.countDocuments({ isPublic: true });
  const totalBatches = await Batch.countDocuments({ status: 'active' });
  const totalAccounts = await User.countDocuments({ isActive: true });

    // Trả dữ liệu
    res.status(200).json({
      customers,
      orders: ordersThisMonth,
      revenue: parseFloat(revenue.toFixed(2)),
      // growth: parseFloat(growth.toFixed(2)),
      totalAccounts,
      totalProducts,
      totalBatches
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getTopProducts = async (req, res) => {
  try {
    const topProducts = await Product.find({ sold: { $gt: 0 } })
      .sort({ sold: -1 })           
      .limit(5)                     
      .select('name price imgUrls sold');

    res.status(200).json(topProducts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

