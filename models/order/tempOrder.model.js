const mongoose = require("mongoose");

const tempOrderSchema = new mongoose.Schema({
  tempId: {
    type: String,
    required: true,
    unique: true,
  },
  orderData: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2700, // Tự động xóa sau 45 phút
  },
});

module.exports = mongoose.model("TempOrder", tempOrderSchema);
