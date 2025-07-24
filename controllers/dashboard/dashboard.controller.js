// controllers/dashboard.controller.js

const User = require('../../models/user/user.model');
const Order = require('../../models/order/order.model');
const OrderItem = require('../../models/order/orderItem.model');
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


// exports.getTopProducts = async (req, res) => {
//   try {
//     const topProducts = await Product.find({ sold: { $gt: 0 } })
//       .sort({ sold: -1 })           
//       .limit(5)                     
//       .select('name price imgUrls sold');

//     res.status(200).json(topProducts);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

exports.getTopProducts = async (req, res) => {
  try {
    const { month, year } = req.query;

    const now = new Date();
    const selectedMonth = parseInt(month) || now.getMonth() + 1; // JS month: 0-based
    const selectedYear = parseInt(year) || now.getFullYear();

    
    const startDate = new Date(selectedYear, selectedMonth - 1, 1); 
    const endDate = new Date(selectedYear, selectedMonth, 1); 

    const topProducts = await OrderItem.aggregate([
      
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order"
        }
      },
      { $unwind: "$order" },

      
      {
        $match: {
          "order.orderStatus": "Success",
          "order.orderDate": {
            $gte: startDate,
            $lt: endDate
          }
        }
      },

      // Nhóm theo productId và tính tổng số lượng bán
      {
        $group: {
          _id: "$productId",
          totalQuantitySold: { $sum: "$quantity" }
        }
      },

      // Join lại để lấy thông tin sản phẩm
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },

      // Chỉ lấy sản phẩm còn tồn tại
      {
        $match: {
          "product.isDeleted": { $ne: true }
        }
      },

      // Sort theo số lượng bán giảm dần
      { $sort: { totalQuantitySold: -1 } },

      // Giới hạn top 5
      { $limit: 5 },

      // Format output
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$product.name",
          price: "$product.price",
          imgUrls: "$product.imgUrls",
          sold: "$totalQuantitySold"
        }
      }
    ]);

    res.status(200).json(topProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProductsSoldByCategory = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || moment().month() + 1;
    const year = parseInt(req.query.year) || moment().year();

    const startOfMonth = moment(`${year}-${month}-01`).startOf('month').toDate();
    const endOfMonth = moment(`${year}-${month}-01`).endOf('month').toDate();

    const productsSoldByCategory = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          orderStatus: 'Success'
        }
      },
      {
        $lookup: {
          from: 'orderitems',
          localField: '_id',
          foreignField: 'orderId',
          as: 'orderItems'
        }
      },
      {
        $unwind: '$orderItems'
      },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $group: {
          _id: '$category._id',
          categoryName: { $first: '$category.name' },
          totalQuantitySold: { $sum: '$orderItems.quantity' }
        }
      },
      {
        $sort: { totalQuantitySold: -1 }
      }
    ]);

    // Tính phần trăm cho pie chart
    const totalQuantity = productsSoldByCategory.reduce((sum, item) => sum + item.totalQuantitySold, 0);
    
    const formattedData = productsSoldByCategory.map(item => ({
      categoryId: item._id,
      categoryName: item.categoryName,
      totalQuantitySold: item.totalQuantitySold,
      percentage: totalQuantity > 0 ? 
        parseFloat(((item.totalQuantitySold / totalQuantity) * 100).toFixed(2)) : 0
    }));

    res.status(200).json({
      data: formattedData,
      totalQuantity: totalQuantity,
      period: {
        month: month,
        year: year
      }
    });

  } catch (err) {
    console.error('Error in getProductsSoldByCategory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getTopProductsForHomepage = async (req, res) => {
  try {
    const topProducts = await OrderItem.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order"
        }
      },
      { $unwind: "$order" },

      // Chỉ lấy đơn hàng thành công
      {
        $match: {
          "order.orderStatus": "Success"
          // Không filter theo orderDate để lấy all-time best sellers
        }
      },

      // Nhóm theo productId và tính tổng số lượng bán
      {
        $group: {
          _id: "$productId",
          totalQuantitySold: { $sum: "$quantity" }
        }
      },

      // Join với bảng products
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },

      // Chỉ lấy sản phẩm public
      {
        $match: {
          "product.isPublic": true
        }
      },

      // Sort theo số lượng bán giảm dần
      { $sort: { totalQuantitySold: -1 } },

      // Chỉ lấy 2 sản phẩm top
      { $limit: 2 },

      // Format output giống hệt getTopProducts
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$product.name",
          price: "$product.price",
          imgUrls: "$product.imgUrls",
          sold: "$totalQuantitySold"
        }
      }
    ]);

    res.status(200).json(topProducts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};