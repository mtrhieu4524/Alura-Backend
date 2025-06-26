// models/batchStock.model.js
const mongoose = require("mongoose");

const batchStockSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    remaining: {
      type: Number,
      required: true,
      min: 0,
    },
    exportedAt: {
      type: Date,
      default: Date.now,
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("BatchStock", batchStockSchema);
