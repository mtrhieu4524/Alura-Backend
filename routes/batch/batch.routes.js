const express = require("express");
const router = express.Router();
const batchController = require("../../controllers/batch/batch.controller");
const authMiddleware = require("../../middlewares/auth/auth.middleware");

router.post("/", authMiddleware, batchController.createBatch);
router.get("/", authMiddleware, batchController.getAllBatches);
router.get("/summary/:batchId", authMiddleware, batchController.getBatchSummary);
router.get("/:batchId", authMiddleware, batchController.getBatchById);
router.put("/:batchId", authMiddleware, batchController.updateBatch);
router.patch("/:batchId/lock", authMiddleware, batchController.lockBatch);
router.delete("/:batchId", authMiddleware, batchController.deleteBatch);

module.exports = router;
