// const Product = require('../models/product.model'); // giả định bạn có model
const { Readable } = require("stream");
const cloudinary = require("../../configs/cloudinaryConfigs/cloudinary");
const Product = require("../../models/product.model");

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
        {
          $lookup: {
            from: "brands", // tên collection của Brand model
            localField: "brand",
            foreignField: "_id",
            as: "brand",
          },
        },
        {
          $unwind: {
            path: "$brand",
            preserveNullAndEmptyArrays: true, // giữ lại document nếu không có brand
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
      ]);
    } else {
      products = await Product.find(query)
        .populate("brand", "brandName")
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
          categorization: "aws_rek_tagging", // kích hoạt AI (AWS Rekognition Tagging)
          auto_tagging: 0.7, // xác suất tối thiểu để gán nhãn tự động
        },
        (error, result) => {
          if (error) {
            console.error("Upload error:", error); // Log lỗi chi tiết
            return reject(error);
          }
          console.log("Upload result:", JSON.stringify(result, null, 2)); // Log toàn bộ result
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
      const tags = result
        .map((r) => r.tags || [])
        .flat()
        .filter((tag, idx, self) => self.indexOf(tag) === idx);

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
        tags: tags,
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
    const {
      pageIndex = 1,
      pageSize = 10,
      searchByName,
      searchByTag,
    } = req.query;
    try {
      let query = { isPublic: true };
      if (searchByName) {
        query.name = { $regex: searchByName, $options: "i" };
      }

      let searchByTagArray = [];
      if (searchByTag) {
        searchByTagArray = Array.isArray(searchByTag)
          ? searchByTag
          : [searchByTag];
        query.tags = { $in: searchByTagArray }; // Tìm kiếm theo tag
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

        updateData.tags = result
          .map((r) => r.tags || [])
          .flat()
          .filter((tag, idx, self) => self.indexOf(tag) === idx); // loại bỏ trùng lặp
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
  async analyzeProduct(req, res) {
    try {
      const { searchByTag } = req.query;
      let tags = [];

      // Trường hợp 1: Nhận diện ảnh từ req.files
      if (req.files && req.files.length > 0) {
        const publicId = `product-analyze-${Date.now()}`;
        const results = await Promise.all(
          req.files.map((file) =>
            this.uploadToCloudinary(file.buffer, publicId)
          )
        );
        tags = results
          .map(
            (result) => result.tags || [] // Lấy tags từ kết quả upload
          )
          .flat()
          .filter((tag, idx, self) => self.indexOf(tag) === idx);

        if (!tags.length) {
          console.log(
            "No tags detected from Cloudinary, returning empty result."
          );
          return res.status(200).json({
            success: true,
            message: "No tags detected from image",
            products: [],
            total: 0,
          });
        }
      }
      // Trường hợp 2: Sử dụng tags từ query (tìm kiếm thủ công)
      else if (searchByTag) {
        tags = Array.isArray(searchByTag) ? searchByTag : [searchByTag];
      }

      let query = { isPublic: true };
      if (tags.length > 0) {
        query.tags = { $in: tags };
      }

      const pageIndex = parseInt(req.query.pageIndex) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const { products, total } = await this.fetchProductById(
        query,
        pageIndex,
        pageSize
      );

      res.status(200).json({
        success: true,
        message:
          tags.length > 0
            ? "Products found based on image/tags"
            : "No search criteria provided",
        tags,
        products,
        pageIndex,
        pageSize,
        total,
      });
    } catch (error) {
      console.log("Error analyzing product:", error);
      res
        .status(500)
        .json({ error: "Cannot analyze product", detail: error.message });
    }
  }
}

module.exports = new ProductController();
