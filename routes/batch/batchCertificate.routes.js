const express = require("express");
const router = express.Router();
const batchCertificateController = require("../../controllers/batch/batchCertificate.controller");

router.post("/", batchCertificateController.createBatchCertificate);
router.get("/", batchCertificateController.getAllBatchCertificates);
router.get("/:certificateId", batchCertificateController.getBatchCertificateById);
router.put("/:certificateId", batchCertificateController.updateBatchCertificate);
router.delete("/:certificateId", batchCertificateController.deleteBatchCertificate);

module.exports = router;
