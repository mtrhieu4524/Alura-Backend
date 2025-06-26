const express = require("express");
const router = express.Router();
const batchStockController = require("../controllers/batchStock.controller");

router.post("/", batchStockController.createBatchStock);
router.get("/", batchStockController.getAllBatchStocks);
router.get("/:batchStockId", batchStockController.getBatchStockById);
router.put("/:batchStockId", batchStockController.updateBatchStock);
router.delete("/:batchStockId", batchStockController.deleteBatchStock);

module.exports = router;
