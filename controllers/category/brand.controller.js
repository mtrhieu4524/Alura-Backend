const Brand = require('../../models/brand.model');
const Product = require('../../models/product.model');
const checkDependencies = require('../../utils/checkDependencies');

// Create a new Brand
exports.createBrand = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    const existing = await Brand.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: 'Brand already exists' });
    }

    const brand = new Brand({ name: name.trim() });
    await brand.save();

    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all Brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Brand by ID
exports.getBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Brand
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const conflict = await checkDependencies([
      { model: Product, field: 'brandID', value: id }
    ]);

    if (conflict) {
      return res.status(400).json({
        message: `Cannot delete Brand: it's still used in ${conflict.model} via "${conflict.field}"`
      });
    }

    const deleted = await Brand.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
