const BatchStock = require("../models/batchStock.model");
const Batch = require("../models/batch.model");
const InventoryMovement = require("../../models/warehouse/inventoryMovement.model");



// Tạo BatchStock (khi staff lấy hàng từ kho để bán)
exports.createBatchStock = async (req, res) => {
  try {
    const { batchId, productId, warehouseId, quantity, location, note, handledBy } = req.body;

    const batchStock = new BatchStock({
      batchId,
      productId,
      warehouseId,
      quantity,
      remaining: quantity,
      location,
      note,
    });

    await batchStock.save();

    // ✅ Ghi log export movement
    await InventoryMovement.create({
      batchId,
      warehouseId,
      movementType: "export",
      batchQuantity: quantity,
      actionDate: new Date(),
      handledBy: req.user?._id || handledBy,
      note: "Xuất batch để trưng bày bán",
    });

    res.status(201).json({ success: true, data: batchStock });
  } catch (err) {
    res.status(500).json({ message: "Tạo batchStock thất bại", error: err.message });
  }
};

exports.getAllBatchStocks = async (req, res) => {
  try {
    const stocks = await BatchStock.find().sort({ createdAt: -1 });
    res.json({ success: true, data: stocks });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy batchStock", error: err.message });
  }
};

// ✅ Lấy toàn bộ batchStock (lọc theo warehouse, product, batch)
exports.getAllBatchStocks = async (req, res) => {
  try {
    const { warehouseId, productId, batchId } = req.query;

    const filter = {};
    if (warehouseId) filter.warehouseId = warehouseId;
    if (productId) filter.productId = productId;
    if (batchId) filter.batchId = batchId;

    const result = await BatchStock.find(filter)
      .populate("productId", "name")
      .populate("batchId", "batchCode status expiryDate")
      .populate("warehouseId", "name");

    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi lấy danh sách batchStock", error: err.message });
  }
};

// ✅ Lấy chi tiết batchStock
exports.getBatchStockById = async (req, res) => {
  try {
    const batchStock = await BatchStock.findById(req.params.batchStockId)
      .populate("productId", "name")
      .populate("batchId", "batchCode status expiryDate")
      .populate("warehouseId", "name");

    if (!batchStock) return res.status(404).json({ message: "Không tìm thấy batchStock." });

    return res.json({ success: true, data: batchStock });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi lấy batchStock", error: err.message });
  }
};

// ✅ Cập nhật số lượng batchStock
exports.updateBatchStock = async (req, res) => {
  try {
    const batchStock = await BatchStock.findById(req.params.batchStockId);
    if (!batchStock) return res.status(404).json({ message: "Không tìm thấy batchStock." });

    const { quantity, remaining } = req.body;

    if (quantity !== undefined) batchStock.quantity = quantity;
    if (remaining !== undefined) batchStock.remaining = remaining;

    await batchStock.save();
    return res.json({ success: true, data: batchStock });
  } catch (err) {
    return res.status(500).json({ message: "Cập nhật batchStock thất bại", error: err.message });
  }
};

// ✅ Xoá batchStock
exports.deleteBatchStock = async (req, res) => {
  try {
    const batchStock = await BatchStock.findByIdAndDelete(req.params.batchStockId);
    if (!batchStock) return res.status(404).json({ message: "Không tìm thấy batchStock." });

    return res.json({ success: true, message: "Đã xoá batchStock", data: batchStock });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi xoá batchStock", error: err.message });
  }
};
