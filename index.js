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

//jobs
const autoCancelUnpaidOrders = require("./jobs/order/autoCancelUnpaidOrders");

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
autoCancelUnpaidOrders();
// Sample route to test
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", require("./routes/auth/auth.route"));

app.use("/api/product/category", require("./routes/category/category.routes"));
app.use(
  "/api/product/sub-category",
  require("./routes/category/subCategory.routes")
);
app.use(
  "/api/product/product-type",
  require("./routes/category/productType.routes")
);
app.use("/api/product/brand", require("./routes/category/brand.routes"));

//cart
app.use("/api/cart", require("./routes/cart/cart.routes"));

//order
app.use("/api/order", require("./routes/order/order.routes"));

//payment
app.use("/api/payment", require("./routes/payment/payment.routes"));

//batch
app.use("/api/batch", require("./routes/batch/batch.routes"));
app.use("/api/batch/certificate", require("./routes/batch/batchCertificate.routes"));
app.use("/api/batch/stock", require("./routes/batch/batchStock.routes"));
app.use("/api/batch/distributor", require("./routes/batch/distributor.routes"));

//distributor
app.use("/api/distributor", require("./routes/batch/distributor.routes"));

//warehouse
app.use("/api/warehouse", require("./routes/warehouse/warehouse.routes"));
app.use("/api/warehouse/inventory", require("./routes/warehouse/inventory.routes"));





// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
