/**
 * @swagger
 * tags:
 *   name: Product
 *   description: API quản lý sản phẩm
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *               - categoryId
 *               - productTypeId
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sữa rửa mặt
 *               price:
 *                 type: number
 *                 example: 120000
 *               description:
 *                 type: string
 *                 example: Sữa rửa mặt dịu nhẹ, phù hợp cho da nhạy cảm
 *               categoryId:
 *                 type: string
 *                 example: 60f71a61a5a4c146a8a7b1cc
 *               productTypeId:
 *                 type: string
 *                 example: 60f71a61a5a4c146a8a7b1cd
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Sản phẩm đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi máy chủ
 *
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Lỗi máy chủ
 */
