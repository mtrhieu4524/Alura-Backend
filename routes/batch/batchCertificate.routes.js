const express = require("express");
const router = express.Router();
const batchCertificateController = require("../../controllers/batch/batchCertificate.controller");
const authMiddleware = require("../../middlewares/auth/auth.middleware");
const { authorizeAdmin } = require("../../middlewares/auth/role.middleware");

router.post("/",authMiddleware, authorizeAdmin, batchCertificateController.createBatchCertificate);
router.get("/",authMiddleware, authorizeAdmin, batchCertificateController.getAllBatchCertificates);
router.get("/:certificateId",authMiddleware, authorizeAdmin, batchCertificateController.getBatchCertificateById);
router.put("/:certificateId",authMiddleware,authorizeAdmin, batchCertificateController.updateBatchCertificate);
router.delete("/:certificateId",authMiddleware, authorizeAdmin, batchCertificateController.deleteBatchCertificate);

module.exports = router;
