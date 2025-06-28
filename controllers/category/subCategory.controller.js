const SubCategory = require('../../models/subCategory.model');
const Category = require('../../models/category.model');
const ProductType = require('../../models/productType.model');
const Product = require('../../models/product.model');
const checkDependencies = require('../../utils/checkDependencies');


exports.createSubCategory = async (req, res) => {
  try {
    const { name, description, categoryID } = req.body;

    if (!name || !description || !categoryID) {
      return res.status(400).json({ message: "Name, description, and categoryID are required" });
    }

    const categoryExists = await Category.findById(categoryID);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = new SubCategory({ name, description, categoryID });
    await subCategory.save();

    const populated = await SubCategory.findById(subCategory._id).populate("categoryID", "name");

    res.status(201).json({
      _id: populated._id,
      name: populated.name,
      description: populated.description,
      category: {
        _id: populated.categoryID._id,
        name: populated.categoryID.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getAllSubCategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate("categoryID", "name");

    const result = subcategories.map(sub => ({
      _id: sub._id,
      name: sub.name,
      description: sub.description,
      category: {
        _id: sub.categoryID._id,
        name: sub.categoryID.name
      }
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const sub = await SubCategory.findById(id).populate("categoryID", "name");
    if (!sub) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    res.status(200).json({
      _id: sub._id,
      name: sub.name,
      description: sub.description,
      category: {
        _id: sub.categoryID._id,
        name: sub.categoryID.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryID } = req.body;

    if (categoryID) {
      const categoryExists = await Category.findById(categoryID);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const updated = await SubCategory.findByIdAndUpdate(
      id,
      { name, description, categoryID },
      { new: true, runValidators: true }
    ).populate("categoryID", "name");

    if (!updated) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    res.status(200).json({
      _id: updated._id,
      name: updated.name,
      description: updated.description,
      category: {
        _id: updated.categoryID._id,
        name: updated.categoryID.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const conflict = await checkDependencies([
      { model: ProductType, field: 'subCategoryID', value: id },
    ]);

    if (conflict) {
      return res.status(400).json({
        message: `Cannot delete SubCategory: it is still referenced in ${conflict.model} via "${conflict.field}"`
      });
    }

    const deleted = await SubCategory.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
