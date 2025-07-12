const express = require("express");
const router = express.Router();
const warehouseController = require("../../controllers/warehouse/warehouse.controller");

const authMiddleware = require("../../middlewares/auth/auth.middleware");
const { authorizeAdmin } = require("../../middlewares/auth/role.middleware");

router.post("/", authMiddleware, authorizeAdmin, warehouseController.createWarehouse);
router.get("/", authMiddleware, authorizeAdmin, warehouseController.getAllWarehouses);
router.get("/:warehouseId", authMiddleware, authorizeAdmin, warehouseController.getWarehouseById);
router.put("/:warehouseId", authMiddleware, authorizeAdmin, warehouseController.updateWarehouse);
router.delete("/:warehouseId", authMiddleware, authorizeAdmin, warehouseController.deleteWarehouse);

module.exports = router;
