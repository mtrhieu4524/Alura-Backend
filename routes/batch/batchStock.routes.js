const express = require("express");
const router = express.Router();
const batchStockController = require("../../controllers/batch/batchStock.controller");
const authMiddleware = require("../../middlewares/auth/auth.middleware");

router.post("/", authMiddleware, batchStockController.createBatchStock);
router.get("/", authMiddleware, batchStockController.getAllBatchStocks);
router.get("/:batchStockId", authMiddleware,  batchStockController.getBatchStockById);
// router.put("/:batchStockId", authMiddleware, batchStockController.updateBatchStock);
// router.delete("/:batchStockId", authMiddleware, batchStockController.deleteBatchStock);

module.exports = router;
