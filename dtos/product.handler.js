class ProductHandler {
  constructor() {}

  createProduct(req, res, next) {
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
      } = req.body;

      switch (true) {
        case !name || name.trim() === "":
          return res
            .status(400)
            .json({ fied: "name", message: "Product name is required" });
        case !price:
          return res.status(400).json({ error: "Product price is required" });
        case !brand:
          return res.status(400).json({ error: "Product brand is required" });
        case !skinType || skinType === "":
          return res.status(400).json({
            error:
              "Product skin type must be 'dry', 'oily', 'combination', 'sensitive', 'normal' or 'all'",
          });
        case !skinColor || skinColor.trim() === "":
          return res
            .status(400)
            .json({
              error:
                "Product skin color must be warm, cool, neutral, dark or light",
            });
        case !purpose || purpose.trim() === "":
          return res.status(400).json({ error: "Product purpose is required" });
        case !volume || volume.trim() === "":
          return res.status(400).json({ error: "Product volume is required" });
        case !instructions || instructions.trim() === "":
          return res
            .status(400)
            .json({ error: "Product instructions are required" });
        case !preservation || preservation.trim() === "":
          return res
            .status(400)
            .json({ error: "Product preservation is required" });
        case !keyIngredients || keyIngredients.trim() === "":
          return res
            .status(400)
            .json({ error: "Product key ingredients is required" });
        case !detailInfredients || detailInfredients.trim() === "":
          return res
            .status(400)
            .json({ error: "Product detail ingredients is required" });
        case !categoryId:
          return res
            .status(400)
            .json({ error: "Product category is required" });
        case !productTypeId:
          return res.status(400).json({ error: "Product type is required" });
        case isNaN(price):
          return res
            .status(400)
            .json({ error: "Product price must be a valid number" });
        case !isNaN(price) && price <= 0:
          return res
            .status(400)
            .json({ error: "Product price must be greater than 0" });
        default:
          break;
      }

      next();
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal Server Error", detail: error.message });
    }
  }
}

module.exports = new ProductHandler();
