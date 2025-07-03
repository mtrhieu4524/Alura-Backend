// models/order.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  shippingAddress: { type: String, required: true },

  subTotal: { type: Number, required: true },       // Tổng tiền chưa giảm giá/ship
  discountAmount: { type: Number, default: 0 },     // Số tiền giảm từ promotion
  shippingFee: { type: Number, default: 0 },        // Phí vận chuyển
  totalAmount: { type: Number, required: true },    // Tổng tiền sau giảm + ship

  promotionId: { type: Schema.Types.ObjectId, ref: 'Promotion', default: null },
  shippingMethod: {
    type: String,
    enum: ['STANDARD', 'EXPRESS'],
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Success', 'Cancelled'],
    default: 'Pending'
  },

  paymentStatus: {
    type: String,
    enum: ['Pending', 'Unpaid', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },

  orderDate: { type: Date, default: Date.now },

  paymentMethod: {
    type: String,
    enum: ['COD', 'VNPAY'],
    default: 'COD'
  },
  paymentTransactionId: {
    type: String,
    default: null
  },

  note: { type: String },
}, {
  timestamps: true 
});

module.exports = mongoose.model('Order', orderSchema);
