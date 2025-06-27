const express = require("express");
const router = express.Router();
const distributorController = require("../../controllers/batch/distributor.controller");

router.post("/", distributorController.createDistributor);
router.get("/", distributorController.getAllDistributors);
router.get("/:distributorId", distributorController.getDistributorById);
router.put("/:distributorId", distributorController.updateDistributor);
router.delete("/:distributorId", distributorController.deleteDistributor);

module.exports = router;
