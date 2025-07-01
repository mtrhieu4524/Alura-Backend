/**
 * @swagger
 * tags:
 *   - name: Brand
 *     description: Brand management APIs (create, read, update, delete brands)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       required:
 *         - brandName
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the brand
 *           example: 507f1f77bcf86cd799439011
 *         brandName:
 *           type: string
 *           description: The name of the brand
 *           example: Nike
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the brand was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the brand was last updated
 *
 *     BrandInput:
 *       type: object
 *       required:
 *         - brandName
 *       properties:
 *         brandName:
 *           type: string
 *           description: The name of the brand
 *           example: Nike
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: object
 *           description: Response data
 */

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brand]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BrandInput'
 *     responses:
 *       201:
 *         description: Brand created successfully
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
 *                   example: Brand created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     brandName:
 *                       type: string
 *                       example: Nike
 */

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Brand]
 *     responses:
 *       200:
 *         description: Brands fetched successfully
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
 *                   example: Fetched brands successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       brandName:
 *                         type: string
 *                         example: Nike
 */

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Get brand by ID
 *     tags: [Brand]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Brand fetched successfully
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
 *                   example: Fetched brand successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     brandName:
 *                       type: string
 *                       example: Nike
 */

/**
 * @swagger
 * /api/brands/{id}:
 *   put:
 *     summary: Update brand by ID
 *     tags: [Brand]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BrandInput'
 *     responses:
 *       200:
 *         description: Brand updated successfully
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
 *                   example: Brand updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     brandName:
 *                       type: string
 *                       example: Nike
 */

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Delete brand by ID
 *     tags: [Brand]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Brand deleted successfully
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
 *                   example: Brand deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     brandName:
 *                       type: string
 *                       example: Nike
 * */
