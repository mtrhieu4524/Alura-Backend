const SubCategory = require("../../models/subCategory.model");
const Category = require("../../models/category.model");

// Create SubCategory
exports.createSubCategory = async (req, res) => {
  try {
    const { name, description, categoryID } = req.body;

    if (!name || !description || !categoryID) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and categoryID are required",
      });
    }

    // Check if referenced category exists
    const categoryExists = await Category.findById(categoryID);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const subCategory = new SubCategory({ name, description, categoryID });
    await subCategory.save();

    res.status(201).json({
      success: true,
      message: "SubCategory created successfully",
      data: {
        id: subCategory._id,
        name: subCategory.name,
        description: subCategory.description,
        categoryID: subCategory.categoryID,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all SubCategories
exports.getAllSubCategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate(
      "categoryID",
      "name"
    );

    const result = subcategories.map((sub) => ({
      id: sub._id,
      name: sub.name,
      description: sub.description,
      category: {
        id: sub.categoryID._id,
        name: sub.categoryID.name,
      },
    }));

    res.status(200).json({
      success: true,
      message: "Fetched subcategories successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get SubCategory by ID
exports.getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const sub = await SubCategory.findById(id).populate("categoryID", "name");

    if (!sub) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched subcategory successfully",
      data: {
        id: sub._id,
        name: sub.name,
        description: sub.description,
        category: {
          id: sub.categoryID._id,
          name: sub.categoryID.name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update SubCategory
exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryID } = req.body;

    // Optionally validate categoryID if passed
    if (categoryID) {
      const categoryExists = await Category.findById(categoryID);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    const updated = await SubCategory.findByIdAndUpdate(
      id,
      { name, description, categoryID },
      { new: true, runValidators: true }
    ).populate("categoryID", "name");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SubCategory updated successfully",
      data: {
        id: updated._id,
        name: updated.name,
        description: updated.description,
        category: {
          id: updated.categoryID._id,
          name: updated.categoryID.name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete SubCategory
exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SubCategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SubCategory deleted successfully",
      data: {
        id: deleted._id,
        name: deleted.name,
        description: deleted.description,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
