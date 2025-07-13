const Distributor = require("../../models/batch/distributor.model");
const Batch = require("../../models/batch/batch.model");


exports.createDistributor = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name || !phone || !email || !address) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
    }

    const distributor = new Distributor({ name, phone, email, address });
    await distributor.save();

    res.status(201).json(distributor);
  } catch (err) {
    res.status(500).json({ message: "Tạo distributor thất bại", error: err.message });
  }
};


exports.getAllDistributors = async (req, res) => {
  try {
    const distributors = await Distributor.find().sort({ name: 1 });
    res.json(distributors);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách distributor", error: err.message });
  }
};


exports.getDistributorById = async (req, res) => {
  try {
    const { distributorId } = req.params;

    const distributor = await Distributor.findById(distributorId);
    if (!distributor) {
      return res.status(404).json({ message: "Không tìm thấy distributor." });
    }

    res.json(distributor);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy distributor", error: err.message });
  }
};


exports.updateDistributor = async (req, res) => {
  try {
    const { distributorId } = req.params;
    const { name, phone, email, address } = req.body;

    const distributor = await Distributor.findByIdAndUpdate(
      distributorId,
      { name, phone, email, address },
      { new: true }
    );

    if (!distributor) {
      return res.status(404).json({ message: "Không tìm thấy distributor." });
    }

    res.json(distributor);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật distributor", error: err.message });
  }
};


exports.deleteDistributor = async (req, res) => {
  try {
    const { distributorId } = req.params;

    //check existing distributor
    const distributor = await Distributor.findById(distributorId);
    if (!distributor) {
      return res.status(404).json({ message: "Không tìm thấy distributor." });
    }

    //check existingBatch
    const existingBatch = await Batch.findOne({ distributorId });
    if (existingBatch) {
      return res.status(400).json({
        message: "Không thể xóa distributor vì đang được sử dụng trong các lô hàng.",
      });
    }

    await Distributor.findByIdAndDelete(distributorId);

    res.json({ success: true, message: "Đã xóa distributor thành công." });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi xóa distributor",
      error: err.message,
    });
  }
};
