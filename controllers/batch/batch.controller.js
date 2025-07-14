const Batch = require("../../models/batch/batch.model");
const Product = require("../../models/product.model");
const Distributor = require("../../models/batch/distributor.model");
const Warehouse = require("../../models/warehouse/warehouse.model");
const BatchStock = require("../../models/batch/batchStock.model");
const InventoryMovement = require("../../models/warehouse/inventoryMovement.model");
const mongoose = require("mongoose");


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

    //1. tao batch
    const newBatch = new Batch({
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
      status: "active",
    });

    await newBatch.save();

    //2. Tạo tồn kho gốc (ở kho nhập về)
    const originStock = new BatchStock({
      batchId: newBatch._id,
      productId,
      warehouseId,
      quantity,
      remaining: quantity,
      isOrigin: true, 
    });

    await originStock.save();

    // 2. auto Ghi nhật ký nhập kho
    await InventoryMovement.create({
      batchId: newBatch._id,
      warehouseId,
      movementType: "import",
      batchQuantity: quantity,
      actionDate: new Date(),
      handledBy: req.user?._id || null,
      note: `Tự động ghi log khi nhập batch ${batchCode}`,
    });

    return res.status(201).json({ success: true, data: newBatch });
  } catch (err) {
    return res.status(500).json({
      message: "Tạo batch thất bại",
      error: err.message,
    });
  }
};

exports.getAllBatches = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search) {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(search);
      if (isValidObjectId) {
        filter = { _id: search };
      } else {
        filter = { batchCode: { $regex: search, $options: "i" } };
      }
    }

    // Lấy danh sách batches
    const batches = await Batch.find(filter)
      .populate("productId", "name")
      .populate("distributorId", "name")
      .populate("warehouseId", "name")
      .sort({ createdAt: -1 });

    if (!batches || batches.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy kết quả phù hợp" });
    }

    // Tạo danh sách kết quả mới với remaining
    const batchResults = await Promise.all(
      batches.map(async (batch) => {
        // Lấy tồn kho gốc
        const originStock = await BatchStock.findOne({
          batchId: batch._id,
          isOrigin: true,
        });

        const remaining = originStock ? originStock.remaining : 0;

        return {
          _id: batch._id,
          batchCode: batch.batchCode,
          productId: batch.productId,
          distributorId: batch.distributorId,
          warehouseId: batch.warehouseId,
          amount: batch.amount,
          quantity: batch.quantity,
          expiryDate: batch.expiryDate,
          notes: batch.notes,
          createdAt: batch.createdAt,
          updatedAt: batch.updatedAt,
          remaining, 
        };
      })
    );

    res.json({ success: true, data: batchResults });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách batch", error: err.message });
  }
};
  

exports.getBatchSummary = async (req, res) => {
  try {
    const { batchId } = req.params;

    // 1. Lấy batch
    const batch = await Batch.findById(batchId)
      .populate("productId", "name")
      .populate("distributorId", "name")
      .populate("certificateId", "certificateCode")
      .populate("warehouseId", "name");

    if (!batch) {
      return res.status(404).json({ message: "Không tìm thấy batch." });
    }

    // 2. Lấy toàn bộ batchStock liên quan
    const allStocks = await BatchStock.find({ batchId }).populate("warehouseId", "name");

    const originStock = allStocks.find(stock => stock.isOrigin);
    const remainingAtOrigin = originStock?.remaining || 0;

    const exported = batch.quantity - remainingAtOrigin;

    const remainingInStore = allStocks
      .filter(stock => !stock.isOrigin)
      .map(stock => ({
        warehouseId: stock.warehouseId?._id,
        remaining: stock.remaining,
        quantity: stock.quantity,
        batchStockId: stock._id,
      }));

    return res.json({
      batchId: batch._id,
      batchCode: batch.batchCode,
      product: batch.productId?.name,
      distributor: batch.distributorId?.name,
      quantityImported: batch.quantity,
      remainingAtOrigin,
      exported,
      remainingInStore,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Lỗi khi lấy batch summary",
      error: err.message,
    });
  }
};

exports.getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.batchId)
      .populate("productId", "name")
      .populate("distributorId", "name")
      .populate("warehouseId", "name");

    if (!batch) {
      return res.status(404).json({ message: "Không tìm thấy batch." });
    }

    return res.json(batch);
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi lấy chi tiết batch", error: err.message });
  }
};


exports.updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch không tồn tại." });
    }

   
    const fields = [
      "distributorId",
      "certificateId",
      "brandId",
      "imageUrl",
      "amount",
      "expiryDate",
      "notes"
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        batch[field] = req.body[field];
      }
    });

    await batch.save();
    return res.json(batch);
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi cập nhật batch", error: err.message });
  }
};


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

    return res.json({data: batch, message: `Batch đã được chuyển sang trạng thái "${status}"` });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi khóa batch", error: err.message });
  }
};

//soft delete
exports.deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.batchId);
    if (!batch) return res.status(404).json({ message: "Batch không tồn tại." });

    batch.status = "cancelled";
    batch.lockedReason = "Đã huỷ (soft delete)";
    await batch.save();

    return res.json({message: "Đã huỷ batch thành công.", data: batch });
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

    res.json({message: "Đã điều chỉnh batch", data: batch });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi điều chỉnh batch", error: err.message });
  }
};
