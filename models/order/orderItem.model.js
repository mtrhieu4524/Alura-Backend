// models/orderItem.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderItemSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },

  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true }, // đơn giá tại thời điểm đặt hàng

  // Snapshot thêm để tránh phụ thuộc vào Product bị xoá/sửa sau này
  productName: { type: String, required: true },
  productImgUrl: { type: String }, // URL ảnh đại diện
  
  batches: [
    {
      batchId: mongoose.Schema.Types.ObjectId, 
      batchCode: String,
      expiryDate: Date,
      quantity: Number,
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
