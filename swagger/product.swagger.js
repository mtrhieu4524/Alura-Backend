/**
 * @swagger
 * tags:
 *   - name: Product
 *     description: API for managing products
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             brandName:
 *               type: string
 *           example:
 *             _id: 60f71a61a5a4c146a8a7b1cf
 *             brandName: Cetaphil
 *         sex:
 *           type: string
 *           enum: [male, female, unisex]
 *           example: unisex
 *         skinType:
 *           type: array
 *           items:
 *             type: string
 *             enum: [dry, oily, combination, sensitive, normal, all]
 *           example: [sensitive, combination]
 *         skinColor:
 *           type: string
 *           enum: [warm, cool, neutral, dark, light]
 *           example: light
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
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *           example:
 *             _id: 60f71a61a5a4c146a8a7b1cc
 *             name: Skincare
 *         productTypeId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             subCategory:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *           example:
 *             _id: 60f71a61a5a4c146a8a7b1cd
 *             name: Cleanser
 *             subCategory:
 *               _id: 60f71a61a5a4c146a8a7b1ce
 *               name: Face Wash
 *         stock:
 *           type: number
 *           example: 100
 *         sold:
 *           type: number
 *           example: 25
 *         isPublic:
 *           type: boolean
 *           example: true
 *         imgUrls:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/products/product-1234567890.jpg
 *         public_ids:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - products/product-1234567890
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - cleanser
 *             - gentle
 *             - sensitive-skin
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
 *     summary: Create a new product (ADMIN)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - brand
 *               - sex
 *               - skinType
 *               - skinColor
 *               - volume
 *               - instructions
 *               - preservation
 *               - keyIngredients
 *               - detailInfredients
 *               - purpose
 *               - categoryId
 *               - productTypeId
 *               - imgUrls
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               brand:
 *                 type: string
 *                 description: Brand ObjectId
 *               sex:
 *                 type: string
 *                 enum: [male, female, unisex]
 *               skinType:
 *                 type: string
 *                 description: Can be multiple values separated by comma
 *               skinColor:
 *                 type: string
 *                 enum: [warm, cool, neutral, dark, light]
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
 *                 description: Category ObjectId
 *               productTypeId:
 *                 type: string
 *                 description: ProductType ObjectId
 *               stock:
 *                 type: number
 *                 default: 0
 *               imgUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 5 images
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
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       error:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get list of products (PUBLIC)
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
 *         description: Search products by name
 *       - in: query
 *         name: sex
 *         schema:
 *           type: string
 *           enum: [male, female, unisex]
 *         description: Filter by target gender
 *       - in: query
 *         name: brand
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: Filter by brand IDs (multiple allowed)
 *       - in: query
 *         name: skinType
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [dry, oily, combination, sensitive, normal, all]
 *         style: form
 *         explode: true
 *         description: Filter by skin types (multiple allowed)
 *       - in: query
 *         name: skinColor
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [warm, cool, neutral, dark, light]
 *         style: form
 *         explode: true
 *         description: Filter by skin colors (multiple allowed)
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: Filter by category IDs (multiple allowed)
 *       - in: query
 *         name: productTypeId
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: Filter by product type IDs (multiple allowed)
 *     responses:
 *       200:
 *         description: Products fetched successfully
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
 *                   example: Products fetched successfully
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: number
 *                   example: 50
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/products/admin-and-staff:
 *   get:
 *     summary: Get all products for admin and staff (including disabled products)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
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
 *         description: Search products by name
 *       - in: query
 *         name: sex
 *         schema:
 *           type: string
 *           enum: [male, female, unisex]
 *       - in: query
 *         name: brand
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: Filter by brand IDs
 *       - in: query
 *         name: skinType
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [dry, oily, combination, sensitive, normal, all]
 *         style: form
 *         explode: true
 *       - in: query
 *         name: skinColor
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [warm, cool, neutral, dark, light]
 *         style: form
 *         explode: true
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *       - in: query
 *         name: productTypeId
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *       - in: query
 *         name: isPublic
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by public status
 *     responses:
 *       200:
 *         description: Products fetched successfully
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
 *                   example: Products fetched successfully (Admin)
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: number
 *                   example: 75
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *                     totalProducts:
 *                       type: number
 *                     pageSize:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID (PUBLIC)
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ObjectId
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product ID format
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update product by ID (ADMIN or STAFF)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ObjectId
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
 *               sex:
 *                 type: string
 *                 enum: [male, female, unisex]
 *               skinType:
 *                 type: string
 *               skinColor:
 *                 type: string
 *                 enum: [warm, cool, neutral, dark, light]
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
 *               stock:
 *                 type: number
 *               imgUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 5 new images (will replace existing)
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
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete product by ID (ADMIN)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ObjectId
 *     responses:
 *       200:
 *         description: Product deleted successfully
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
 *                   example: Product deleted
 *       400:
 *         description: Product ID is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied - Admin only
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/products/find-by-image:
 *   post:
 *     summary: Find products by analyzing uploaded image (PUBLIC)
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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - imgUrls
 *             properties:
 *               imgUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload 1 image for analysis (JPEG/PNG only)
 *                 maxItems: 1
 *     responses:
 *       200:
 *         description: Products found based on image analysis
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
 *                   example: Products found based on image
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: [cleanser, gentle, face-wash]
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pageIndex:
 *                   type: number
 *                   example: 1
 *                 pageSize:
 *                   type: number
 *                   example: 10
 *                 total:
 *                   type: number
 *                   example: 25
 *       400:
 *         description: No image uploaded or unsupported format
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/products/disable/{id}:
 *   put:
 *     summary: Disable product by ID (ADMIN or STAFF)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ObjectId
 *     responses:
 *       200:
 *         description: Product disabled successfully
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
 *                   example: Product disabled successfully
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Product ID is required or already disabled
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/products/enable/{id}:
 *   put:
 *     summary: Enable product by ID (ADMIN or STAFF)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ObjectId
 *     responses:
 *       200:
 *         description: Product enabled successfully
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
 *                   example: Product enabled successfully
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Product ID is required or already enabled
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
