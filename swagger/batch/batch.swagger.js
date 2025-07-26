/**
 * @swagger
 * tags:
 *   - name: Batch
 *     description: Batch management APIs (create, read, update, delete batches)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Batch:
 *       type: object
 *       required:
 *         - batchCode
 *         - productId
 *         - distributorId
 *         - warehouseId
 *         - quantity
 *         - amount
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the batch
 *           example: 507f1f77bcf86cd799439011
 *         batchCode:
 *           type: string
 *           description: Unique batch code
 *           example: BATCH001
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
 *         distributorId:
 *           type: object
 *           description: Distributor information
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439013
 *             name:
 *               type: string
 *               example: Distributor ABC
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
 *         certificateId:
 *           type: string
 *           description: Certificate ID reference
 *           example: 507f1f77bcf86cd799439015
 *         brandId:
 *           type: string
 *           description: Brand ID reference
 *           example: 507f1f77bcf86cd799439016
 *         sampleImageUrl:
 *           type: string
 *           description: URL of sample image
 *           example: https://example.com/image.jpg
 *         quantity:
 *           type: number
 *           description: Batch quantity
 *           example: 100
 *         amount:
 *           type: number
 *           description: Batch amount/value
 *           example: 5000000
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: Expiry date of the batch
 *           example: 2025-12-31
 *         importDate:
 *           type: string
 *           format: date-time
 *           description: Import date of the batch
 *         notes:
 *           type: string
 *           description: Additional notes
 *           example: Special handling required
 *         status:
 *           type: string
 *           enum: [active, recalled, cancelled, expired]
 *           description: Batch status
 *           example: active
 *         lockedReason:
 *           type: string
 *           description: Reason for locking the batch
 *           example: Quality issues
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the batch was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the batch was last updated
 *
 *     BatchInput:
 *       type: object
 *       required:
 *         - batchCode
 *         - productId
 *         - distributorId
 *         - warehouseId
 *         - quantity
 *         - amount
 *       properties:
 *         batchCode:
 *           type: string
 *           description: Unique batch code
 *           example: BATCH001
 *         productId:
 *           type: string
 *           description: Product ID reference
 *           example: 507f1f77bcf86cd799439012
 *         distributorId:
 *           type: string
 *           description: Distributor ID reference
 *           example: 507f1f77bcf86cd799439013
 *         warehouseId:
 *           type: string
 *           description: Warehouse ID reference
 *           example: 507f1f77bcf86cd799439014
 *         certificateId:
 *           type: string
 *           description: Certificate ID reference
 *           example: 507f1f77bcf86cd799439015
 *         brandId:
 *           type: string
 *           description: Brand ID reference
 *           example: 507f1f77bcf86cd799439016
 *         imageUrl:
 *           type: string
 *           description: URL of batch image
 *           example: https://example.com/image.jpg
 *         quantity:
 *           type: number
 *           minimum: 1
 *           description: Batch quantity
 *           example: 100
 *         amount:
 *           type: number
 *           minimum: 0
 *           description: Batch amount/value
 *           example: 5000000
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: Expiry date of the batch
 *           example: 2025-12-31
 *         importDate:
 *           type: string
 *           format: date-time
 *           description: Import date of the batch
 *         notes:
 *           type: string
 *           description: Additional notes
 *           example: Special handling required
 *
 *     BatchUpdateInput:
 *       type: object
 *       properties:
 *         distributorId:
 *           type: string
 *           description: Distributor ID reference
 *           example: 507f1f77bcf86cd799439013
 *         warehouseId:
 *           type: string
 *           description: Warehouse ID reference
 *           example: 507f1f77bcf86cd799439014
 *         certificateId:
 *           type: string
 *           description: Certificate ID reference
 *           example: 507f1f77bcf86cd799439015
 *         brandId:
 *           type: string
 *           description: Brand ID reference
 *           example: 507f1f77bcf86cd799439016
 *         imageUrl:
 *           type: string
 *           description: URL of batch image
 *           example: https://example.com/image.jpg
 *         quantity:
 *           type: number
 *           minimum: 1
 *           description: Batch quantity
 *           example: 100
 *         amount:
 *           type: number
 *           minimum: 0
 *           description: Batch amount/value
 *           example: 5000000
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: Expiry date of the batch
 *           example: 2025-12-31
 *         importDate:
 *           type: string
 *           format: date-time
 *           description: Import date of the batch
 *         notes:
 *           type: string
 *           description: Additional notes
 *           example: Special handling required
 *
 *     BatchLockInput:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [recalled, cancelled, expired]
 *           description: New status for the batch
 *           example: recalled
 *         lockedReason:
 *           type: string
 *           description: Reason for locking the batch
 *           example: Quality control issues
 *
 *     BatchQuantityAdjustInput:
 *       type: object
 *       required:
 *         - newQuantity
 *       properties:
 *         newQuantity:
 *           type: number
 *           minimum: 0
 *           description: New quantity for the batch
 *           example: 95
 *         handledBy:
 *           type: string
 *           description: User ID who handled the adjustment
 *           example: 507f1f77bcf86cd799439020
 *         note:
 *           type: string
 *           description: Note for the adjustment
 *           example: Damaged items removed
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: object
 *           description: Response data
 */

