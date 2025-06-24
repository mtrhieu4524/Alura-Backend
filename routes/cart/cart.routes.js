const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cart/cart.controller');

const authenticate = require('../../middlewares/auth/auth.middleware');
const { authorizeUser } = require('../../middlewares/auth/role.middleware');

router.post('/add',authenticate , authorizeUser, cartController.addToCart);
router.get('/', authenticate , authorizeUser, cartController.getCart);
router.put('/item/:cartItemId', authenticate , authorizeUser, cartController.updateCartItem);
router.delete('/item/:cartItemId', authenticate , authorizeUser, cartController.removeCartItem);

module.exports = router;
