/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Order management APIs (place and prepare VNPay orders)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - shippingAddress
 *         - subTotal
 *         - totalAmount
 *         - shippingMethod
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the order
 *           example: 507f1f77bcf86cd799439019
 *         userId:
 *           type: string
 *           description: ID of the user placing the order
 *           example: 507f1f77bcf86cd799439020
 *         shippingAddress:
 *           type: string
 *           description: Shipping address for the order
 *           example: 123 Main St, City, Country
 *         subTotal:
 *           type: number
 *           description: Total amount before discount and shipping
 *           example: 100000
 *         discountAmount:
 *           type: number
 *           description: Discount amount applied to the order
 *           example: 10000
 *         shippingFee:
 *           type: number
 *           description: Shipping fee for the order
 *           example: 30000
 *         totalAmount:
 *           type: number
 *           description: Total amount after discount and shipping
 *           example: 120000
 *         promotionId:
 *           type: string
 *           description: ID of the applied promotion
 *           example: 507f1f77bcf86cd799439021
 *         shippingMethod:
 *           type: string
 *           enum: [STANDARD, EXPRESS]
 *           description: Shipping method for the order
 *           example: STANDARD
 *         orderStatus:
 *           type: string
 *           enum: [Pending, Processing, Shipped, Delivered, Cancelled]
 *           description: Current status of the order
 *           example: Pending
 *         paymentStatus:
 *           type: string
 *           enum: [Pending, Paid, Failed, Refunded]
 *           description: Current payment status of the order
 *           example: Pending
 *         paymentMethod:
 *           type: string
 *           enum: [COD, VNPAY]
 *           description: Payment method for the order
 *           example: COD
 *         paymentTransactionId:
 *           type: string
 *           description: Transaction ID for the payment
 *           example: null
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: Date when the order was placed
 *           example: 2025-06-29T12:00:00Z
 *         note:
 *           type: string
 *           description: Additional notes for the order
 *           example: Deliver after 5 PM
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the order was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the order was last updated
 *
 *     OrderItem:
 *       type: object
 *       required:
 *         - orderId
 *         - productId
 *         - quantity
 *         - unitPrice
 *         - productName
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the order item
 *           example: 507f1f77bcf86cd799439022
 *         orderId:
 *           type: string
 *           description: ID of the associated order
 *           example: 507f1f77bcf86cd799439019
 *         productId:
 *           type: string
 *           description: ID of the product
 *           example: 507f1f77bcf86cd799439012
 *         quantity:
 *           type: number
 *           description: Quantity of the product ordered
 *           example: 2
 *         unitPrice:
 *           type: number
 *           description: Price per unit at the time of order
 *           example: 50000
 *         productName:
 *           type: string
 *           description: Name of the product
 *           example: Nike Air Max
 *         productImgUrl:
 *           type: string
 *           description: URL of the product image
 *           example: https://via.placeholder.com/150
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the order item was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the order item was last updated
 *
 *     OrderInput:
 *       type: object
 *       required:
 *         - shippingAddress
 *         - shippingMethod
 *         - paymentMethod
 *       properties:
 *         shippingAddress:
 *           type: string
 *           description: Shipping address for the order
 *           example: 123 Main St, City, Country
 *         shippingMethod:
 *           type: string
 *           enum: [STANDARD, EXPRESS]
 *           description: Shipping method for the order
 *           example: STANDARD
 *         promotionId:
 *           type: string
 *           description: ID of the promotion to apply
 *           example: 507f1f77bcf86cd799439021
 *         note:
 *           type: string
 *           description: Additional notes for the order
 *           example: Deliver after 5 PM
 *         paymentMethod:
 *           type: string
 *           enum: [COD, VNPAY]
 *           description: Payment method for the order
 *           example: COD
 *
 *     VnpayOrderInput:
 *       type: object
 *       required:
 *         - shippingAddress
 *         - shippingMethod
 *       properties:
 *         shippingAddress:
 *           type: string
 *           description: Shipping address for the order
 *           example: 123 Main St, City, Country
 *         shippingMethod:
 *           type: string
 *           enum: [STANDARD, EXPRESS]
 *           description: Shipping method for the order
 *           example: STANDARD
 *         promotionId:
 *           type: string
 *           description: ID of the promotion to apply
 *           example: 507f1f77bcf86cd799439021
 *         note:
 *           type: string
 *           description: Additional notes for the order
 *           example: Deliver after 5 PM
 */

/**
 * @swagger
 * /api/order/place:
 *   post:
 *     summary: Place a new order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
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
 *                   example: Đặt hàng thành công
 *                 orderId:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439019
 */

/**
 * @swagger
 * /api/order/prepare-vnpay:
 *   post:
 *     summary: Prepare an order for VNPay payment
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VnpayOrderInput'
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
 *                   example: Tạo đơn thành công. Tiếp tục thanh toán VNPay.
 *                 orderId:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439019
 *                 amount:
 *                   type: number
 *                   example: 120000
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
