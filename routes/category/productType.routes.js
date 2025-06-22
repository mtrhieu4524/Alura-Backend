const express = require('express');
const router = express.Router();
const productTypeController = require('../../controllers/category/productType.controller');

router.post('/', productTypeController.createProductType);
router.get('/', productTypeController.getAllProductTypes);
router.get('/:id', productTypeController.getProductTypeById);
router.put('/:id', productTypeController.updateProductType);
router.delete('/:id', productTypeController.deleteProductType);

module.exports = router;
