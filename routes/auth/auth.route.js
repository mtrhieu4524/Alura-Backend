const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/auth/auth.controller");
const authenticate = require("../../middlewares/auth/auth.middleware");
const { authorizeAdmin } = require("../../middlewares/auth/role.middleware");

router.post("/register", AuthController.register);
router.post(
  "/register-staff",
  authenticate,
  authorizeAdmin,
  AuthController.registerStaff
);

router.post("/login", AuthController.login);
router.post("/refresh-token/:refreshToken", AuthController.refreshToken);

router.put("/change-password", authenticate, AuthController.changePassword);

//forgot-password
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/verify-reset-code", AuthController.verifyResetCode);
router.post("/reset-password", AuthController.resetPassword);


module.exports = router;
