const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/category/brand.controller');

router.post('/', brandController.createBrand);
router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);
router.put('/:id', brandController.updateBrand);
router.delete('/:id', brandController.deleteBrand);

module.exports = router;
