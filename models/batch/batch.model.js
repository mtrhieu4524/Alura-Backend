// models/batch.model.js
const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    batchCode: { type: String, required: true, unique: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    distributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Distributor",
      required: true,
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BatchCertificate",
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    sampleImageUrl: String,
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true }, 
    expiryDate: { type: Date },
    importDate: { type: Date, default: Date.now },
    notes: String,

    status: {
    type: String,
    enum: ["active", "recalled", "cancelled", "expired"],
    default: "active",
    },
    lockedReason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Batch", batchSchema);
