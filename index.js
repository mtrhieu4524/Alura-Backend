// Import dependencies
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger");
const dotenv = require("dotenv");

// Initialize express app
const app = express();

dotenv.config();

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure HTTP headers

// MongoDB connection (update with your MongoDB URI)
mongoose
  .connect("mongodb://localhost:27017/mydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Swagger API documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Sample route to test
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
