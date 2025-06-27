const express = require("express");
const router = express.Router();
const controller = require("../../controllers/warehouse/inventoryMovement.controller");

router.post("/", controller.createInventoryMovement);
router.get("/", controller.getAllInventoryMovements);
router.get("/:movementId", controller.getInventoryMovementById);
router.delete("/:movementId", controller.deleteInventoryMovement);

module.exports = router;
