const mongoose = require('mongoose');
const { Schema } = mongoose;

const shippingSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },

  deliveryStatus: {
    type: String,
    enum: [ 'Pending', 'Shipping', 'Delivered', 'Failed'],
    default: 'Shipping'
  },

  deliveryDate: { type: Date }, 
  handledBy: { type: Schema.Types.ObjectId, ref: 'User' } // nhân viên xử lý
}, {
  timestamps: true
});

module.exports = mongoose.model('Shipping', shippingSchema);
