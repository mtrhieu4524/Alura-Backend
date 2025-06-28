// models/batchCertificate.model.js
const mongoose = require("mongoose");

const batchCertificateSchema = new mongoose.Schema(
  {
    certificateCode: { type: String, required: true },
    issueDate: Date,
    issuedBy: String,
    fileUrl: String,
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("BatchCertificate", batchCertificateSchema);
