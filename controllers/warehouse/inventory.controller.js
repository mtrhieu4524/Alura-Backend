const BatchStock = require("../../models/batch/batchStock.model");
const Batch = require("../../models/batch/batch.model");
const Distributor = require("../../models/batch/distributor.model");
const Warehouse = require("../../models/warehouse/warehouse.model");

exports.getInventoryByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Lấy tất cả batchStock còn hàng theo productId
    const batchStocks = await BatchStock.find({ productId, remaining: { $gt: 0 } })
      .populate({
        path: "batchId",
        populate: [
          { path: "distributorId", model: Distributor },
          { path: "warehouseId", model: Warehouse },
        ],
      })
      .sort({ "batchId.expiryDate": 1 }); 

    const inventoryList = batchStocks.map((bs) => ({
      batchStockId: bs._id,
      batchId: bs.batchId._id,
      batchCode: bs.batchId.batchCode,
      remaining: bs.remaining,
      expiryDate: bs.batchId.expiryDate,
      warehouse: {
        id: bs.batchId.warehouseId._id,
        name: bs.batchId.warehouseId.name,
      },
      distributor: {
        id: bs.batchId.distributorId._id,
        name: bs.batchId.distributorId.name,
      },
    }));

    const totalRemaining = inventoryList.reduce((sum, i) => sum + i.remaining, 0);

    res.json({
      success: true,
      productId,
      totalRemaining,
      batchCount: inventoryList.length,
      data: inventoryList,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi lấy tồn kho theo sản phẩm",
      error: err.message,
    });
  }
};
