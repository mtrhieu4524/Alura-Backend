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
 *           example: "507f1f77bcf86cd799439019"
 *         amount:
 *           type: number
 *           description: Total amount to be paid (in VND)
 *           example: 120000
 *         bankCode:
 *           type: string
 *           description: Optional bank code for VNPay payment
 *           example: "NCB"
 *
 *     PaymentUrlResponse:
 *       type: object
 *       properties:
 *         paymentUrl:
 *           type: string
 *           description: URL for VNPay payment redirection
 *           example: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=12000000&vnp_Command=pay&vnp_CreateDate=20250703123000&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh-toan-don-hang-507f1f77bcf86cd799439019&vnp_OrderType=other&vnp_ReturnUrl=http://localhost:4000/api/payment/vnpay/return&vnp_TmnCode=EKF61SQS&vnp_TxnRef=507f1f77bcf86cd799439019&vnp_Version=2.1.0&vnp_SecureHash=abc123def456"
 *
 *     PaymentSuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Payment SUCCESSFUL"
 *         orderId:
 *           type: string
 *           example: "507f1f77bcf86cd799439019"
 *
 *     PaymentFailedResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Payment FAILED"
 *         orderId:
 *           type: string
 *           example: "507f1f77bcf86cd799439019"
 */

/**
 * @swagger
 * /api/payment/vnpay/createPaymentUrl:
 *   post:
 *     summary: Create a VNPay payment URL
 *     description: Generate a payment URL for VNPay payment gateway with order information
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentUrlInput'
 *           example:
 *             orderId: "507f1f77bcf86cd799439019"
 *             amount: 120000
 *             bankCode: "NCB"
 *     responses:
 *       200:
 *         description: Payment URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentUrlResponse'
 *             example:
 *               paymentUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=12000000&vnp_Command=pay..."
 */

/**
 * @swagger
 * /api/payment/vnpay/return:
 *   get:
 *     summary: Handle VNPay payment return callback
 *     description: Process the payment result from VNPay and update order status accordingly. Updates product stock, removes cart items on success, or marks order as cancelled on failure.
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: vnp_TxnRef
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID (Transaction Reference)
 *         example: "507f1f77bcf86cd799439019"
 *       - in: query
 *         name: vnp_ResponseCode
 *         required: true
 *         schema:
 *           type: string
 *         description: VNPay response code (00 = success, others = failed)
 *         example: "00"
 *       - in: query
 *         name: vnp_TransactionNo
 *         required: true
 *         schema:
 *           type: string
 *         description: VNPay transaction number
 *         example: "15054401"
 *       - in: query
 *         name: vnp_Amount
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment amount (in cents)
 *         example: "12000000"
 *       - in: query
 *         name: vnp_BankCode
 *         schema:
 *           type: string
 *         description: Bank code used for payment
 *         example: "NCB"
 *       - in: query
 *         name: vnp_BankTranNo
 *         schema:
 *           type: string
 *         description: Bank transaction number
 *         example: "VNP15054401"
 *       - in: query
 *         name: vnp_CardType
 *         schema:
 *           type: string
 *         description: Card type used for payment
 *         example: "ATM"
 *       - in: query
 *         name: vnp_OrderInfo
 *         schema:
 *           type: string
 *         description: Order information
 *         example: "Thanh-toan-don-hang-507f1f77bcf86cd799439019"
 *       - in: query
 *         name: vnp_PayDate
 *         schema:
 *           type: string
 *         description: Payment date
 *         example: "20250703205640"
 *       - in: query
 *         name: vnp_TmnCode
 *         schema:
 *           type: string
 *         description: Terminal code
 *         example: "EKF61SQS"
 *       - in: query
 *         name: vnp_TransactionStatus
 *         schema:
 *           type: string
 *         description: Transaction status
 *         example: "00"
 *       - in: query
 *         name: vnp_SecureHash
 *         required: true
 *         schema:
 *           type: string
 *         description: Secure hash for validating the response
 *         example: "2d0498d00d9a26f9a59c526ea92ded429c6eadaf58d5fca991cc1e7a55dfafce08f8bfa63174bd96f03a04d897041eb71bcf611bd3ed39b465b03e0dc10e5cca"
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/PaymentSuccessResponse'
 *                 - $ref: '#/components/schemas/PaymentFailedResponse'
 *             examples:
 *               success:
 *                 summary: Payment successful
 *                 value:
 *                   message: "Payment SUCCESSFUL"
 *                   orderId: "507f1f77bcf86cd799439019"
 *               failed:
 *                 summary: Payment failed
 *                 value:
 *                   message: "Payment FAILED"
 *                   orderId: "507f1f77bcf86cd799439019"
 *       400:
 *         description: Invalid VNPay signature or authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xác thực VNPay thất bại"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy đơn hàng"
 *       500:
 *         description: Server error during payment processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi cập nhật đơn hàng sau thanh toán"
 */
