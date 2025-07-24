const { Readable } = require("stream");
const cloudinary = require("../../configs/cloudinaryConfigs/cloudinary");
const Product = require("../../models/product.model");
const { default: axios } = require("axios");
const mongoose = require("mongoose");

class ProductController {
  async fetchProductById(query, pageIndex = 1, pageSize = 10) {
    const skip = (pageIndex - 1) * pageSize;
    let products;

    if (query.tags && query.tags.$in && query.tags.$in.length > 0) {
      products = await Product.aggregate([
        { $match: query },
        {
          $addFields: {
            matchedTags: {
              $size: {
                $ifNull: [{ $setIntersection: ["$tags", query.tags.$in] }, []],
              },
            },
          },
        },
        { $match: { matchedTags: { $gt: 0 } } },
        { $sort: { matchedTags: -1, _id: 1 } },
        { $skip: skip },
        { $limit: pageSize },
        // Populate brand
        {
          $lookup: {
            from: "brands",
            localField: "brand",
            foreignField: "_id",
            as: "brand",
          },
        },
        {
          $unwind: {
            path: "$brand",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            brand: {
              $cond: {
                if: { $ne: ["$brand", null] },
                then: {
                  _id: "$brand._id",
                  brandName: "$brand.brandName",
                },
                else: null,
              },
            },
          },
        },
        // Populate categoryId
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            category: {
              $cond: {
                if: { $ne: ["$category", null] },
                then: {
                  _id: "$category._id",
                  name: "$category.name",
                },
                else: null,
              },
            },
          },
        },
        {
          $lookup: {
            from: "producttypes",
            localField: "productTypeId",
            foreignField: "_id",
            as: "productType",
          },
        },
        {
          $unwind: {
            path: "$productType",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "subcategories",
            localField: "productType.subCategoryID",
            foreignField: "_id",
            as: "productType.subCategory",
          },
        },
        {
          $unwind: {
            path: "$productType.subCategory",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            productType: {
              $cond: {
                if: { $ne: ["$productType", null] },
                then: {
                  _id: "$productType._id",
                  name: "$productType.name",
                  subCategory: {
                    $cond: {
                      if: { $ne: ["$productType.subCategory", null] },
                      then: {
                        _id: "$productType.subCategory._id",
                        name: "$productType.subCategory.name",
                      },
                      else: null,
                    },
                  },
                },
                else: null,
              },
            },
          },
        },
      ]);
    } else {
      products = await Product.find(query)
        .populate("brand", "brandName")
        .populate("categoryId", "name")
        .populate({
          path: "productTypeId",
          select: "name",
          populate: {
            path: "subCategoryID",
            select: "name",
          },
        })
        .skip(skip)
        .limit(pageSize);
    }

    const total = await Product.countDocuments(query);
    return { products, total };
  }

  async uploadToCloudinary(buffer, publicId) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
          public_id: publicId,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Upload error:", error);
            return reject(error);
          }
          resolve(result);
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }

  async analyzeImageWithCustomVision(buffer) {
    const endpoint = process.env.AZURE_CUSTOM_VISION_ENDPOINT;
    const predictionKey = process.env.AZURE_CUSTOM_VISION_PREDICTION_KEY;

    try {
      const response = await axios.post(endpoint, buffer, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Prediction-Key": predictionKey,
        },
      });

      const predictions = response.data.predictions;
      const tags = predictions
        .filter((p) => p.probability >= 0.5)
        .map((p) => p.tagName);
      return tags;
    } catch (error) {
      console.error(
        "Custom Vision error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async createProduct(req, res) {
    try {
      const {
        name,
        price,
        brand,
        sex,
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
      } = req.body;

      if (req.files.length === 0) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const [uploadResults, tagsResults] = await Promise.all([
        Promise.all(
          req.files.map((file, idx) =>
            this.uploadToCloudinary(file.buffer, `product-${Date.now()}-${idx}`)
          )
        ),
        Promise.all(
          req.files.map((file) =>
            this.analyzeImageWithCustomVision(file.buffer)
          )
        ),
      ]);

      const imgUrls = uploadResults.map((result) => result.secure_url);
      const public_ids = uploadResults.map((result) => result.public_id);
      const tags = tagsResults
        .flat()
        .filter((tag, idx, self) => self.indexOf(tag) === idx);

      const product = await Product.create({
        name,
        price,
        brand,
        sex,
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
        imgUrls,
        public_ids,
        stock: 0,
        tags: tags,
      });

      // Populate the referenced fields in the response
      const populatedProduct = await Product.findById(product._id)
        .populate("brand", "brandName")
        .populate("categoryId", "name")
        .populate({
          path: "productTypeId",
          select: "name",
          populate: {
            path: "subCategoryID",
            select: "name",
          },
        });

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        product: populatedProduct,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Cannot create product", detail: error.message });
    }
  }

  async getAllProducts(req, res) {
    const {
      pageIndex = 1,
      pageSize = 10,
      searchByName,
      sex,
      brand,
      skinType,
      skinColor,
      categoryId,
      productTypeId,
    } = req.query;
    try {
      let query = { isPublic: true };
      if (searchByName) {
        query.name = { $regex: searchByName, $options: "i" };
      }

      if (sex) {
        query.sex = sex;
      }

      if (brand) {
        const brands = Array.isArray(brand) ? brand : [brand];
        const brandObjectIds = brands.map(
          (id) => new mongoose.Types.ObjectId(id)
        );
        query.brand = { $in: brandObjectIds };
      }

      if (skinType) {
        const skinTypes = Array.isArray(skinType) ? skinType : [skinType];
        query.skinType = { $in: skinTypes };
      }

      if (skinColor) {
        const skinColors = Array.isArray(skinColor) ? skinColor : [skinColor];
        query.skinColor = { $in: skinColors };
      }

      if (categoryId) {
        const categoryIds = Array.isArray(categoryId)
          ? categoryId
          : [categoryId];
        const categoryObjectIds = categoryIds.map(
          (id) => new mongoose.Types.ObjectId(id)
        );
        query.categoryId = { $in: categoryObjectIds };
      }

      // Filter by product type (có thể là array)
      if (productTypeId) {
        const productTypeIds = Array.isArray(productTypeId)
          ? productTypeId
          : [productTypeId];
        const productTypeObjectIds = productTypeIds.map(
          (id) => new mongoose.Types.ObjectId(id)
        );
        query.productTypeId = { $in: productTypeObjectIds };
      }

      const { products, total } = await this.fetchProductById(
        query,
        pageIndex,
        pageSize
      );

      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        products,
        total,
      });
    } catch (error) {
      res.status(500).json({ error: "Cannot fetch products list" });
    }
  }

  // ...existing code...

  async getAllProductsAdminAndStaff(req, res) {
    const {
      pageIndex = 1,
      pageSize = 10,
      searchByName,
      sex,
      brand,
      skinType,
      skinColor,
      categoryId,
      productTypeId,
      isPublic, // Thêm filter theo isPublic
    } = req.query;

    try {
      let query = {}; // KHÔNG filter isPublic: true như user

      // Search by name
      if (searchByName) {
        query.name = { $regex: searchByName, $options: "i" };
      }

      // Filter by sex
      if (sex) {
        query.sex = sex;
      }

      // Filter by brand (có thể là array)
      if (brand) {
        const brands = Array.isArray(brand) ? brand : [brand];
        const brandObjectIds = brands.map(
          (id) => new mongoose.Types.ObjectId(id)
        );
        query.brand = { $in: brandObjectIds };
      }

      // Filter by skin type (có thể là array)
      if (skinType) {
        const skinTypes = Array.isArray(skinType) ? skinType : [skinType];
        query.skinType = { $in: skinTypes };
      }

      // Filter by skin color
      if (skinColor) {
        const skinColors = Array.isArray(skinColor) ? skinColor : [skinColor];
        query.skinColor = { $in: skinColors };
      }

      // Filter by category (có thể là array)
      if (categoryId) {
        const categoryIds = Array.isArray(categoryId)
          ? categoryId
          : [categoryId];
        const categoryObjectIds = categoryIds.map(
          (id) => new mongoose.Types.ObjectId(id)
        );
        query.categoryId = { $in: categoryObjectIds };
      }

      // Filter by product type (có thể là array)
      if (productTypeId) {
        const productTypeIds = Array.isArray(productTypeId)
          ? productTypeId
          : [productTypeId];
        const productTypeObjectIds = productTypeIds.map(
          (id) => new mongoose.Types.ObjectId(id)
        );
        query.productTypeId = { $in: productTypeObjectIds };
      }

      // Filter by isPublic (admin có thể filter theo trạng thái)
      if (isPublic !== undefined) {
        query.isPublic = isPublic === "true";
      }

      const { products, total } = await this.fetchProductById(
        query,
        pageIndex,
        pageSize
      );

      const totalPages = Math.ceil(total / pageSize);

      res.status(200).json({
        success: true,
        message: "Products fetched successfully (Admin)",
        products,
        total,
        pagination: {
          currentPage: parseInt(pageIndex),
          totalPages,
          totalProducts: total,
          pageSize: parseInt(pageSize),
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Cannot fetch products list" });
    }
  }

  async getProductById(req, res) {
    const { id } = req.params;
    try {
      const product = await Product.findOne({
        _id: id,
        isPublic: true,
      })
        .populate("brand", "brandName")
        .populate("categoryId", "name")
        .populate({
          path: "productTypeId",
          select: "name",
          populate: {
            path: "subCategoryID",
            select: "name",
          },
        });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: "Cannot fetch product" });
    }
  }

  async getProductByIdAdmin(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID format",
        });
      }

      // Admin có thể xem TẤT CẢ sản phẩm, không filter isPublic
      const product = await Product.findById(id)
        .populate("brand", "brandName")
        .populate("categoryId", "name")
        .populate({
          path: "productTypeId",
          select: "name",
          populate: {
            path: "subCategoryID",
            select: "name",
          },
        });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Product details retrieved successfully (Admin)",
        product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Cannot fetch product details",
        detail: error.message,
      });
    }
  }

  // ...existing code...

  async updateProductById(req, res) {
    const { id } = req.params;

    const allowedFields = [
      "name",
      "price",
      "brand",
      "sex",
      "skinType",
      "skinColor",
      "volume",
      "instructions",
      "preservation",
      "keyIngredients",
      "detailInfredients",
      "purpose",
      "categoryId",
      "productTypeId",
      "stock",
    ];

    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        if (["brand", "categoryId", "productTypeId"].includes(field)) {
          if (mongoose.Types.ObjectId.isValid(req.body[field])) {
            updateData[field] = new mongoose.Types.ObjectId(req.body[field]);
          } else {
            return res.status(400).json({
              error: `Invalid ${field} format`,
              detail: `${field} must be a valid ObjectId`,
            });
          }
        } else {
          updateData[field] = req.body[field];
        }
      }
    }

    try {
      let finalImgUrls = [];
      let finalPublicIds = [];
      let finalTags = [];

      if (req.body.existingImages) {
        try {
          const existingImages = JSON.parse(req.body.existingImages);
          if (Array.isArray(existingImages)) {
            finalImgUrls = [...existingImages];

            const currentProduct = await Product.findById(id);
            if (currentProduct && currentProduct.public_ids) {
              finalPublicIds = currentProduct.public_ids.slice(
                0,
                existingImages.length
              );
            }
          }
        } catch (e) {
          console.error("Error parsing existing images:", e);
        }
      }

      if (req.files && req.files.length > 0) {
        // const publicId = `product-${Date.now()}`;

        const [uploadResults, tagsResults] = await Promise.all([
          Promise.all(
            req.files.map((file, idx) =>
              this.uploadToCloudinary(
                file.buffer,
                `product-${Date.now()}-${idx}`
              )
            )
          ),
          Promise.all(
            req.files.map((file) =>
              this.analyzeImageWithCustomVision(file.buffer)
            )
          ),
        ]);

        const newImgUrls = uploadResults.map((res) => res.secure_url);
        const newPublicIds = uploadResults.map((res) => res.public_id);
        const newTags = tagsResults
          .flat()
          .filter((tag, idx, self) => self.indexOf(tag) === idx);

        finalImgUrls = [...finalImgUrls, ...newImgUrls];
        finalPublicIds = [...finalPublicIds, ...newPublicIds];
        finalTags = newTags;
      }

      if (finalImgUrls.length > 0) {
        updateData.imgUrls = finalImgUrls;
        updateData.public_ids = finalPublicIds;
      }

      if (finalTags.length > 0) {
        updateData.tags = finalTags;
      }

      const updated = await Product.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      )
        .populate("brand", "brandName")
        .populate("categoryId", "name")
        .populate({
          path: "productTypeId",
          select: "name",
          populate: {
            path: "subCategoryID",
            select: "name",
          },
        });

      if (!updated) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updated,
      });
    } catch (error) {
      res.status(500).json({
        error: "Cannot update product",
        detail: error.message,
      });
    }
  }

  async analyzeProduct(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ error: "No image uploaded for analysis" });
      }

      const file = req.files[0];
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: "Unsupported image format" });
      }

      const sharp = require("sharp");
      const processedBuffer = await sharp(file.buffer)
        .jpeg({ quality: 90 })
        .toBuffer();

      const tags = await this.analyzeImageWithCustomVision(processedBuffer);

      if (!tags.length) {
        return res.status(200).json({
          success: true,
          message: "No relevant tags found in the image",
          products: [],
          total: 0,
        });
      }

      const query = {
        isPublic: true,
        tags: { $in: tags },
      };

      const pageIndex = parseInt(req.query.pageIndex) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      const { products, total } = await this.fetchProductById(
        query,
        pageIndex,
        pageSize
      );

      res.status(200).json({
        success: true,
        message: "Products found based on image",
        tags,
        products,
        pageIndex,
        pageSize,
        total,
      });
    } catch (error) {
      res.status(500).json({
        error: "Cannot analyze product image",
        detail: error.message,
      });
    }
  }

  async disableProduct(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (!product.isPublic) {
      return res.status(400).json({ error: "Product is already disabled" });
    }

    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { isPublic: false },
        { new: true }
      )
        .populate("brand", "brandName")
        .populate("categoryId", "name")
        .populate({
          path: "productTypeId",
          select: "name",
          populate: {
            path: "subCategoryID",
            select: "name",
          },
        });

      res.status(200).json({
        success: true,
        message: "Product disabled successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({ error: "Cannot disable product" });
    }
  }

  async enableProduct(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product.isPublic) {
      return res.status(400).json({ error: "Product is already enabled" });
    }

    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { isPublic: true },
        { new: true }
      )
        .populate("brand", "brandName")
        .populate("categoryId", "name")
        .populate({
          path: "productTypeId",
          select: "name",
          populate: {
            path: "subCategoryID",
            select: "name",
          },
        });

      res.status(200).json({
        success: true,
        message: "Product enabled successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({ error: "Cannot enable product" });
    }
  }

  async deleteProductById(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    try {
      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ error: "Cannot delete product" });
    }
  }
}

module.exports = new ProductController();
