const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/auth/auth.controller');
const authenticate = require('../../middlewares/auth/auth.middleware');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token/:refreshToken', AuthController.refreshToken);

router.put("/change-password", authenticate, AuthController.changePassword);

module.exports = router;