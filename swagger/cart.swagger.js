/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Shopping cart management APIs (add, view, update, remove items)
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 *               example: Sữa rửa mặt Neutrogena
 *             price:
 *               type: number
 *               example: 150000
 *             isPublic:
 *               type: boolean
 *               example: true
 *             stock:
 *               type: number
 *               example: 50
 *             imgUrls:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"]
 *             productTypeId:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                   example: "Sữa rửa mặt"
 *         quantity:
 *           type: number
 *           description: Quantity of the product in cart
 *           example: 2
 *         unitPrice:
 *           type: number
 *           description: Price per unit when added to cart
 *           example: 150000
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the item was added to cart
 *
 *     CartItemMapped:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439013
 *         productId:
 *           type: string
 *           example: 507f1f77bcf86cd799439014
 *         productName:
 *           type: string
 *           example: Sữa rửa mặt Neutrogena
 *         productType:
 *           type: string
 *           example: Sữa rửa mặt
 *         quantity:
 *           type: number
 *           example: 2
 *         unitPrice:
 *           type: number
 *           example: 150000
 *         totalItemPrice:
 *           type: number
 *           example: 300000
 *         imgUrls:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"]
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
 *     PreviewCartInput:
 *       type: object
 *       required:
 *         - selectedCartItemIds
 *       properties:
 *         selectedCartItemIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of cart item IDs to preview
 *           example: ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439015"]
 *         promotionId:
 *           type: string
 *           description: Optional promotion ID to apply discount
 *           example: "507f1f77bcf86cd799439021"
 *         shippingMethod:
 *           type: string
 *           enum: [STANDARD, EXPRESS]
 *           description: Shipping method (affects shipping fee)
 *           example: "STANDARD"
 *
 *     CartResponse:
 *       type: object
 *       properties:
 *         cartId:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         totalAmount:
 *           type: number
 *           description: Total amount of all items in cart
 *           example: 500000
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItemMapped'
 *
 *     PreviewCartResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439014
 *               productName:
 *                 type: string
 *                 example: Sữa rửa mặt Neutrogena
 *               productType:
 *                 type: string
 *                 example: Sữa rửa mặt
 *               productImgUrl:
 *                 type: string
 *                 example: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *               quantity:
 *                 type: number
 *                 example: 2
 *               unitPrice:
 *                 type: number
 *                 example: 150000
 *               totalItemPrice:
 *                 type: number
 *                 example: 300000
 *         subTotal:
 *           type: number
 *           description: Subtotal before discount and shipping
 *           example: 300000
 *         discountAmount:
 *           type: number
 *           description: Discount amount from promotion
 *           example: 15000
 *         shippingFee:
 *           type: number
 *           description: Shipping fee based on method
 *           example: 30000
 *         total:
 *           type: number
 *           description: Final total amount
 *           example: 315000
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
 *     summary: Add product to cart (USER)
 *     description: Add a product to user's cart. If product already exists in cart, increase quantity. Validates product availability and stock.
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
 *       400:
 *         description: Validation error or insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     missing_info: "Thiếu thông tin hoặc số lượng không hợp lệ"
 *                     invalid_product: "Sản phẩm không hợp lệ hoặc đã bị ẩn"
 *                     insufficient_stock: "Sản phẩm không đủ số lượng hàng cho yêu cầu"
 *                     exceed_stock: "Chỉ còn 10 sản phẩm trong kho"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User role required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's shopping cart (USER)
 *     description: Retrieve user's cart with all items. Filters out items with unavailable or private products.
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User role required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart/preview:
 *   post:
 *     summary: Preview selected cart items with pricing calculation (USER)
 *     description: |
 *       Calculate pricing for selected cart items including:
 *       - Subtotal of selected items
 *       - Discount from promotion (if valid)
 *       - Shipping fee based on method
 *       - Final total amount
 *
 *       **Promotion validation:**
 *       - Must be active and public
 *       - Within start/end date
 *       - Not exceed usage limit
 *       - User hasn't used it before
 *       - Order meets minimum amount requirement
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PreviewCartInput'
 *     responses:
 *       200:
 *         description: Cart preview calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PreviewCartResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     no_items: "Bạn cần chọn ít nhất 1 sản phẩm"
 *                     empty_cart: "Giỏ hàng trống"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User role required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart/item/{cartItemId}:
 *   put:
 *     summary: Update cart item quantity (USER)
 *     description: Update the quantity of a specific cart item. Validates product availability and stock before updating.
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
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     unavailable: "Sản phẩm này không còn khả dụng để cập nhật"
 *                     insufficient_stock: "Sản phẩm không đủ số lượng hàng cho yêu cầu"
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy cart item
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User role required
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Remove item from cart (USER)
 *     description: Remove a specific item from user's cart permanently.
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
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy cart item
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User role required
 *       500:
 *         description: Internal server error
 */
