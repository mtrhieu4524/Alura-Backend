const express = require("express");
const router = express.Router();
const batchStockController = require("../../controllers/batch/batchStock.controller");
const authMiddleware = require("../../middlewares/auth/auth.middleware");
const { authorizeAdmin } = require("../../middlewares/auth/role.middleware");

router.post("/", authMiddleware, authorizeAdmin, batchStockController.createBatchStock);
router.get("/", authMiddleware, authorizeAdmin, batchStockController.getAllBatchStocks);
router.get("/:batchStockId", authMiddleware, authorizeAdmin,  batchStockController.getBatchStockById);
// router.put("/:batchStockId", authMiddleware, batchStockController.updateBatchStock);
// router.delete("/:batchStockId", authMiddleware, batchStockController.deleteBatchStock);

module.exports = router;
