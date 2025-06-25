// models/user.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },

    passwordHash: {
      type: String,
      required: true,
      minlength: 8,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      enum: ["ADMIN", "USER", "STAFF"],
      default: "USER",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
