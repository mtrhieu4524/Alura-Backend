const { validatorMongooseObjectId } = require("../utils/validator");
const mongoose = require("mongoose");

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
    const {
      pageIndex,
      pageSize,
      sex,
      skinType,
      skinColor,
      brand,
      categoryId,
      productTypeId,
    } = req.query;

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

    if (sex && !["male", "female", "unisex"].includes(sex)) {
      validationErrors.push({
        field: "sex",
        error: "Sex must be one of: male, female, unisex",
      });
    }

    // Validate skinType (có thể là array)
    if (skinType) {
      const validSkinTypes = [
        "dry",
        "oily",
        "combination",
        "sensitive",
        "normal",
        "all",
      ];
      const skinTypes = Array.isArray(skinType) ? skinType : [skinType];
      const invalidSkinTypes = skinTypes.filter(
        (type) => !validSkinTypes.includes(type)
      );

      if (invalidSkinTypes.length > 0) {
        validationErrors.push({
          field: "skinType",
          error: `Invalid skin types: ${invalidSkinTypes.join(", ")}`,
        });
      }
    }

    // Validate skinColor
    if (skinColor) {
      const validSkinColors = ["warm", "cool", "neutral", "dark", "light"];
      const skinColors = Array.isArray(skinColor) ? skinColor : [skinColor];
      const invalidSkinColors = skinColors.filter(
        (color) => !validSkinColors.includes(color)
      );
      if (invalidSkinColors.length > 0) {
        validationErrors.push({
          field: "skinColor",
          error: `Invalid skin colors: ${invalidSkinColors.join(", ")}`,
        });
      }
    }

    // Validate brand (có thể là array)
    if (brand) {
      const brands = Array.isArray(brand) ? brand : [brand];
      const invalidBrands = brands.filter(
        (brandId) => !mongoose.Types.ObjectId.isValid(brandId)
      );

      if (invalidBrands.length > 0) {
        validationErrors.push({
          field: "brand",
          error: `Invalid brand IDs: ${invalidBrands.join(", ")}`,
        });
      }
    }

    // Validate categoryId (có thể là array)
    if (categoryId) {
      const categoryIds = Array.isArray(categoryId) ? categoryId : [categoryId];
      const invalidCategoryIds = categoryIds.filter(
        (catId) => !mongoose.Types.ObjectId.isValid(catId)
      );

      if (invalidCategoryIds.length > 0) {
        validationErrors.push({
          field: "categoryId",
          error: `Invalid category IDs: ${invalidCategoryIds.join(", ")}`,
        });
      }
    }

    // Validate productTypeId (có thể là array)
    if (productTypeId) {
      const productTypeIds = Array.isArray(productTypeId)
        ? productTypeId
        : [productTypeId];
      const invalidProductTypeIds = productTypeIds.filter(
        (typeId) => !mongoose.Types.ObjectId.isValid(typeId)
      );

      if (invalidProductTypeIds.length > 0) {
        validationErrors.push({
          field: "productTypeId",
          error: `Invalid product type IDs: ${invalidProductTypeIds.join(
            ", "
          )}`,
        });
      }
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

  getProductByIdAdmin(req, res, next) {
    const validationErrors = [];
    const { id } = req.params;

    if (!id) {
      validationErrors.push({
        field: "productId",
        error: "Product ID is required",
      });
    } else if (!mongoose.Types.ObjectId.isValid(id)) {
      validationErrors.push({
        field: "productId",
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
