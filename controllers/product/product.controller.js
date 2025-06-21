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
        isPublic,
      } = req.body;

      if (req.files.length === 0) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const publicId = `product-${Date.now()}`;

      const result = await this.uploadToCloudinary(
        req.files[0].buffer,
        publicId
      );

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
        isPublic: isPublic,
        imgUrl: result.secure_url,
        public_id: result.public_id,
      });

      res.status(201).json(product);
    } catch (error) {
      console.log("Error creating product:", error);

      res
        .status(500)
        .json({ error: "Tạo sản phẩm thất bại", detail: error.message });
    }
  }
}

module.exports = new ProductController();
