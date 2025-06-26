const Batch = require("../../models/batch/batch.model");
const Product = require("../../models/product.model");
const Distributor = require("../../models/batch/distributor.model");
const Warehouse = require("../../models/warehouse/warehouse.model");

// ✅ Tạo batch mới
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

    const exists = await Batch.findOne({ batchCode });
    if (exists) {
      return res.status(400).json({ message: "Mã batch đã tồn tại." });
    }

    const batch = new Batch({
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

    await batch.save();
    return res.status(201).json({ success: true, data: batch });
  } catch (err) {
    return res.status(500).json({ message: "Tạo batch thất bại.", error: err.message });
  }
};

// ✅ Lấy tất cả batch (filter theo query)
exports.getAllBatches = async (req, res) => {
  try {
    const { status, productId, distributorId, warehouseId } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (productId) filter.productId = productId;
    if (distributorId) filter.distributorId = distributorId;
    if (warehouseId) filter.warehouseId = warehouseId;

    const batches = await Batch.find(filter)
      .populate("productId", "name")
      .populate("distributorId", "name")
      .populate("warehouseId", "name")
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: batches });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi lấy danh sách batch", error: err.message });
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
