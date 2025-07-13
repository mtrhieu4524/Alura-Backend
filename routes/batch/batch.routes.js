const express = require("express");
const router = express.Router();
const batchController = require("../../controllers/batch/batch.controller");
const authMiddleware = require("../../middlewares/auth/auth.middleware");

const { authorizeAdmin } = require("../../middlewares/auth/role.middleware");

router.post("/", authMiddleware, authorizeAdmin, batchController.createBatch);
router.get("/", authMiddleware, authorizeAdmin, batchController.getAllBatches);
router.get("/:batchId", authMiddleware, authorizeAdmin, batchController.getBatchById);
router.put("/:batchId", authMiddleware, authorizeAdmin, batchController.updateBatch);
router.delete("/:batchId", authMiddleware, authorizeAdmin, batchController.deleteBatch);


router.get("/summary/:batchId",  authMiddleware, authorizeAdmin, batchController.getBatchSummary);
router.patch("/:batchId/lock", authMiddleware, batchController.lockBatch);

module.exports = router;
