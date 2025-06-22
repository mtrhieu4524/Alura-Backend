const Brand = require('../../models/brand.model');

// Create a new Brand
exports.createBrand = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Brand name is required',
      });
    }

    // Check for duplicate
    const existing = await Brand.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Brand already exists',
      });
    }

    const brand = new Brand({ name: name.trim() });
    await brand.save();

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: {
        id: brand._id,
        name: brand.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
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
      name: brand.name,
    }));

    res.status(200).json({
      success: true,
      message: 'Fetched brands successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
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
        message: 'Brand not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fetched brand successfully',
      data: {
        id: brand._id,
        name: brand.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update Brand
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await Brand.findByIdAndUpdate(
      id,
      { name: name?.trim() },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Brand updated successfully',
      data: {
        id: updated._id,
        name: updated.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete Brand
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Brand.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Brand deleted successfully',
      data: {
        id: deleted._id,
        name: deleted.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
