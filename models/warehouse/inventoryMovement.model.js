// models/warehouse/inventoryMovement.model.js
const mongoose = require("mongoose");

const inventoryMovementSchema = new mongoose.Schema(
  {
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
    movementType: {
      type: String,
      enum: ["import", "export", "adjustment"],
      required: true,
    },
    batchQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    actionDate: {
      type: Date,
      default: Date.now,
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("InventoryMovement", inventoryMovementSchema);
