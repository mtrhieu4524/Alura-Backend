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
 *     summary: Get dashboard summary (Admin only)
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
 * */