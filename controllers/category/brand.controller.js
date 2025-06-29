const Brand = require("../../models/brand.model");
const Product = require("../../models/product.model");
const checkDependencies = require("../../utils/checkDependencies");

// Create a new Brand
exports.createBrand = async (req, res) => {
  try {
    const { brandName } = req.body;

    if (!brandName) {
      return res.status(400).json({
        success: false,
        message: "Brand brandName is required",
      });
    }

    // Check for duplicate
    const existing = await Brand.findOne({ brandName: brandName.trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Brand already exists",
      });
    }

    const brand = new Brand({ brandName: brandName.trim() });
    await brand.save();

    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: {
        id: brand._id,
        brandName: brand.brandName,
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

// Get all Brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();

    const result = brands.map((brand) => ({
      id: brand._id,
      brandName: brand.brandName,
    }));

    res.status(200).json({
      success: true,
      message: "Fetched brands successfully",
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

// Get Brand by ID
exports.getBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched brand successfully",
      data: {
        id: brand._id,
        brandName: brand.brandName,
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

// Update Brand
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { brandName } = req.body;

    const updated = await Brand.findByIdAndUpdate(
      id,
      { brandName: brandName?.trim() },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: {
        id: updated._id,
        brandName: updated.brandName,
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

// Delete Brand
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const conflict = await checkDependencies([
      { model: Product, field: "brandID", value: id },
    ]);

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete Brand: it's still used in ${conflict.model} via "${conflict.field}"`,
      });
    }

    const deleted = await Brand.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
      data: {
        id: deleted._id,
        brandName: deleted.brandName,
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
