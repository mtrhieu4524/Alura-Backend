// models/warehouse/warehouse.model.js
const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Warehouse", warehouseSchema);
