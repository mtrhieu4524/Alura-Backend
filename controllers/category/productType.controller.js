const ProductType = require("../../models/productType.model");
const Category = require("../../models/category.model");
const SubCategory = require("../../models/subCategory.model");
const Product = require("../../models/product.model");
const checkDependencies = require("../../utils/checkDependencies");


exports.createProductType = async (req, res) => {
  try {
    const { name, description, categoryID, subCategoryID } = req.body;

    if (!name || !description || !categoryID || !subCategoryID) {
      return res.status(400).json({ message: "Name, description, categoryID, and subCategoryID are required" });
    }

    const category = await Category.findById(categoryID);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = await SubCategory.findById(subCategoryID);
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    const productType = new ProductType({ name, description, categoryID, subCategoryID });
    await productType.save();

    const populated = await ProductType.findById(productType._id)
      .populate("categoryID", "name")
      .populate("subCategoryID", "name");

    res.status(201).json({
      _id: populated._id,
      name: populated.name,
      description: populated.description,
      category: {
        _id: populated.categoryID._id,
        name: populated.categoryID.name
      },
      subCategory: {
        _id: populated.subCategoryID._id,
        name: populated.subCategoryID.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getAllProductTypes = async (req, res) => {
  try {
    const productTypes = await ProductType.find()
      .populate("categoryID", "name")
      .populate("subCategoryID", "name");

    const result = productTypes.map(pt => ({
      _id: pt._id,
      name: pt.name,
      description: pt.description,
      category: {
        _id: pt.categoryID._id,
        name: pt.categoryID.name
      },
      subCategory: {
        _id: pt.subCategoryID._id,
        name: pt.subCategoryID.name
      }
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getProductTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    const pt = await ProductType.findById(id)
      .populate("categoryID", "name")
      .populate("subCategoryID", "name");

    if (!pt) {
      return res.status(404).json({ message: "ProductType not found" });
    }

    res.status(200).json({
      _id: pt._id,
      name: pt.name,
      description: pt.description,
      category: {
        _id: pt.categoryID._id,
        name: pt.categoryID.name
      },
      subCategory: {
        _id: pt.subCategoryID._id,
        name: pt.subCategoryID.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryID, subCategoryID } = req.body;

    if (categoryID) {
      const category = await Category.findById(categoryID);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    if (subCategoryID) {
      const subCategory = await SubCategory.findById(subCategoryID);
      if (!subCategory) {
        return res.status(404).json({ message: "SubCategory not found" });
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
      return res.status(404).json({ message: "ProductType not found" });
    }

    res.status(200).json({
      _id: updated._id,
      name: updated.name,
      description: updated.description,
      category: {
        _id: updated.categoryID._id,
        name: updated.categoryID.name
      },
      subCategory: {
        _id: updated.subCategoryID._id,
        name: updated.subCategoryID.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.deleteProductType = async (req, res) => {
  try {
    const { id } = req.params;

    const conflict = await checkDependencies([
      { model: Product, field: "productTypeId", value: id },
    ]);

    if (conflict) {
      return res.status(400).json({
        message: `Cannot delete ProductType: it is still referenced in ${conflict.model} via "${conflict.field}"`
      });
    }

    const deleted = await ProductType.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "ProductType not found" });
    }

    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
