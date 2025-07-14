/**
 * @swagger
 * tags:
 *   - name: BatchStock
 *     description: Batch stock management APIs (create, read, update, delete batch stocks)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BatchStock:
 *       type: object
 *       required:
 *         - productId
 *         - batchId
 *         - warehouseId
 *         - quantity
 *         - remaining
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the batch stock
 *           example: 507f1f77bcf86cd799439017
 *         productId:
 *           type: object
 *           description: Product information
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439012
 *             name:
 *               type: string
 *               example: Nike Air Max
 *         batchId:
 *           type: object
 *           description: Batch information
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439011
 *             batchCode:
 *               type: string
 *               example: BATCH001
 *             status:
 *               type: string
 *               example: active
 *             expiryDate:
 *               type: string
 *               format: date
 *               example: 2025-12-31
 *         warehouseId:
 *           type: object
 *           description: Warehouse information
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439014
 *             name:
 *               type: string
 *               example: Warehouse Central
 *         quantity:
 *           type: number
 *           description: Initial quantity of the batch stock
 *           example: 100
 *         remaining:
 *           type: number
 *           description: Remaining quantity of the batch stock
 *           example: 95
 *         isOrigin:
 *           type: boolean
 *           description: Indicates if this is the origin stock
 *           example: false
 *         exportedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the batch stock was exported
 *           example: 2025-06-29T12:00:00Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the batch stock was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the batch stock was last updated
 *
 *     BatchStockInput:
 *       type: object
 *       required:
 *         - batchId
 *         - productId
 *         - warehouseId
 *         - quantity
 *       properties:
 *         batchId:
 *           type: string
 *           description: Batch ID reference
 *           example: 507f1f77bcf86cd799439011
 *         productId:
 *           type: string
 *           description: Product ID reference
 *           example: 507f1f77bcf86cd799439012
 *         warehouseId:
 *           type: string
 *           description: Warehouse ID reference
 *           example: 507f1f77bcf86cd799439014
 *         quantity:
 *           type: number
 *           minimum: 1
 *           description: Quantity to be exported
 *           example: 100
 *         note:
 *           type: string
 *           description: Additional notes for the batch stock
 *           example: Exported to store for sale
 *         handledBy:
 *           type: string
 *           description: User ID who handled the operation
 *           example: 507f1f77bcf86cd799439020
 *
 *     BatchStockUpdateInput:
 *       type: object
 *       properties:
 *         quantity:
 *           type: number
 *           minimum: 1
 *           description: Updated quantity of the batch stock
 *           example: 100
 *         remaining:
 *           type: number
 *           minimum: 0
 *           description: Updated remaining quantity of the batch stock
 *           example: 95
 */

/**
 * @swagger
 * /api/batch-stock:
 *   get:
 *     summary: Get all batch stocks (Admin only)
 *     tags: [BatchStock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: string
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *       - in: query
 *         name: batchId
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: "BATCH001"
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BatchStock'
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/batch-stock/{batchStockId}:
 *   get:
 *     summary: Get batch stock by ID (Admin only)
 *     tags: [BatchStock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchStockId
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch stock ID
 *         example: 507f1f77bcf86cd799439017
 *     responses:
 *       200:
 *         description: Batch stock retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BatchStock'
 *       404:
 *         description: Batch stock not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy batchStock.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi khi lấy batchStock
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /api/batch-stock:
 *   post:
 *     summary: Create a new batch stock (Admin only)
 *     tags: [BatchStock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - batchId
 *               - productId
 *               - warehouseId
 *               - quantity
 *             properties:
 *               batchId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               productId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *               warehouseId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439014"
 *               quantity:
 *                 type: number
 *                 example: 100
 *               note:
 *                 type: string
 *                 example: "Xuất từ kho để bán tại cửa hàng"
 *               handledBy:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439020"
 *     responses:
 *       201:
 *         description: Batch stock created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BatchStock'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không đủ tồn kho hoặc sản phẩm không khớp với batch
 *       404:
 *         description: Batch or origin stock not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy batch hoặc tồn kho gốc
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tạo batchStock thất bại
 *                 error:
 *                   type: string
 */


