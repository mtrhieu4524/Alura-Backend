const Warehouse = require("../../models/warehouse/warehouse.model");
const Batch = require("../../models/batch/batch.model");



exports.createWarehouse = async (req, res) => {
  try {
    const { name, adminId } = req.body;

    if (!name || !adminId) {
      return res.status(400).json({ message: "Thiếu tên hoặc adminId" });
    }

    const warehouse = new Warehouse({ name, adminId });
    await warehouse.save();

    res.status(201).json({ success: true, data: warehouse });
  } catch (err) {
    res.status(500).json({ message: "Tạo warehouse thất bại", error: err.message });
  }
};


exports.getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find().sort({ createdAt: -1 });
    res.json({ success: true, data: warehouses });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách warehouse", error: err.message });
  }
};


exports.getWarehouseById = async (req, res) => {
  try {
    const { warehouseId } = req.params;

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ message: "Không tìm thấy kho" });
    }

    // Tính totalBatch và totalStock
    const batches = await Batch.find({ warehouseId });

    const totalBatch = batches.length;
    const totalStock = batches.reduce((sum, b) => sum + (b.quantity || 0), 0);

    res.json({
      success: true,
      data: {
        ...warehouse.toObject(),
        totalBatch,
        totalStock,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi lấy kho và tính tổng tồn kho",
      error: err.message,
    });
  }
};


exports.updateWarehouse = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const { name, adminId } = req.body;

    const warehouse = await Warehouse.findByIdAndUpdate(
      warehouseId,
      { name, adminId },
      { new: true }
    );

    if (!warehouse) {
      return res.status(404).json({ message: "Không tìm thấy kho" });
    }

    res.json({ success: true, data: warehouse });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật kho", error: err.message });
  }
};


