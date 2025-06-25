// models/product.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imgUrls: [{ type: String }],
    stock: { type: Number, default: 0 },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    public_ids: [{ type: String }], // Thêm trường để lưu public_id từ Cloudinary
    sex: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "unisex",
      required: true,
    },
    skinType: {
      type: [String],
      enum: ["dry", "oily", "combination", "sensitive", "normal", "all"],
      required: true,
    },
    skinColor: {
      type: String,
      enum: ["warm", "cool", "neutral", "dark", "light"],
      required: true,
    },
    volume: { type: String, required: true },
    instructions: { type: String, required: true },
    preservation: { type: String, required: true },
    keyIngredients: { type: String, required: true },
    detailInfredients: { type: String, required: true },
    purpose: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productTypeId: {
      type: Schema.Types.ObjectId,
      ref: "ProductType",
      required: true,
    },
    isPublic: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
