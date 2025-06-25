const mongoose = require('mongoose');
const { Schema } = mongoose;

const promotionUsageSchema = new Schema({
  promotionId: { type: Schema.Types.ObjectId, ref: 'Promotion', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },

  discountAmount: { type: Number, required: true },
  usedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PromotionUsage', promotionUsageSchema);
