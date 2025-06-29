/**
 * @swagger
 * tags:
 *   - name: Payment
 *     description: Payment management APIs (VNPay payment processing)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentUrlInput:
 *       type: object
 *       required:
 *         - orderId
 *         - amount
 *       properties:
 *         orderId:
 *           type: string
 *           description: ID of the order to be paid
 *           example: 507f1f77bcf86cd799439019
 *         amount:
 *           type: number
 *           description: Total amount to be paid
 *           example: 120000
 *         bankCode:
 *           type: string
 *           description: Optional bank code for VNPay payment
 *           example: VNPAYQR
 *
 *     PaymentUrlResponse:
 *       type: object
 *       properties:
 *         paymentUrl:
 *           type: string
 *           description: URL for VNPay payment redirection
 *           example: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=12000000&vnp_Command=pay&vnp_CreateDate=20250629123000&vnp_CurrCode=VND&vnp_IpAddr=::1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+507f1f77bcf86cd799439019&vnp_OrderType=other&vnp_ReturnUrl=http://localhost:4000/api/payment/vnpay/return&vnp_TmnCode=TESTTMNC&vnp_TxnRef=507f1f77bcf86cd799439019&vnp_Version=2.1.0&vnp_SecureHash=abc123
 */

/**
 * @swagger
 * /api/payment/vnpay/createPaymentUrl:
 *   post:
 *     summary: Create a VNPay payment URL
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentUrlInput'
 *     responses:
 *       200:
 *         description: Payment URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentUrlResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thiếu thông tin bắt buộc
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi khi tạo URL thanh toán
 */

/**
 * @swagger
 * /api/payment/vnpay/return:
 *   get:
 *     summary: Handle VNPay payment return
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: vnp_TxnRef
 *         schema:
 *           type: string
 *         description: Order ID (Transaction Reference)
 *         example: 507f1f77bcf86cd799439019
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *         description: VNPay response code
 *         example: 00
 *       - in: query
 *         name: vnp_TransactionNo
 *         schema:
 *           type: string
 *         description: VNPay transaction number
 *         example: 1234567
 *       - in: query
 *         name: vnp_SecureHash
 *         schema:
 *           type: string
 *         description: Secure hash for validating the response
 *         example: abc123
 *     responses:
 *       302:
 *         description: Redirect to frontend success or failure page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Redirect to http://frontend-url/checkout-success?orderId=507f1f77bcf86cd799439019
 *       400:
 *         description: Invalid VNPay signature
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Xác thực VNPay thất bại
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy đơn hàng
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi cập nhật đơn hàng sau thanh toán
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
