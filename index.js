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
const userRoutes = require("./routes/user.routes");

//jobs
const autoCancelUnpaidOrders = require("./jobs/order/autoCancelUnpaidOrders");

// Initialize express app
const app = express();

dotenv.config();

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(
  cors({
    origin: [
      process.env.CLIENT_URI,
      "http://localhost:5173",
      process.env.DEPLOYMENT_URL,
      process.env.FRONTEND_URL,
    ],
    credentials: true, // Allow requests from the client URI
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
  })
); // Enable CORS

app.use(helmet()); // Secure HTTP headers
app.use(express.urlencoded({ extended: true }));

// MongoDB connection (update with your MongoDB URI)
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Swagger API documentation route
setupSwagger(app);
// autoCancelUnpaidOrders();
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

app.use("/api/promotion", require("./routes/promotion/promotion.routes"));

//cart
app.use("/api/cart", require("./routes/cart/cart.routes"));

//order 
app.use("/api/order", require("./routes/order/order.routes"));

//payment
app.use("/api/payment", require("./routes/payment/payment.routes"));

//batch
app.use("/api/batch", require("./routes/batch/batch.routes"));
app.use(
  "/api/batch-certificate",
  require("./routes/batch/batchCertificate.routes")
);
app.use("/api/batch-stock", require("./routes/batch/batchStock.routes"));

//distributor
app.use("/api/distributor", require("./routes/batch/distributor.routes"));

//warehouse
app.use("/api/warehouse", require("./routes/warehouse/warehouse.routes"));

// inventory
app.use(
  "/api/inventory-movement",
  require("./routes/warehouse/inventoryMovement.routes")
);
app.use("/api/inventory", require("./routes/warehouse/inventory.routes"));

//dashboard
app.use("/api/dashboard", require("./routes/dashboard/dashboard.routes.js"));


// user profile
app.use("/api/profile", userRoutes);



// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
