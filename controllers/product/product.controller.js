// const Product = require('../models/product.model'); // giả định bạn có model
const { Readable } = require("stream");
const cloudinary = require("../../configs/cloudinaryConfigs/cloudinary");
const Product = require("../../models/product.model");

class ProductController {
  async uploadToCloudinary(buffer, publicId) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
          public_id: publicId,
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }
  async createProduct(req, res) {
    try {
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

      if (req.files.length === 0) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const publicId = `product-${Date.now()}`;

      const result = await Promise.all(
        req.files.map((file) => this.uploadToCloudinary(file.buffer, publicId))
      );

      const imgUrls = result.map((result) => result.secure_url);
      const public_ids = result.map((result) => result.public_id);

      const product = await Product.create({
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
        isPublic: true,
        imgUrls,
        public_ids,
        stock: stock ? Number(stock) : 0,
      });

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.log("Error creating product:", error);

      res
        .status(500)
        .json({ error: "Cannot create product", detail: error.message });
    }
  }

  async getAllProducts(req, res) {
    const { pageIndex = 1, pageSize = 10, searchByName } = req.query;
    try {
      let query = { isPublic: true };
      if (searchByName) {
        query.name = { $regex: searchByName, $options: "i" };
      }
      const skip = (pageIndex - 1) * pageSize;
      const products = await Product.find(query)
        .skip(skip)
        .limit(Number(pageSize));
      // .populate("categoryId", "name")
      // .populate("productTypeId", "name");

      res.status(200).json(products);
    } catch (error) {
      console.log("Error fetching products:", error);
      res.status(500).json({ error: "Cannot fetch products list" });
    }
  }

  async getProductById(req, res) {
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
      // .populate("categoryId", "name")
      // .populate("productTypeId", "name");
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      console.log("Error fetching product by ID:", error);
      res.status(500).json({ error: "Cannot fetch product" });
    }
  }

  async updateProductById(req, res) {
    const { id } = req.params;
    const allowedFields = [
      "name",
      "price",
      "brand",
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
      "isPublic",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.files && req.files.length > 0) {
      try {
        const publicId = `product-${Date.now()}`;
        const result = await Promise.all(
          req.files.map((file) =>
            this.uploadToCloudinary(file.buffer, publicId)
          )
        );
        updateData.imgUrls = result.map((res) => res.secure_url);
        updateData.public_ids = result.map((res) => res.public_id);
      } catch (error) {
        console.log("Error uploading images:", error);
        return res.status(500).json({ error: "Cannot upload images" });
      }
    }

    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      if (!product) {
        return res
          .status(400)
          .json({ error: "Update failed: invalid or missing data" });
      }
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.log("Error updating product by ID:", error);
      res.status(500).json({ error: "Cannot update product" });
    }
  }
}

module.exports = new ProductController();
