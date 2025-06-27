//controllers/warehouse/inventoryMovement.controller.js

const InventoryMovement = require("../../models/warehouse/inventoryMovement.model");
const Batch = require("../../models/batch/batch.model");
const Warehouse = require("../../models/warehouse/warehouse.model");

// ✅ Tạo nhật ký nhập / xuất / điều chỉnh kho
exports.createInventoryMovement = async (req, res) => {
  try {
    const { batchId, warehouseId, movementType, batchQuantity, actionDate, handledBy, note } = req.body;

    // Kiểm tra cơ bản
    if (!batchId || !warehouseId || !movementType || !batchQuantity || !handledBy) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc." });
    }

    // Kiểm tra enum movementType
    if (!["import", "export", "adjustment"].includes(movementType)) {
      return res.status(400).json({ message: "movementType không hợp lệ." });
    }

    // Kiểm tra batch tồn tại
    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: "Không tìm thấy batch." });

    const movement = new InventoryMovement({
      batchId,
      warehouseId,
      movementType,
      batchQuantity,
      actionDate: actionDate || new Date(),
      handledBy,
      note,
    });

    await movement.save();

    return res.status(201).json({ success: true, data: movement });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi tạo InventoryMovement", error: err.message });
  }
};

// ✅ Lấy tất cả nhật ký (lọc theo warehouse, type, date)
exports.getAllInventoryMovements = async (req, res) => {
  try {
    const { warehouseId, movementType, fromDate, toDate } = req.query;

    const filter = {};
    if (warehouseId) filter.warehouseId = warehouseId;
    if (movementType) filter.movementType = movementType;
    if (fromDate || toDate) {
      filter.actionDate = {};
      if (fromDate) filter.actionDate.$gte = new Date(fromDate);
      if (toDate) filter.actionDate.$lte = new Date(toDate);
    }

    const movements = await InventoryMovement.find(filter)
      .populate("batchId", "batchCode")
      .populate("warehouseId", "name")
      .populate("handledBy", "name email")
      .sort({ actionDate: -1 });

    return res.json({ success: true, data: movements });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi lấy danh sách movement", error: err.message });
  }
};

// ✅ Lấy chi tiết movement
exports.getInventoryMovementById = async (req, res) => {
  try {
    const movement = await InventoryMovement.findById(req.params.movementId)
      .populate("batchId", "batchCode")
      .populate("warehouseId", "name")
      .populate("handledBy", "name email");

    if (!movement) return res.status(404).json({ message: "Không tìm thấy movement." });

    return res.json({ success: true, data: movement });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi lấy chi tiết movement", error: err.message });
  }
};

// ✅ Xóa movement (tuỳ nhu cầu, có thể hạn chế nếu cần)
exports.deleteInventoryMovement = async (req, res) => {
  try {
    const movement = await InventoryMovement.findByIdAndDelete(req.params.movementId);
    if (!movement) return res.status(404).json({ message: "Không tìm thấy movement." });

    return res.json({ success: true, message: "Đã xoá movement", data: movement });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi xoá movement", error: err.message });
  }
};
