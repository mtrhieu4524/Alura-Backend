/**
 * @swagger
 * tags:
 *   - name: SubCategory
 *     description: SubCategory management APIs (create, read, update, delete subcategories)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SubCategory:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - categoryID
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the subcategory
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           description: The name of the subcategory
 *           example: Smartphones
 *         description:
 *           type: string
 *           description: The description of the subcategory
 *           example: Mobile phones and smartphones
 *         categoryID:
 *           type: string
 *           description: Reference to the parent category ID
 *           example: 507f1f77bcf86cd799439012
 *         category:
 *           type: object
 *           description: Populated category information
 *           properties:
 *             id:
 *               type: string
 *               example: 507f1f77bcf86cd799439012
 *             name:
 *               type: string
 *               example: Electronics
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the subcategory was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the subcategory was last updated
 *
 *     SubCategoryInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - categoryID
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the subcategory
 *           example: Smartphones
 *         description:
 *           type: string
 *           description: The description of the subcategory
 *           example: Mobile phones and smartphones
 *         categoryID:
 *           type: string
 *           description: Reference to the parent category ID
 *           example: 507f1f77bcf86cd799439012
 *
 *     SubCategoryUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the subcategory
 *           example: Smartphones
 *         description:
 *           type: string
 *           description: The description of the subcategory
 *           example: Mobile phones and smartphones
 *         categoryID:
 *           type: string
 *           description: Reference to the parent category ID
 *           example: 507f1f77bcf86cd799439012
 */

/**
 * @swagger
 * /api/sub-categories:
 *   post:
 *     summary: Create a new subcategory
 *     tags: [SubCategory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubCategoryInput'
 *     responses:
 *       201:
 *         description: SubCategory created successfully
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
 *                   example: SubCategory created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       example: Smartphones
 *                     description:
 *                       type: string
 *                       example: Mobile phones and smartphones
 *                     categoryID:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439012
 *       400:
 *         description: Missing required fields
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
 *                   example: Name, description, and categoryID are required
 *       404:
 *         description: Category not found
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
 *                   example: Category not found
 *       500:
 *         description: Server error
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
 *                   example: Server error
 *                 error:
 *                   type: string
 *                   example: Error details
 */

/**
 * @swagger
 * /api/sub-categories:
 *   get:
 *     summary: Get all subcategories
 *     tags: [SubCategory]
 *     responses:
 *       200:
 *         description: Subcategories fetched successfully
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
 *                   example: Fetched subcategories successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       name:
 *                         type: string
 *                         example: Smartphones
 *                       description:
 *                         type: string
 *                         example: Mobile phones and smartphones
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 507f1f77bcf86cd799439012
 *                           name:
 *                             type: string
 *                             example: Electronics
 *       500:
 *         description: Server error
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
 *                   example: Server error
 *                 error:
 *                   type: string
 *                   example: Error details
 */

/**
 * @swagger
 * /api/sub-categories/{id}:
 *   get:
 *     summary: Get subcategory by ID
 *     tags: [SubCategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SubCategory ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: SubCategory fetched successfully
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
 *                   example: Fetched subcategory successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       example: Smartphones
 *                     description:
 *                       type: string
 *                       example: Mobile phones and smartphones
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439012
 *                         name:
 *                           type: string
 *                           example: Electronics
 *       404:
 *         description: SubCategory not found
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
 *                   example: SubCategory not found
 *       500:
 *         description: Server error
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
 *                   example: Server error
 *                 error:
 *                   type: string
 *                   example: Error details
 */

/**
 * @swagger
 * /api/sub-categories/{id}:
 *   put:
 *     summary: Update subcategory by ID
 *     tags: [SubCategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SubCategory ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubCategoryUpdateInput'
 *     responses:
 *       200:
 *         description: SubCategory updated successfully
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
 *                   example: SubCategory updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       example: Smartphones
 *                     description:
 *                       type: string
 *                       example: Mobile phones and smartphones
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439012
 *                         name:
 *                           type: string
 *                           example: Electronics
 *       404:
 *         description: SubCategory or Category not found
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
 *                   example: SubCategory not found
 *       500:
 *         description: Server error
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
 *                   example: Server error
 *                 error:
 *                   type: string
 *                   example: Error details
 */

/**
 * @swagger
 * /api/sub-categories/{id}:
 *   delete:
 *     summary: Delete subcategory by ID
 *     tags: [SubCategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SubCategory ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: SubCategory deleted successfully
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
 *                   example: SubCategory deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       example: Smartphones
 *                     description:
 *                       type: string
 *                       example: Mobile phones and smartphones
 *       400:
 *         description: Cannot delete subcategory due to dependencies
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
 *                   example: "Cannot delete SubCategory: it is still referenced in ProductType via \"subCategoryID\""
 *       404:
 *         description: SubCategory not found
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
 *                   example: SubCategory not found
 *       500:
 *         description: Server error
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
 *                   example: Server error
 *                 error:
 *                   type: string
 *                   example: Error details
 */