/**
 * @swagger
 * /api/batch:
 *   post:
 *     summary: Create a new batch
 *     tags: [Batch]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatchInput'
 *     responses:
 *       201:
 *         description: Batch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Batch'
 */

/**
 * @swagger
 * /api/batch:
 *   get:
 *     summary: Get all batches
 *     tags: [Batch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Batches retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Batch'
 */

/**
 * @swagger
 * /api/batch/{batchId}:
 *   get:
 *     summary: Get batch by ID
 *     tags: [Batch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Batch retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Batch'
 */

/**
 * @swagger
 * /api/batch/{batchId}:
 *   put:
 *     summary: Update batch information (ADMIN)
 *     tags: [Batch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               distributorId:
 *                 type: string
 *                 description: Distributor ID reference
 *                 example: "507f1f77bcf86cd799439013"
 *               certificateId:
 *                 type: string
 *                 description: Certificate ID reference
 *                 example: "507f1f77bcf86cd799439015"
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 description: Batch amount/value
 *                 example: 5000000
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 description: Expiry date of the batch
 *                 example: "2025-12-31"
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *                 example: "Special handling required"
 *     responses:
 *       200:
 *         description: Batch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Batch'
 *       400:
 *         description: Invalid input
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Batch not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/batch/{batchId}/lock:
 *   patch:
 *     summary: Lock/change status of batch
 *     tags: [Batch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatchLockInput'
 *     responses:
 *       200:
 *         description: Batch status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Batch'
 *                 message:
 *                   type: string
 *                   example: Batch đã được chuyển sang trạng thái "recalled"
 */

/**
 * @swagger
 * /api/batch/{batchId}:
 *   delete:
 *     summary: Delete batch (soft delete)
 *     tags: [Batch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Batch deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đã huỷ batch thành công.
 *                 data:
 *                   $ref: '#/components/schemas/Batch'
 */

/**
 * @swagger
 * /api/batch/{batchId}/adjust-quantity:
 *   patch:
 *     summary: Adjust batch quantity
 *     tags: [Batch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatchQuantityAdjustInput'
 *     responses:
 *       200:
 *         description: Batch quantity adjusted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đã điều chỉnh batch
 *                 data:
 *                   $ref: '#/components/schemas/Batch'
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

/**
 * @swagger
 * /api/batch:
 *   get:
 *     summary: Get all batches (Admin only)
 *     tags: [Batch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: |
 *           Search term that matches against:
 *           - Batch Code
 *           - Batch Id
 *           - Product Name
 *           - Distributor Name
 *         example: BATCH001
 *     responses:
 *       200:
 *         description: Batches retrieved successfully
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
 *                     $ref: '#/components/schemas/Batch'
 *                   example:
 *                     - batchCode: "BATCH001"
 *                       productId:
 *                         name: "Nike Air Max"
 *                       distributorId:
 *                         name: "Distributor ABC"
 *                     - batchCode: "BATCH002"
 *                       productId:
 *                         name: "Nike Air Force"
 *                       distributorId:
 *                         name: "Distributor XYZ"
 *       404:
 *         description: No batches found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy kết quả phù hợp
 */
