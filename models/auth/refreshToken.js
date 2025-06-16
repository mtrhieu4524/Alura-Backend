// models/auth/refreshToken.js
const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isUsed: {
    type: Boolean,
    default: false
  }
});

// Index để tối ưu query
refreshTokenSchema.index({ token: 1, expiresAt: 1 });
refreshTokenSchema.index({ userId: 1, expiresAt: 1 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);