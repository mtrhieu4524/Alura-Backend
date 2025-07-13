const express = require("express");
const router = express.Router();
const distributorController = require("../../controllers/batch/distributor.controller");
const authMiddleware = require("../../middlewares/auth/auth.middleware");

const { authorizeAdmin } = require("../../middlewares/auth/role.middleware");


router.post("/", authMiddleware, authorizeAdmin, distributorController.createDistributor);
router.get("/", authMiddleware, authorizeAdmin, distributorController.getAllDistributors);
router.get("/:distributorId", authMiddleware, distributorController.getDistributorById);
router.put("/:distributorId", authMiddleware, authorizeAdmin, distributorController.updateDistributor);
router.delete("/:distributorId", authMiddleware, authorizeAdmin, distributorController.deleteDistributor);

module.exports = router;
