const express = require("express");
const router = express.Router();
const userController = require("../controllers/user/user.controller");
const userHandler = require("../dtos/user.handler");
const authMiddleware = require("../middlewares/auth/auth.middleware");

router.get(
  "/:userId",
  authMiddleware,
  userHandler.getUserById,
  userController.getUserById
);
router.put(
  "/:userId",
  authMiddleware,
  userHandler.updateUserProfile,
  userController.updateUserProfile
);

router.get("/", authMiddleware, userController.getAllUsers);

router.put(
  "change-password/:userId",
  authMiddleware,
  userHandler.changePassword,
  userController.changePassword
);

module.exports = router;
