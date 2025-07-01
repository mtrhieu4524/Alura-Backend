/**
 * @swagger
 * tags:
 *   - name: Distributor
 *     description: Distributor management APIs (create, read, update, delete distributors)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Distributor:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - email
 *         - address
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the distributor
 *           example: 507f1f77bcf86cd799439013
 *         name:
 *           type: string
 *           description: Name of the distributor
 *           example: Distributor ABC
 *         phone:
 *           type: string
 *           description: Phone number of the distributor
 *           example: +1234567890
 *         email:
 *           type: string
 *           description: Email address of the distributor
 *           example: contact@distributorabc.com
 *         address:
 *           type: string
 *           description: Physical address of the distributor
 *           example: 123 Main St, City, Country
 *
 *     DistributorInput:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - email
 *         - address
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the distributor
 *           example: Distributor ABC
 *         phone:
 *           type: string
 *           description: Phone number of the distributor
 *           example: +1234567890
 *         email:
 *           type: string
 *           description: Email address of the distributor
 *           example: contact@distributorabc.com
 *         address:
 *           type: string
 *           description: Physical address of the distributor
 *           example: 123 Main St, City, Country
 */

/**
 * @swagger
 * /api/distributor:
 *   post:
 *     summary: Create a new distributor
 *     tags: [Distributor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DistributorInput'
 *     responses:
 *       201:
 *         description: Distributor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Distributor'
 */

/**
 * @swagger
 * /api/distributor:
 *   get:
 *     summary: Get all distributors
 *     tags: [Distributor]
 *     responses:
 *       200:
 *         description: Distributors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Distributor'
 */

/**
 * @swagger
 * /api/distributor/{distributorId}:
 *   get:
 *     summary: Get distributor by ID
 *     tags: [Distributor]
 *     parameters:
 *       - in: path
 *         name: distributorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Distributor ID
 *         example: 507f1f77bcf86cd799439013
 *     responses:
 *       200:
 *         description: Distributor retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Distributor'
 */

/**
 * @swagger
 * /api/distributor/{distributorId}:
 *   put:
 *     summary: Update distributor by ID
 *     tags: [Distributor]
 *     parameters:
 *       - in: path
 *         name: distributorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Distributor ID
 *         example: 507f1f77bcf86cd799439013
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DistributorInput'
 *     responses:
 *       200:
 *         description: Distributor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Distributor'
 */

/**
 * @swagger
 * /api/distributor/{distributorId}:
 *   delete:
 *     summary: Delete distributor
 *     tags: [Distributor]
 *     parameters:
 *       - in: path
 *         name: distributorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Distributor ID
 *         example: 507f1f77bcf86cd799439013
 *     responses:
 *       200:
 *         description: Distributor deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đã xoá distributor
 *                 distributor:
 *                   $ref: '#/components/schemas/Distributor'
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
