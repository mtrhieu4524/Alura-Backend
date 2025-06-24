const e = require("express");
const mongoose = require("mongoose");
const { validatorMongooseObjectId } = require("../utils/validator");

class ProductHandler {
  constructor() {}
  createProduct(req, res, next) {
    const validationErrors = [];
    const {
      name,
      price,
      brand,
      skinType,
      skinColor,
      volume,
      instructions,
      preservation,
      keyIngredients,
      detailInfredients,
      purpose,
      categoryId,
      productTypeId,
      stock,
    } = req.body;

    switch (true) {
      case !name:
        validationErrors.push({
          field: "name",
          error: "Name is required",
        });
        break;
      case !price || isNaN(price):
        validationErrors.push({
          field: "price",
          error: "Price must be a valid number",
        });
        break;
      case !brand:
        validationErrors.push({
          field: "brand",
          error: "Brand is required",
        });
        break;
      case !skinType:
        validationErrors.push({
          field: "skinType",
          error: "Skin type is required",
        });
        break;
      case !skinColor:
        validationErrors.push({
          field: "skinColor",
          error: "Skin color is required",
        });
        break;
      case !volume:
        validationErrors.push({
          field: "volume",
          error: "Volume is required",
        });
        break;
      case !instructions:
        validationErrors.push({
          field: "instructions",
          error: "Instructions are required",
        });
        break;
      case !preservation:
        validationErrors.push({
          field: "preservation",
          error: "Preservation is required",
        });
        break;
      case !keyIngredients:
        validationErrors.push({
          field: "keyIngredients",
          error: "Key ingredients are required",
        });
        break;
      case !detailInfredients:
        validationErrors.push({
          field: "detailInfredients",
          error: "Detail ingredients are required",
        });
        break;
      case !purpose:
        validationErrors.push({
          field: "purpose",
          error: "Purpose is required",
        });
        break;
      case !categoryId:
        validationErrors.push({
          field: "categoryId",
          error: "Category ID is required",
        });
        break;
      case !productTypeId:
        validationErrors.push({
          field: "productTypeId",
          error: "Product type ID is required",
        });
        break;
      case !req.files || req.files.length === 0:
        validationErrors.push({
          field: "imgUrls",
          error: "At least one image is required",
        });
        break;
      case req.files.length > 5:
        validationErrors.push({
          field: "imgUrls",
          error: "You can upload a maximum of 5 images",
        });
        break;
      case stock && isNaN(stock):
        validationErrors.push({
          field: "stock",
          error: "Stock must be a valid number",
        });
      default:
        break;
    }
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    } else {
      next();
    }
  }

  getAllProducts(req, res, next) {
    const validationErrors = [];
    const { pageIndex, pageSize, searchByName } = req.query;

    if (pageIndex && isNaN(pageIndex)) {
      validationErrors.push({
        field: "pageIndex",
        error: "Page index must be a valid number",
      });
    }

    if (pageSize && isNaN(pageSize)) {
      validationErrors.push({
        field: "pageSize",
        error: "Page size must be a valid number",
      });
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    } else {
      next();
    }
  }

  getProductById(req, res, next) {
    const validationErrors = [];
    const { id } = req.params;
    try {
      validatorMongooseObjectId(id);
    } catch (error) {
      validationErrors.push({
        field: "id",
        error: "Invalid product ID format",
      });
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    } else {
      next();
    }
  }

  updateProductById(req, res, next) {
    const validationErrors = [];
    const { id } = req.params;
    try {
      validatorMongooseObjectId(id);
    } catch (error) {
      validationErrors.push({
        field: "id",
        error: "Invalid product ID format",
      });
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    } else {
      next();
    }
  }
}

module.exports = new ProductHandler();
