const express = require("express");
const router = express.Router();
const inventoryController = require("../../controllers/warehouse/inventory.controller");

router.get("/product/:productId", inventoryController.getInventoryByProduct);

module.exports = router;
