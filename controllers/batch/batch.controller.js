const Batch = require("../../models/batch/batch.model");
const Product = require("../../models/product.model");
const Distributor = require("../../models/batch/distributor.model");
const Warehouse = require("../../models/warehouse/warehouse.model");
const BatchStock = require("../../models/batch/batchStock.model");
const InventoryMovement = require("../../models/warehouse/inventoryMovement.model");

//create new batch
exports.createBatch = async (req, res) => {
  try {
    const {
      batchCode,
      productId,
      distributorId,
      warehouseId,
      certificateId,
      brandId,
      imageUrl,
      quantity,
      amount,
      expiryDate,
      importDate,
      notes,
    } = req.body;

    // 1. Tạo batch mới
    const newBatch = await Batch.create({
      batchCode,
      productId,
      distributorId,
      warehouseId,
      certificateId,
      brandId,
      imageUrl,
      quantity,
      amount,
      expiryDate,
      importDate,
      notes,
    });

    // 2. Tạo batchStock gốc
    const batchStock = await BatchStock.create({
      batchId: newBatch._id,
      productId,
      warehouseId,
      quantity,
      remaining: quantity,
      note: `Tự động tạo tồn kho khi nhập batch ${batchCode}`,
    });

    // 3. Ghi log nhập kho
    await InventoryMovement.create({
      batchId: newBatch._id,
      warehouseId,
      movementType: "import",
      batchQuantity: quantity,
      actionDate: new Date(),
      handledBy: req.user?._id || null,
      note: `Tự động ghi log khi nhập batch ${batchCode}`,
    });

    res.status(201).json({ success: true, data: newBatch });
  } catch (err) {
    res.status(500).json({
      message: "Tạo batch thất bại",
      error: err.message,
    });
  }
};

exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate("productId", "name")
      .populate("distributorId", "name")
      .populate("warehouseId", "name");

    res.json({ success: true, data: batches });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách batch", error: err.message });
  }
};

// ✅ Lấy chi tiết 1 batch
exports.getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.batchId)
      .populate("productId", "name")
      .populate("distributorId", "name")
      .populate("warehouseId", "name");

    if (!batch) {
      return res.status(404).json({ message: "Không tìm thấy batch." });
    }

    return res.json({ success: true, data: batch });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi lấy chi tiết batch", error: err.message });
  }
};

// ✅ Cập nhật batch
exports.updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch không tồn tại." });
    }

    const fields = [
      "distributorId", "warehouseId", "certificateId", "brandId",
      "imageUrl", "quantity", "amount", "expiryDate", "importDate", "notes"
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        batch[field] = req.body[field];
      }
    });

    await batch.save();
    return res.json({ success: true, data: batch });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi cập nhật batch", error: err.message });
  }
};

// ✅ Khóa batch thủ công (hủy, thu hồi)
exports.lockBatch = async (req, res) => {
  try {
    const { status, lockedReason } = req.body;

    const validStatuses = ["recalled", "cancelled", "expired"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ." });
    }

    const batch = await Batch.findById(req.params.batchId);
    if (!batch) return res.status(404).json({ message: "Batch không tồn tại." });

    batch.status = status;
    batch.lockedReason = lockedReason || "Đã khoá theo yêu cầu";
    await batch.save();

    return res.json({ success: true, data: batch, message: `Batch đã được chuyển sang trạng thái "${status}"` });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi khóa batch", error: err.message });
  }
};

// ✅ Soft delete (huỷ logic batch)
exports.deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.batchId);
    if (!batch) return res.status(404).json({ message: "Batch không tồn tại." });

    batch.status = "cancelled";
    batch.lockedReason = "Đã huỷ (soft delete)";
    await batch.save();

    return res.json({ success: true, message: "Đã huỷ batch thành công.", data: batch });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi huỷ batch", error: err.message });
  }
};

exports.adjustBatchQuantity = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { newQuantity, handledBy, note } = req.body;

    if (newQuantity === undefined || newQuantity < 0)
      return res.status(400).json({ message: "newQuantity không hợp lệ" });

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: "Batch không tồn tại" });

    const oldQuantity = batch.quantity;
    if (oldQuantity === newQuantity)
      return res.status(400).json({ message: "Không có thay đổi số lượng" });

    const delta = newQuantity - oldQuantity;

    await InventoryMovement.create({
      batchId: batch._id,
      warehouseId: batch.warehouseId,
      movementType: "adjustment",
      batchQuantity: Math.abs(delta),
      actionDate: new Date(),
      handledBy: req.user?._id || handledBy,
      note: note || `Điều chỉnh từ ${oldQuantity} → ${newQuantity}`,
    });

    batch.quantity = newQuantity;
    await batch.save();

    res.json({ success: true, message: "Đã điều chỉnh batch", data: batch });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi điều chỉnh batch", error: err.message });
  }
};
