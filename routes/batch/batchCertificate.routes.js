const express = require("express");
const router = express.Router();
const batchCertificateController = require("../../controllers/batch/batchCertificate.controller");
const authMiddleware = require("../../middlewares/auth/auth.middleware");

router.post("/",authMiddleware, batchCertificateController.createBatchCertificate);
router.get("/",authMiddleware, batchCertificateController.getAllBatchCertificates);
router.get("/:certificateId",authMiddleware, batchCertificateController.getBatchCertificateById);
router.put("/:certificateId",authMiddleware, batchCertificateController.updateBatchCertificate);
router.delete("/:certificateId",authMiddleware, batchCertificateController.deleteBatchCertificate);

module.exports = router;
