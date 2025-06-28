/**
 * @swagger
 * tags:
 *   - name: ProductType
 *     description: ProductType management APIs (create, read, update, delete product types)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductType:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - categoryID
 *         - subCategoryID
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product type
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           description: The name of the product type
 *           example: Gaming Laptops
 *         description:
 *           type: string
 *           description: The description of the product type
 *           example: High-performance laptops designed for gaming
 *         categoryID:
 *           type: string
 *           description: Reference to the category ID
 *           example: 507f1f77bcf86cd799439012
 *         subCategoryID:
 *           type: string
 *           description: Reference to the subcategory ID
 *           example: 507f1f77bcf86cd799439013
 *         category:
 *           type: object
 *           description: Populated category information
 *           properties:
 *             id:
 *               type: string
 *               example: 507f1f77bcf86cd799439012
 *             name:
 *               type: string
 *               example: Electronics
 *         subCategory:
 *           type: object
 *           description: Populated subcategory information
 *           properties:
 *             id:
 *               type: string
 *               example: 507f1f77bcf86cd799439013
 *             name:
 *               type: string
 *               example: Laptops
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the product type was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the product type was last updated
 *
 *     ProductTypeInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - categoryID
 *         - subCategoryID
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product type
 *           example: Gaming Laptops
 *         description:
 *           type: string
 *           description: The description of the product type
 *           example: High-performance laptops designed for gaming
 *         categoryID:
 *           type: string
 *           description: Reference to the category ID
 *           example: 507f1f77bcf86cd799439012
 *         subCategoryID:
 *           type: string
 *           description: Reference to the subcategory ID
 *           example: 507f1f77bcf86cd799439013
 *
 *     ProductTypeUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product type
 *           example: Gaming Laptops
 *         description:
 *           type: string
 *           description: The description of the product type
 *           example: High-performance laptops designed for gaming
 *         categoryID:
 *           type: string
 *           description: Reference to the category ID
 *           example: 507f1f77bcf86cd799439012
 *         subCategoryID:
 *           type: string
 *           description: Reference to the subcategory ID
 *           example: 507f1f77bcf86cd799439013
 */

/**
 * @swagger
 * /api/product-types:
 *   post:
 *     summary: Create a new product type
 *     tags: [ProductType]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductTypeInput'
 *     responses:
 *       201:
 *         description: ProductType created successfully
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
 *                   example: ProductType created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       example: Gaming Laptops
 *                     description:
 *                       type: string
 *                       example: High-performance laptops designed for gaming
 *                     categoryID:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439012
 *                     subCategoryID:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439013
 */

/**
 * @swagger
 * /api/product-types:
 *   get:
 *     summary: Get all product types
 *     tags: [ProductType]
 *     responses:
 *       200:
 *         description: Product types fetched successfully
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
 *                   example: Fetched product types successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       name:
 *                         type: string
 *                         example: Gaming Laptops
 *                       description:
 *                         type: string
 *                         example: High-performance laptops designed for gaming
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 507f1f77bcf86cd799439012
 *                           name:
 *                             type: string
 *                             example: Electronics
 *                       subCategory:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 507f1f77bcf86cd799439013
 *                           name:
 *                             type: string
 *                             example: Laptops
 */

/**
 * @swagger
 * /api/product-types/{id}:
 *   get:
 *     summary: Get product type by ID
 *     tags: [ProductType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ProductType ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Product type fetched successfully
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
 *                   example: Fetched product type successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       example: Gaming Laptops
 *                     description:
 *                       type: string
 *                       example: High-performance laptops designed for gaming
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439012
 *                         name:
 *                           type: string
 *                           example: Electronics
 *                     subCategory:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439013
 *                         name:
 *                           type: string
 *                           example: Laptops
 */

/**
 * @swagger
 * /api/product-types/{id}:
 *   put:
 *     summary: Update product type by ID
 *     tags: [ProductType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ProductType ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductTypeUpdateInput'
 *     responses:
 *       200:
 *         description: ProductType updated successfully
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
 *                   example: ProductType updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       example: Gaming Laptops
 *                     description:
 *                       type: string
 *                       example: High-performance laptops designed for gaming
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439012
 *                         name:
 *                           type: string
 *                           example: Electronics
 *                     subCategory:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439013
 *                         name:
 *                           type: string
 *                           example: Laptops
 */

/**
 * @swagger
 * /api/product-types/{id}:
 *   delete:
 *     summary: Delete product type by ID
 *     tags: [ProductType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ProductType ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: ProductType deleted successfully
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
 *                   example: ProductType deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       example: Gaming Laptops
 *                     description:
 *                       type: string
 *                       example: High-performance laptops designed for gaming
 */
