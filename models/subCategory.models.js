const mongoose = require("mongoose");
const { Schema } = mongoose;

const subCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    categoryID: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
module.exports = SubCategory;
