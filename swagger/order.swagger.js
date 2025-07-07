/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Order ID
 *           example: "507f1f77bcf86cd799439019"
 *         userId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "507f1f77bcf86cd799439020"
 *             name:
 *               type: string
 *               example: "John Doe"
 *             email:
 *               type: string
 *               example: "john@example.com"
 *             phone:
 *               type: string
 *               example: "+84901234567"
 *         shippingAddress:
 *           type: string
 *           example: "123 Main St, Ho Chi Minh City"
 *         subTotal:
 *           type: number
 *           example: 100000
 *         discountAmount:
 *           type: number
 *           example: 10000
 *         shippingFee:
 *           type: number
 *           example: 30000
 *         totalAmount:
 *           type: number
 *           example: 120000
 *         promotionId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "507f1f77bcf86cd799439021"
 *             code:
 *               type: string
 *               example: "DISCOUNT10"
 *             discountValue:
 *               type: number
 *               example: 10
 *         shippingMethod:
 *           type: string
 *           enum: [STANDARD, EXPRESS]
 *           example: "STANDARD"
 *         orderStatus:
 *           type: string
 *           enum: [Pending, Processing, Shipped, Delivered, Success, Cancelled]
 *           example: "Pending"
 *         paymentStatus:
 *           type: string
 *           enum: [Pending, Paid, Unpaid, Failed, Refunded]
 *           example: "Pending"
 *         paymentMethod:
 *           type: string
 *           enum: [COD, VNPAY]
 *           example: "COD"
 *         paymentTransactionId:
 *           type: string
 *           example: null
 *         orderDate:
 *           type: string
 *           format: date-time
 *           example: "2025-01-03T10:30:00Z"
 *         note:
 *           type: string
 *           example: "Deliver after 5 PM"
 *         hasRestocked:
 *           type: boolean
 *           example: false
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     OrderItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439022"
 *         orderId:
 *           type: string
 *           example: "507f1f77bcf86cd799439019"
 *         productId:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *         quantity:
 *           type: number
 *           example: 2
 *         unitPrice:
 *           type: number
 *           example: 50000
 *         productName:
 *           type: string
 *           example: "Sữa rửa mặt Neutrogena"
 *         productImgUrl:
 *           type: string
 *           example: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     PlaceOrderInput:
 *       type: object
 *       required:
 *         - shippingAddress
 *         - shippingMethod
 *         - selectedCartItemIds
 *       properties:
 *         shippingAddress:
 *           type: string
 *           minLength: 5
 *           maxLength: 255
 *           example: "123 Main St, Ho Chi Minh City"
 *         shippingMethod:
 *           type: string
 *           enum: [STANDARD, EXPRESS]
 *           example: "STANDARD"
 *         promotionId:
 *           type: string
 *           example: "507f1f77bcf86cd799439021"
 *         note:
 *           type: string
 *           example: "Deliver after 5 PM"
 *         selectedCartItemIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["507f1f77bcf86cd799439023", "507f1f77bcf86cd799439024"]
 *
 *     PrepareVnpayInput:
 *       type: object
 *       required:
 *         - shippingAddress
 *         - shippingMethod
 *         - selectedCartItemIds
 *       properties:
 *         shippingAddress:
 *           type: string
 *           minLength: 5
 *           maxLength: 255
 *           example: "123 Main St, Ho Chi Minh City"
 *         shippingMethod:
 *           type: string
 *           enum: [STANDARD, EXPRESS]
 *           example: "STANDARD"
 *         promotionId:
 *           type: string
 *           example: "507f1f77bcf86cd799439021"
 *         note:
 *           type: string
 *           example: "Deliver after 5 PM"
 *         selectedCartItemIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["507f1f77bcf86cd799439023", "507f1f77bcf86cd799439024"]
 *
 *     UpdateOrderInput:
 *       type: object
 *       required:
 *         - orderStatus
 *       properties:
 *         orderStatus:
 *           type: string
 *           enum: [Pending, Processing, Shipped, Delivered, Success, Cancelled]
 *           example: "Processing"
 */

/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Order management APIs
 */

/**
 * @swagger
 * /api/order/place:
 *   post:
 *     summary: Place a new order with COD payment (User only)
 *     description: Create a new order with COD payment method. Updates product stock, removes selected cart items, and creates shipping record.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaceOrderInput'
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đặt hàng thành công"
 *                 orderId:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439019"
 */

/**
 * @swagger
 * /api/order/prepare-vnpay:
 *   post:
 *     summary: Prepare an order for VNPay payment (User only)
 *     description: Create a new order with VNPAY payment method in pending status. Does not update stock until payment is confirmed.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrepareVnpayInput'
 *     responses:
 *       201:
 *         description: Order prepared successfully for VNPay payment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo đơn thành công. Tiếp tục thanh toán VNPay."
 *                 orderId:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439019"
 *                 amount:
 *                   type: number
 *                   example: 120000
 */

/**
 * @swagger
 * /api/order/cancel/{orderId}:
 *   put:
 *     summary: Cancel order by user (User only)
 *     description: Cancel order and restore product stock. Only works for orders in Pending or Processing status.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *         example: "507f1f77bcf86cd799439019"
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đơn hàng đã được hủy và hoàn tồn kho thành công"
 */

/**
 * @swagger
 * /api/order/{userId}:
 *   get:
 *     summary: Get orders by user ID (Any authenticated user)
 *     description: Retrieve all orders for a specific user, sorted by order date (newest first)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "507f1f77bcf86cd799439020"
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /api/order/by-user/{userId}:
 *   get:
 *     summary: Get orders by user ID (Alternative route)
 *     description: Retrieve all orders for a specific user, sorted by order date (newest first)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "507f1f77bcf86cd799439020"
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /api/order/by-order/{orderId}:
 *   get:
 *     summary: Get order details by order ID (Any authenticated user)
 *     description: Retrieve detailed information of a specific order including user info and order items
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *         example: "507f1f77bcf86cd799439019"
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /api/order/all:
 *   get:
 *     summary: Get all orders (Any authenticated user)
 *     description: Retrieve all orders in the system, sorted by order date (newest first). Includes user and promotion information.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /api/order/update-cod/{orderId}:
 *   put:
 *     summary: Update order status (Staff only)
 *     description: Update order status with validation of status transitions. Auto-updates payment status for certain transitions. Handles stock restoration for cancelled orders.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *         example: "507f1f77bcf86cd799439019"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderInput'
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật trạng thái đơn hàng thành công"
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 */
