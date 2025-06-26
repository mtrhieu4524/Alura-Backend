// models/distributor.model.js
const mongoose = require("mongoose");

const distributorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  address: String,
});

module.exports = mongoose.model("Distributor", distributorSchema);
