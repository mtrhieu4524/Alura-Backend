const mongoose = require('mongoose');
const { Schema } = mongoose;

const shippingMethodSchema = new Schema({
  name: { type: String, required: true }, 
  description: { type: String },
  baseFee: { type: Number, required: true },
  deliveryDays: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('ShippingMethod', shippingMethodSchema);
