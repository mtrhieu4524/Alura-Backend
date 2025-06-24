const mongoose = require("mongoose");
const { Schema } = mongoose;

const productTypeSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    categoryID: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryID: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductType = mongoose.model("ProductType", productTypeSchema);
module.exports = ProductType;
