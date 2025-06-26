const express = require("express");
const router = express.Router();
const batchController = require("../../controllers/batch/batch.controller");

router.post("/", batchController.createBatch);
router.get("/", batchController.getAllBatches);
router.get("/:batchId", batchController.getBatchById);
router.put("/:batchId", batchController.updateBatch);
router.patch("/:batchId/lock", batchController.lockBatch);
router.delete("/:batchId", batchController.deleteBatch);

module.exports = router;
