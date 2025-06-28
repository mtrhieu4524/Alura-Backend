// Import dependencies
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");
const swaggerUi = require("swagger-ui-express");
const setupSwagger = require("./swagger");
const dotenv = require("dotenv");
const productRoutes = require("./routes/product/product.routes");
const subCategoryRoutes = require("./routes/category/subCategory.routes");

// Initialize express app
const app = express();

dotenv.config();

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure HTTP headers

// MongoDB connection (update with your MongoDB URI)
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Swagger API documentation route
setupSwagger(app);
// Sample route to test
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", require("./routes/auth/auth.route"));

app.use("/api/categories", require("./routes/category/category.routes"));
app.use("/api/sub-categories", subCategoryRoutes);
app.use("/api/product-types", require("./routes/category/productType.routes"));
app.use("/api/brands", require("./routes/category/brand.routes"));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
