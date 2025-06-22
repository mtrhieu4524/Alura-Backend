/**
 * @swagger
 * tags:
 *   - name: Product
 *     description: API for managing products
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60f71a61a5a4c146a8a7b1ce
 *         name:
 *           type: string
 *           example: Gentle Facial Cleanser
 *         price:
 *           type: number
 *           example: 120000
 *         brand:
 *           type: string
 *           example: Cetaphil
 *         skinType:
 *           type: string
 *           example: Sensitive
 *         skinColor:
 *           type: string
 *           example: Light
 *         volume:
 *           type: string
 *           example: 200ml
 *         instructions:
 *           type: string
 *           example: Apply to wet skin, massage gently, rinse off
 *         preservation:
 *           type: string
 *           example: Store in cool, dry place
 *         keyIngredients:
 *           type: string
 *           example: Aloe Vera, Chamomile
 *         detailInfredients:
 *           type: string
 *           example: Water, Glycerin, Sodium Laureth Sulfate
 *         purpose:
 *           type: string
 *           example: Cleansing and hydrating
 *         categoryId:
 *           type: string
 *           example: 60f71a61a5a4c146a8a7b1cc
 *         productTypeId:
 *           type: string
 *           example: 60f71a61a5a4c146a8a7b1cd
 *         isPublic:
 *           type: boolean
 *           example: true
 *         imgUrls:
 *           type: array
 *           items:
 *             type: string
 *             example: https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/products/product-1234567890.jpg
 *         public_ids:
 *           type: array
 *           items:
 *             type: string
 *             example: products/product-1234567890
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-06-22T13:33:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-06-22T13:33:00.000Z
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *               - productTypeId
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               brand:
 *                 type: string
 *               skinType:
 *                 type: string
 *               skinColor:
 *                 type: string
 *               volume:
 *                 type: string
 *               instructions:
 *                 type: string
 *               preservation:
 *                 type: string
 *               keyIngredients:
 *                 type: string
 *               detailInfredients:
 *                 type: string
 *               purpose:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               productTypeId:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               imgUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: No image uploaded or invalid data
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get list of products
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: pageIndex
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: searchByName
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               brand:
 *                 type: string
 *               skinType:
 *                 type: string
 *               skinColor:
 *                 type: string
 *               volume:
 *                 type: string
 *               instructions:
 *                 type: string
 *               preservation:
 *                 type: string
 *               keyIngredients:
 *                 type: string
 *               detailInfredients:
 *                 type: string
 *               purpose:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               productTypeId:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               imgUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Update failed due to invalid or missing data
 *       500:
 *         description: Server error
 */
