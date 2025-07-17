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
 *         example: 7
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 2020
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
 *                 earnings:
 *                   type: number
 *                   description: Total earnings from paid orders this month
 *                   example: 15000000
 *                 growth:
 *                   type: number
 *                   description: Order growth percentage compared to last month
 *                   example: 12.5
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /api/dashboard/top-products:
 *   get:
 *     summary: Get top selling products (ADMIN)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
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
 *                     description: Number of units sold
 *                     example: 50
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */