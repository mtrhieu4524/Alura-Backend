/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Dashboard analytics APIs
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary (ADMIN)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month to get statistics for (defaults to current month)
 *         example: 7
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 2020
 *         description: Year to get statistics for (defaults to current year)
 *         example: 2025
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customers:
 *                   type: integer
 *                   description: Total number of customers who have made orders
 *                   example: 150
 *                 orders:
 *                   type: integer
 *                   description: Number of successful orders this month
 *                   example: 45
 *                 revenue:
 *                   type: number
 *                   description: Total revenue from paid orders this month
 *                   example: 15000000
 *                 totalAccounts:
 *                   type: integer
 *                   description: Total number of active accounts
 *                   example: 200
 *                 totalProducts:
 *                   type: integer
 *                   description: Total number of public products
 *                   example: 100
 *                 totalBatches:
 *                   type: integer
 *                   description: Total number of active batches
 *                   example: 30
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/dashboard/top-products:
 *   get:
 *     summary: Get top selling products (ADMIN)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: 
 *         example: 7
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 2020
 *         description: 
 *         example: 2023
 *     responses:
 *       200:
 *         description: Top products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                     description: Product ID
 *                     example: "64c8f5b1e2c42c1234567890"
 *                   name:
 *                     type: string
 *                     description: Product name
 *                     example: "Product A"
 *                   price:
 *                     type: number
 *                     description: Product price
 *                     example: 199000
 *                   imgUrls:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Product image URLs
 *                     example: ["http://example.com/image1.jpg"]
 *                   sold:
 *                     type: number
 *                     description: Number of units sold in the specified period
 *                     example: 50
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/dashboard/products-sold-by-category:
 *   get:
 *     summary: Get products sold by category statistics (ADMIN)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: 
 *         example: 7
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 2020
 *         description:
 *         example: 2023
 *     responses:
 *       200:
 *         description: Category sales statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       categoryId:
 *                         type: string
 *                         description: Category ID
 *                         example: "64c8f5b1e2c42c1234567890"
 *                       categoryName:
 *                         type: string
 *                         description: Category name
 *                         example: "Electronics"
 *                       totalQuantitySold:
 *                         type: number
 *                         description: Total quantity sold in this category
 *                         example: 45
 *                       percentage:
 *                         type: number
 *                         description: Percentage of total sales
 *                         example: 25.5
 *                 totalQuantity:
 *                   type: number
 *                   description: Total quantity of all products sold
 *                   example: 180
 *                 period:
 *                   type: object
 *                   properties:
 *                     month:
 *                       type: integer
 *                       example: 7
 *                     year:
 *                       type: integer
 *                       example: 2023
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/dashboard/top-homepage-products:
 *   get:
 *     summary: Get top selling products for homepage
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top products for homepage retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                     description: Product ID
 *                     example: "64c8f5b1e2c42c1234567890"
 *                   name:
 *                     type: string
 *                     description: Product name
 *                     example: "Product A"
 *                   price:
 *                     type: number
 *                     description: Product price
 *                     example: 199000
 *                   imgUrls:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Product image URLs
 *                     example: ["http://example.com/image1.jpg"]
 *                   sold:
 *                     type: number
 *                     description: All-time units sold
 *                     example: 50
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *     ForbiddenError:
 *       description: Forbidden - Admin access required
 *     ServerError:
 *       description: Server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Server error
 */