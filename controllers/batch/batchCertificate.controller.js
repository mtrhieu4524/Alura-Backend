const BatchCertificate = require("../../models/batch/batchCertificate.model");

// ✅ Tạo chứng nhận mới
exports.createBatchCertificate = async (req, res) => {
  try {
    const { certificateCode, issueDate, issuedBy, fileUrl, note } = req.body;

    if (!certificateCode || !issueDate || !issuedBy || !fileUrl) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
    }

    const exists = await BatchCertificate.findOne({ certificateCode });
    if (exists) {
      return res.status(409).json({ message: "Mã chứng nhận đã tồn tại." });
    }

    const cert = new BatchCertificate({
      certificateCode,
      issueDate,
      issuedBy,
      fileUrl,
      note,
    });

    await cert.save();

    res.status(201).json({ success: true, data: cert });
  } catch (err) {
    res.status(500).json({ message: "Tạo chứng nhận thất bại", error: err.message });
  }
};

// ✅ Lấy tất cả chứng nhận
exports.getAllBatchCertificates = async (req, res) => {
  try {
    const certs = await BatchCertificate.find().sort({ createdAt: -1 });
    res.json({ success: true, data: certs });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách chứng nhận", error: err.message });
  }
};

// ✅ Lấy chứng nhận theo ID
exports.getBatchCertificateById = async (req, res) => {
  try {
    const cert = await BatchCertificate.findById(req.params.certificateId);
    if (!cert) {
      return res.status(404).json({ message: "Không tìm thấy chứng nhận." });
    }

    res.json({ success: true, data: cert });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy chứng nhận", error: err.message });
  }
};

// ✅ Cập nhật chứng nhận
exports.updateBatchCertificate = async (req, res) => {
  try {
    const cert = await BatchCertificate.findByIdAndUpdate(
      req.params.certificateId,
      req.body,
      { new: true }
    );

    if (!cert) {
      return res.status(404).json({ message: "Không tìm thấy chứng nhận." });
    }

    res.json({ success: true, data: cert });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật chứng nhận", error: err.message });
  }
};

// ✅ Xoá chứng nhận
exports.deleteBatchCertificate = async (req, res) => {
  try {
    const cert = await BatchCertificate.findByIdAndDelete(req.params.certificateId);

    if (!cert) {
      return res.status(404).json({ message: "Không tìm thấy chứng nhận." });
    }

    res.json({ success: true, message: "Đã xoá chứng nhận", data: cert });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá chứng nhận", error: err.message });
  }
};
