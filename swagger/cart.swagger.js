/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Shopping cart management APIs (add, view, update, remove items)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the cart
 *           example: 507f1f77bcf86cd799439011
 *         userId:
 *           type: string
 *           description: The user id who owns the cart
 *           example: 607f1f77bcf86cd799439012
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the cart was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the cart was last updated
 *
 *     CartItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the cart item
 *           example: 507f1f77bcf86cd799439013
 *         cartId:
 *           type: string
 *           description: The cart id that contains this item
 *           example: 507f1f77bcf86cd799439011
 *         productId:
 *           type: object
 *           description: The product details
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439014
 *             name:
 *               type: string
 *               example: Nike Air Max
 *             price:
 *               type: number
 *               example: 2500000
 *             isPublic:
 *               type: boolean
 *               example: true
 *         quantity:
 *           type: number
 *           description: Quantity of the product in cart
 *           example: 2
 *         unitPrice:
 *           type: number
 *           description: Price per unit when added to cart
 *           example: 2500000
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the item was added to cart
 *
 *     AddToCartInput:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           description: The product id to add to cart
 *           example: 507f1f77bcf86cd799439014
 *         quantity:
 *           type: number
 *           minimum: 1
 *           description: Quantity to add to cart
 *           example: 2
 *
 *     UpdateCartItemInput:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: number
 *           minimum: 1
 *           description: New quantity for the cart item
 *           example: 3
 *
 *     CartResponse:
 *       type: object
 *       properties:
 *         cartId:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         totalAmount:
 *           type: number
 *           description: Total amount of all items in cart
 *           example: 5000000
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Response message
 *         cartItem:
 *           $ref: '#/components/schemas/CartItem'
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartInput'
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đã thêm vào giỏ hàng
 *                 cartItem:
 *                   $ref: '#/components/schemas/CartItem'
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 */

/**
 * @swagger
 * /api/cart/item/{cartItemId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID
 *         example: 507f1f77bcf86cd799439013
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartItemInput'
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đã cập nhật số lượng
 *                 cartItem:
 *                   $ref: '#/components/schemas/CartItem'
 */

/**
 * @swagger
 * /api/cart/item/{cartItemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID
 *         example: 507f1f77bcf86cd799439013
 *     responses:
 *       200:
 *         description: Cart item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đã xoá sản phẩm khỏi giỏ hàng
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
