/**
 * @swagger
 * tags:
 *   - name: InventoryMovement
 *     description: Inventory movement management APIs (create, read, delete inventory movements)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryMovement:
 *       type: object
 *       required:
 *         - batchId
 *         - warehouseId
 *         - movementType
 *         - batchQuantity
 *         - handledBy
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the inventory movement
 *           example: 507f1f77bcf86cd799439018
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
 *         movementType:
 *           type: string
 *           enum: [import, export, adjustment]
 *           description: Type of inventory movement
 *           example: export
 *         batchQuantity:
 *           type: number
 *           description: Quantity of the batch involved in the movement
 *           example: 100
 *         actionDate:
 *           type: string
 *           format: date-time
 *           description: Date and time of the movement
 *           example: 2025-06-29T12:00:00Z
 *         handledBy:
 *           type: object
 *           description: User who performed the movement
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439020
 *             name:
 *               type: string
 *               example: John Doe
 *             email:
 *               type: string
 *               example: john.doe@example.com
 *         note:
 *           type: string
 *           description: Additional notes for the movement
 *           example: Exported to store for sale
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the movement was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the movement was last updated
 *
 *     InventoryMovementInput:
 *       type: object
 *       required:
 *         - batchId
 *         - warehouseId
 *         - movementType
 *         - batchQuantity
 *         - handledBy
 *       properties:
 *         batchId:
 *           type: string
 *           description: Batch ID reference
 *           example: 507f1f77bcf86cd799439011
 *         warehouseId:
 *           type: string
 *           description: Warehouse ID reference
 *           example: 507f1f77bcf86cd799439014
 *         movementType:
 *           type: string
 *           enum: [import, export, adjustment]
 *           description: Type of inventory movement
 *           example: export
 *         batchQuantity:
 *           type: number
 *           minimum: 1
 *           description: Quantity of the batch involved in the movement
 *           example: 100
 *         actionDate:
 *           type: string
 *           format: date-time
 *           description: Date and time of the movement
 *           example: 2025-06-29T12:00:00Z
 *         handledBy:
 *           type: string
 *           description: User ID who performed the movement
 *           example: 507f1f77bcf86cd799439020
 *         note:
 *           type: string
 *           description: Additional notes for the movement
 *           example: Exported to store for sale
 */

/**
 * @swagger
 * /api/inventory-movement:
 *   post:
 *     summary: Create a new inventory movement
 *     tags: [InventoryMovement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryMovementInput'
 *     responses:
 *       201:
 *         description: Inventory movement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/InventoryMovement'
 */

/**
 * @swagger
 * /api/inventory-movement:
 *   get:
 *     summary: Get all inventory movements
 *     tags: [InventoryMovement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: string
 *         description: Filter by warehouse ID
 *         example: 507f1f77bcf86cd799439014
 *       - in: query
 *         name: movementType
 *         schema:
 *           type: string
 *           enum: [import, export, adjustment]
 *         description: Filter by movement type
 *         example: export
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter movements from this date
 *         example: 2025-06-01
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter movements up to this date
 *         example: 2025-06-30
 *     responses:
 *       200:
 *         description: Inventory movements retrieved successfully
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
 *                     $ref: '#/components/schemas/InventoryMovement'
 */

/**
 * @swagger
 * /api/inventory-movement/{movementId}:
 *   get:
 *     summary: Get inventory movement by ID
 *     tags: [InventoryMovement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movementId
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory movement ID
 *         example: 507f1f77bcf86cd799439018
 *     responses:
 *       200:
 *         description: Inventory movement retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/InventoryMovement'
 */

/**
 * @swagger
 * /api/inventory-movement/{movementId}:
 *   delete:
 *     summary: Delete inventory movement
 *     tags: [InventoryMovement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movementId
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory movement ID
 *         example: 507f1f77bcf86cd799439018
 *     responses:
 *       200:
 *         description: Inventory movement deleted successfully
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
 *                   example: Đã xoá movement
 *                 data:
 *                   $ref: '#/components/schemas/InventoryMovement'
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
