const ProductType = require("../../models/productType.model");
const Category = require("../../models/category.model");
const SubCategory = require("../../models/subCategory.model");
const Product = require("../../models/product.model");
const checkDependencies = require("../../utils/checkDependencies");

// Create ProductType
exports.createProductType = async (req, res) => {
  try {
    const { name, description, categoryID, subCategoryID } = req.body;

    if (!name || !description || !categoryID || !subCategoryID) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, categoryID, and subCategoryID are required",
      });
    }

    const category = await Category.findById(categoryID);
    const subCategory = await SubCategory.findById(subCategoryID);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    const productType = new ProductType({
      name,
      description,
      categoryID,
      subCategoryID,
    });

    await productType.save();

    res.status(201).json({
      success: true,
      message: "ProductType created successfully",
      data: {
        id: productType._id,
        name: productType.name,
        description: productType.description,
        categoryID: productType.categoryID,
        subCategoryID: productType.subCategoryID,
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

// Get all ProductTypes
exports.getAllProductTypes = async (req, res) => {
  try {
    const productTypes = await ProductType.find()
      .populate("categoryID", "name")
      .populate("subCategoryID", "name");

    const result = productTypes.map((pt) => ({
      id: pt._id,
      name: pt.name,
      description: pt.description,
      category: {
        id: pt.categoryID._id,
        name: pt.categoryID.name,
      },
      subCategory: {
        id: pt.subCategoryID._id,
        name: pt.subCategoryID.name,
      },
    }));

    res.status(200).json({
      success: true,
      message: "Fetched product types successfully",
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

// Get ProductType by ID
exports.getProductTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    const pt = await ProductType.findById(id)
      .populate("categoryID", "name")
      .populate("subCategoryID", "name");

    if (!pt) {
      return res.status(404).json({
        success: false,
        message: "ProductType not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched product type successfully",
      data: {
        id: pt._id,
        name: pt.name,
        description: pt.description,
        category: {
          id: pt.categoryID._id,
          name: pt.categoryID.name,
        },
        subCategory: {
          id: pt.subCategoryID._id,
          name: pt.subCategoryID.name,
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

// Update ProductType
exports.updateProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryID, subCategoryID } = req.body;

    if (categoryID) {
      const category = await Category.findById(categoryID);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    if (subCategoryID) {
      const subCategory = await SubCategory.findById(subCategoryID);
      if (!subCategory) {
        return res.status(404).json({
          success: false,
          message: "SubCategory not found",
        });
      }
    }

    const updated = await ProductType.findByIdAndUpdate(
      id,
      { name, description, categoryID, subCategoryID },
      { new: true, runValidators: true }
    )
      .populate("categoryID", "name")
      .populate("subCategoryID", "name");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "ProductType not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "ProductType updated successfully",
      data: {
        id: updated._id,
        name: updated.name,
        description: updated.description,
        category: {
          id: updated.categoryID._id,
          name: updated.categoryID.name,
        },
        subCategory: {
          id: updated.subCategoryID._id,
          name: updated.subCategoryID.name,
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

// Delete ProductType
exports.deleteProductType = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem ProductType có đang được sử dụng ở Product nào không
    const conflict = await checkDependencies([
      { model: Product, field: "productTypeId", value: id },
    ]);

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete ProductType: it is still referenced in ${conflict.model} via "${conflict.field}"`,
      });
    }

    const deleted = await ProductType.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "ProductType not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "ProductType deleted successfully",
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
