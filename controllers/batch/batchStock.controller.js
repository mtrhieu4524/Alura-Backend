  const BatchStock = require("../../models/batch/batchStock.model");
  const Batch = require("../../models/batch/batch.model");
  const InventoryMovement = require("../../models/warehouse/inventoryMovement.model");
  const Product = require("../../models/product.model");


// Tạo batchStock mới (xuất kho từ kho gốc sang kho store)
exports.createBatchStock = async (req, res) => {
  try {
    const { batchId, productId, warehouseId, quantity, note, handledBy } = req.body;

    //Tìm tồn kho gốc tại kho trung tâm
    const originStock = await BatchStock.findOne({ batchId, warehouseId, isOrigin: true });

    if (!originStock) {
      return res.status(404).json({ message: "Không tìm thấy tồn kho gốc tại kho trung tâm." });
    }

    if (originStock.remaining < quantity) {
      return res.status(400).json({
        message: `Không đủ tồn kho. Còn lại ${originStock.remaining}, yêu cầu ${quantity}.`,
      });
    }

    //Trừ tồn kho gốc
    originStock.remaining -= quantity;
    await originStock.save();

    //Tạo tồn kho đích (cửa hàng)
    const newBatchStock = new BatchStock({
      batchId,
      productId,
      warehouseId,
      quantity,
      remaining: quantity,
      isOrigin: false,
      note,
    });
    await newBatchStock.save();

    //Ghi log movement
    await InventoryMovement.create({
      batchId,
      warehouseId,
      movementType: "export",
      batchQuantity: quantity,
      actionDate: new Date(),
      handledBy: req.user?._id || handledBy || null,
      note: note || "Xuất từ kho để bán tại cửa hàng",
    });

    //Tăng stock cho Product (tổng hàng tại cửa hàng)
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: quantity } },
      { new: true }
    );

    return res.status(201).json({ success: true, data: newBatchStock });
  } catch (err) {
    return res.status(500).json({
      message: "Tạo batchStock thất bại",
      error: err.message,
    });
  }
};

exports.getAllBatchStocks = async (req, res) => {
  try {
    const stocks = await BatchStock.find().sort({ createdAt: -1 });
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy batchStock", error: err.message });
  }
};

//Lấy toàn bộ batchStock (lọc theo warehouse, product, batch)
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

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi lấy danh sách batchStock", error: err.message });
  }
};

//Lấy chi tiết batchStock
exports.getBatchStockById = async (req, res) => {
  try {
    const batchStock = await BatchStock.findById(req.params.batchStockId)
      .populate("productId", "name")
      .populate("batchId", "batchCode status expiryDate")
      .populate("warehouseId", "name");

    if (!batchStock) return res.status(404).json({ message: "Không tìm thấy batchStock." });

    return res.json(batchStock);
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi lấy batchStock", error: err.message });
  }
};

//Cập nhật số lượng batchStock
exports.updateBatchStock = async (req, res) => {
  try {
    const batchStock = await BatchStock.findById(req.params.batchStockId);
    if (!batchStock) return res.status(404).json({ message: "Không tìm thấy batchStock." });

    const { quantity, remaining } = req.body;

    if (quantity !== undefined) batchStock.quantity = quantity;
    if (remaining !== undefined) batchStock.remaining = remaining;

    await batchStock.save();
    return res.json(batchStock);
  } catch (err) {
    return res.status(500).json({ message: "Cập nhật batchStock thất bại", error: err.message });
  }
};

//Xoá batchStock
exports.deleteBatchStock = async (req, res) => {
  try {
    const batchStock = await BatchStock.findByIdAndDelete(req.params.batchStockId);
    if (!batchStock) return res.status(404).json({ message: "Không tìm thấy batchStock." });

    return res.json({message: "Đã xoá batchStock", batchStock });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi xoá batchStock", error: err.message });
  }
};
