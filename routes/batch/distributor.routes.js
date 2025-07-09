const express = require("express");
const router = express.Router();
const distributorController = require("../../controllers/batch/distributor.controller");
const authMiddleware = require("../../middlewares/auth/auth.middleware");

router.post("/", authMiddleware, distributorController.createDistributor);
router.get("/", authMiddleware, distributorController.getAllDistributors);
router.get("/:distributorId", authMiddleware, distributorController.getDistributorById);
router.put("/:distributorId", authMiddleware, distributorController.updateDistributor);
router.delete("/:distributorId", authMiddleware, distributorController.deleteDistributor);

module.exports = router;
