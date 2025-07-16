    const BatchStock = require("../../models/batch/batchStock.model");
    const Batch = require("../../models/batch/batch.model");
    const InventoryMovement = require("../../models/warehouse/inventoryMovement.model");
    const Product = require("../../models/product.model");


  //xuất kho từ kho gốc sang kho store
exports.createBatchStock = async (req, res) => {
  try {
    const { batchId, productId, warehouseId, quantity, note, handledBy } = req.body;

    // Kiểm tra batch tồn tại
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Không tìm thấy batch." });
    }

    // Kiểm tra hạn sử dụng tối thiểu 1 năm
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (batch.expiryDate && batch.expiryDate < oneYearFromNow) {
      return res.status(400).json({
        message: `Batch có hạn sử dụng dưới 1 năm không thể xuất kho. Hạn sử dụng: ${batch.expiryDate.toLocaleDateString()}`
      });
    }


    // Check batch.productId có khớp với productId ko
    if (String(batch.productId) !== String(productId)) {
      return res.status(400).json({
        message: "Sản phẩm không khớp với batch. Không thể tạo batchStock."
      });
    }

    // Kiểm tra tồn kho hiện tại của sản phẩm tại cửa hàng
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    // Kiểm tra nếu tồn kho > 10 thì không cho xuất
    if (product.stock > 10) {
      return res.status(400).json({
        message: `Không thể xuất hàng. Dưới (${product.stock}) sản phẩm mới có thể xuất hàng.`
      });
    }

    // Tìm tồn kho gốc trong kho trung tâm
    const originStock = await BatchStock.findOne({ batchId, warehouseId, isOrigin: true });
    if (!originStock) {
      return res.status(404).json({ message: "Không tìm thấy tồn kho gốc tại kho trung tâm." });
    }

    // Kiểm tra tồn kho đủ
    if (originStock.remaining < quantity) {
      return res.status(400).json({
        message: `Không đủ tồn kho. Còn lại ${originStock.remaining}, yêu cầu ${quantity}.`
      });
    }

    // Trừ tồn kho gốc
    originStock.remaining -= quantity;
    await originStock.save();

    // Tạo bản ghi batchStock mới cho kho store
    const newBatchStock = new BatchStock({
      batchId,
      productId,
      warehouseId,
      quantity,
      remaining: quantity,
      isOrigin: false,
      note,
    });
    const savedBatchStock = await newBatchStock.save();

    // Ghi log movement
    await InventoryMovement.create({
      batchId,
      warehouseId,
      movementType: "export",
      batchQuantity: quantity,
      actionDate: new Date(),
      handledBy: req.user?._id || handledBy || null,
      note: note || "Xuất từ kho để bán tại cửa hàng",
    });

    
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: quantity } },
      { new: true }
    );

    
    const responseData = {
      _id: savedBatchStock._id,
      batchId: savedBatchStock.batchId,
      productId: savedBatchStock.productId,
      warehouseId: savedBatchStock.warehouseId,
      quantity: savedBatchStock.quantity,
      remaining: savedBatchStock.remaining,
      isOrigin: savedBatchStock.isOrigin,
      note: savedBatchStock.note,
      __v: savedBatchStock.__v,
    };

    return res.status(201).json(responseData);
  } catch (err) {
    return res.status(500).json({
      message: "Tạo batchStock thất bại",
      error: err.message,
    });
  }
};



exports.getAllBatchStocks = async (req, res) => {
  try {
    const { warehouseId, productId, batchId, search } = req.query;

    const filter = {};
    if (warehouseId) filter.warehouseId = warehouseId;
    if (productId) filter.productId = productId;
    if (batchId) filter.batchId = batchId;

    let stocks = await BatchStock.find(filter)
      .populate("productId", "name")
      .populate("warehouseId", "name")
      .populate("batchId", "batchCode status expiryDate")
      .sort({ createdAt: -1 });

    // Lọc thêm theo batchCode nếu có search
    if (search) {
      stocks = stocks.filter((s) =>
        s.batchId?.batchCode?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (!stocks || stocks.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy kết quả phù hợp" });
    }

    return res.json({ success: true, data: stocks });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi lấy danh sách batchStock", error: err.message });
  }
};


  
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
