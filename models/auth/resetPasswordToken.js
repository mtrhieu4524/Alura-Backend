// models/auth/resetPasswordToken.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ResetPasswordTokenSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("ResetPasswordToken", ResetPasswordTokenSchema);
