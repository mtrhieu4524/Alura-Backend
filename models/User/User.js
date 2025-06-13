// models/user.js
const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
    // CHÚ Ý: đổi tên trường thành passwordHash nếu dùng bcrypt
  passwordHash: {
    type: String,
    required: function() { return this.authProvider === 'local'; },
    minlength: 8
  },
    name: {
    type: String,
    trim: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER', 'STAFF'],
    default: 'USER'
  },
   isActive:{
    type: Boolean,

  },


}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
