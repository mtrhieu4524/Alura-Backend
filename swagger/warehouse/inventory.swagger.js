/**
 * @swagger
 * tags:
 *   - name: Inventory
 *     description: Inventory management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryByProduct:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful
 *           example: true
 *         productId:
 *           type: string
 *           description: The ID of the product
 *           example: 507f1f77bcf86cd799439012
 *         totalRemaining:
 *           type: number
 *           description: Total remaining quantity across all batch stocks
 *           example: 500
 *         batchCount:
 *           type: number
 *           description: Number of batches with remaining stock
 *           example: 5
 *         data:
 *           type: array
 *           description: List of batch stock details
 *           items:
 *             type: object
 *             properties:
 *               batchStockId:
 *                 type: string
 *                 description: The ID of the batch stock
 *                 example: 507f1f77bcf86cd799439017
 *               batchId:
 *                 type: string
 *                 description: The ID of the batch
 *                 example: 507f1f77bcf86cd799439011
 *               batchCode:
 *                 type: string
 *                 description: Unique batch code
 *                 example: BATCH001
 *               remaining:
 *                 type: number
 *                 description: Remaining quantity in the batch stock
 *                 example: 100
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 description: Expiry date of the batch
 *                 example: 2025-12-31
 *               warehouse:
 *                 type: object
 *                 description: Warehouse information
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 507f1f77bcf86cd799439014
 *                   name:
 *                     type: string
 *                     example: Warehouse Central
 *               distributor:
 *                 type: object
 *                 description: Distributor information
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 507f1f77bcf86cd799439013
 *                   name:
 *                     type: string
 *                     example: Distributor ABC
 */

/**
 * @swagger
 * /api/inventory/product/{productId}:
 *   get:
 *     summary: Get inventory by product ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Inventory retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryByProduct'
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
