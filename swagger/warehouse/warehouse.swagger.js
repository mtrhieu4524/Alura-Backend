/**
 * @swagger
 * tags:
 *   - name: Warehouse
 *     description: Warehouse management APIs (create, read, update, delete warehouses)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Warehouse:
 *       type: object
 *       required:
 *         - name
 *         - adminId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the warehouse
 *           example: 507f1f77bcf86cd799439014
 *         name:
 *           type: string
 *           description: Name of the warehouse
 *           example: Warehouse Central
 *         adminId:
 *           type: string
 *           description: ID of the user managing the warehouse
 *           example: 507f1f77bcf86cd799439020
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the warehouse was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the warehouse was last updated
 *
 *     WarehouseInput:
 *       type: object
 *       required:
 *         - name
 *         - adminId
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the warehouse
 *           example: Warehouse Central
 *         adminId:
 *           type: string
 *           description: ID of the user managing the warehouse
 *           example: 507f1f77bcf86cd799439020
 *
 *     WarehouseDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/Warehouse'
 *         - type: object
 *           properties:
 *             totalBatch:
 *               type: number
 *               description: Total number of batches in the warehouse
 *               example: 10
 *             totalStock:
 *               type: number
 *               description: Total stock quantity in the warehouse
 *               example: 1000
 */

/**
 * @swagger
 * /api/warehouse:
 *   post:
 *     summary: Create a new warehouse
 *     tags: [Warehouse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WarehouseInput'
 *     responses:
 *       201:
 *         description: Warehouse created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Warehouse'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thiếu tên hoặc adminId
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tạo warehouse thất bại
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /api/warehouse:
 *   get:
 *     summary: Get all warehouses
 *     tags: [Warehouse]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Warehouses retrieved successfully
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
 *                     $ref: '#/components/schemas/Warehouse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi khi lấy danh sách warehouse
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /api/warehouse/{warehouseId}:
 *   get:
 *     summary: Get warehouse by ID
 *     tags: [Warehouse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Warehouse ID
 *         example: 507f1f77bcf86cd799439014
 *     responses:
 *       200:
 *         description: Warehouse retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/WarehouseDetails'
 *       404:
 *         description: Warehouse not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy kho
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi khi lấy kho và tính tổng tồn kho
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /api/warehouse/{warehouseId}:
 *   put:
 *     summary: Update warehouse by ID
 *     tags: [Warehouse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Warehouse ID
 *         example: 507f1f77bcf86cd799439014
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WarehouseInput'
 *     responses:
 *       200:
 *         description: Warehouse updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Warehouse'
 *       404:
 *         description: Warehouse not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy kho
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi khi cập nhật kho
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /api/warehouse/{warehouseId}:
 *   delete:
 *     summary: Delete warehouse
 *     tags: [Warehouse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Warehouse ID
 *         example: 507f1f77bcf86cd799439014
 *     responses:
 *       200:
 *         description: Warehouse deleted successfully
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
 *                   example: Đã xoá kho
 *                 data:
 *                   $ref: '#/components/schemas/Warehouse'
 *       404:
 *         description: Warehouse not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy kho
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi khi xoá kho
 *                 error:
 *                   type: string
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
