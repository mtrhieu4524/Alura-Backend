/**
 * @swagger
 * tags:
 *   - name: Profile
 *     description: User profile management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the user
 *           example: John Doe
 *         email:
 *           type: string
 *           description: Email address of the user
 *           example: john.doe@example.com
 *         phone:
 *           type: string
 *           description: Phone number of the user
 *           example: +1234567890
 *         address:
 *           type: string
 *           description: Physical address of the user
 *           example: 123 Main St, City, Country
 *
 *     UserProfileInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the user
 *           example: John Doe
 *         email:
 *           type: string
 *           description: Email address of the user
 *           example: john.doe@example.com
 *         phone:
 *           type: string
 *           description: Phone number of the user
 *           example: +1234567890
 *         address:
 *           type: string
 *           description: Physical address of the user
 *           example: 123 Main St, City, Country
 */

/**
 * @swagger
 * /api/profile/{userId}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 507f1f77bcf86cd799439020
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/UserProfile'
 */

/**
 * @swagger
 * /api/profile/{userId}:
 *   put:
 *     summary: Update user profile by ID
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 507f1f77bcf86cd799439020
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfileInput'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/UserProfile'
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
