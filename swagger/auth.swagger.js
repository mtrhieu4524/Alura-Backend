/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication APIs (register, login, refresh token, change password)
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

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *                 description: Full name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *                 description: Valid email address (will be converted to lowercase)
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: secret123456
 *                 description: Password must be at least 8 characters long
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     missing_fields: "Name, email and password are required"
 *                     password_too_short: "Password must be at least 8 characters long"
 *                     invalid_role: "Invalid role. Must be ADMIN, USER, or STAFF"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Name is required", "Invalid email format"]
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email already registered
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @swagger
 * /api/auth/register-staff:
 *   post:
 *     summary: Register a new staff account (ADMIN only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Smith
 *                 description: Full name of the staff member
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane.smith@company.com
 *                 description: Valid email address for the staff member
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: staffPassword123
 *                 description: Password must be at least 8 characters long
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *                 description: Phone number (optional)
 *               address:
 *                 type: string
 *                 example: "123 Main St, City, Country"
 *                 description: Address (optional)
 *     responses:
 *       201:
 *         description: Staff account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Staff account created successfully
 *                 staff:
 *                   type: object
 *                   properties:
 *                     accountId:
 *                       type: string
 *                       example: 60f71a61a5a4c146a8a7b1ce
 *                     name:
 *                       type: string
 *                       example: Jane Smith
 *                     email:
 *                       type: string
 *                       example: jane.smith@company.com
 *                     phone:
 *                       type: string
 *                       example: "0123456789"
 *                     address:
 *                       type: string
 *                       example: "123 Main St, City, Country"
 *                     role:
 *                       type: string
 *                       example: STAFF
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-07-08T10:30:00.000Z
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     missing_fields: "Name, email and password are required"
 *                     password_too_short: "Password must be at least 8 characters long"
 *                     invalid_email: "Invalid email format"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Name is required", "Invalid email format"]
 *       401:
 *         description: Unauthorized - Token required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access token required"
 *       403:
 *         description: Access denied - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Access denied. Insufficient permissions."
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email already registered
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *                 description: Registered email address
 *               password:
 *                 type: string
 *                 example: secret123456
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accountId:
 *                   type: string
 *                   example: 60f71a61a5a4c146a8a7b1ce
 *                   description: User's unique ID
 *                 gmail:
 *                   type: string
 *                   format: email
 *                   example: johndoe@example.com
 *                   description: User's email address
 *                 role:
 *                   type: string
 *                   enum: [USER, ADMIN, STAFF]
 *                   example: USER
 *                   description: User's role in the system
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   description: JWT access token (expires in 15 minutes)
 *                 refreshToken:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                   description: Refresh token (expires in 7 days)
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email and password are required
 *       401:
 *         description: Invalid credentials or inactive user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @swagger
 * /api/auth/refresh-token/{refreshToken}:
 *   post:
 *     summary: Refresh JWT access token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Valid refresh token (UUID format)
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accountId:
 *                   type: string
 *                   example: 60f71a61a5a4c146a8a7b1ce
 *                   description: User's unique ID
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                   description: User's full name
 *                 role:
 *                   type: string
 *                   enum: [USER, ADMIN, STAFF]
 *                   example: USER
 *                   description: User's role in the system
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   description: New JWT access token (expires in 15 minutes)
 *                 refreshToken:
 *                   type: string
 *                   example: 770e8400-e29b-41d4-a716-446655440001
 *                   description: New refresh token (expires in 7 days)
 *       400:
 *         description: Missing refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Refresh token is required in URL
 *       401:
 *         description: Invalid or expired refresh token, or inactive user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     invalid_token: "Invalid or expired refresh token"
 *                     user_not_found: "User not found or inactive"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change user password (Authenticated users only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldPassword123
 *                 description: User's current password for verification
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 example: newPassword456
 *                 description: New password (must be at least 8 characters)
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đổi mật khẩu thành công
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
 *                     missing_fields: "Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới"
 *                     password_too_short: "Mật khẩu mới phải có ít nhất 8 ký tự"
 *       401:
 *         description: Unauthorized or wrong current password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     unauthorized: "Unauthorized. User not authenticated."
 *                     wrong_password: "Mật khẩu hiện tại không đúng"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy người dùng
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi máy chủ. Vui lòng thử lại sau
 */
