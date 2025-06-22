const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/auth/auth.controller');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token/:refreshToken', AuthController.refreshToken);

module.exports = router;