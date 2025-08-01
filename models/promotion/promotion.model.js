const mongoose = require('mongoose');
const { Schema } = mongoose;

const promotionSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  
  discountValue: { type: Number, required: true },

  minimumOrderAmount: { type: Number, default: 0 },
  usageLimit: { type: Number, default: 0 },     
  usedCount: { type: Number, default: 0 },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  isPublic: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Promotion', promotionSchema);
