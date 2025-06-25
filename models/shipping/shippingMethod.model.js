const mongoose = require('mongoose');
const { Schema } = mongoose;

const shippingMethodSchema = new Schema({
    methodShipping: {
    type: String,
    enum: ['standard', 'express', 'sameday', 'overnight'],
    required: true
  },
  description: { type: String },
  baseFee: { type: Number, required: true },
  deliveryDays: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('ShippingMethod', shippingMethodSchema);
