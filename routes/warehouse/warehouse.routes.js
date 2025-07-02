const express = require("express");
const router = express.Router();
const warehouseController = require("../../controllers/warehouse/warehouse.controller");

router.post("/", warehouseController.createWarehouse);
router.get("/", warehouseController.getAllWarehouses);
router.get("/:warehouseId", warehouseController.getWarehouseById);
router.put("/:warehouseId", warehouseController.updateWarehouse);

module.exports = router;
