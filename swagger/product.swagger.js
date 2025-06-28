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
 *           example: Unisex
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
 *               sex:
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
 *               stock:
 *                 type: number
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
 *       - in: query
 *         name: searchByTag
 *         schema:
 *           oneOf:
 *             - type: string
 *             - type: array
 *               items:
 *                 type: string
 *         description: Single tag or array of tags to search by
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
 *               sex:
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
 *               stock:
 *                 type: number
 *               imgUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 5 images
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
 */

/**
 * @swagger
 * /api/products/find-by-image:
 *   post:
 *     summary: Find products by analyzing uploaded image
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
 *                 description: Upload 1 image for analysis
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
 */
