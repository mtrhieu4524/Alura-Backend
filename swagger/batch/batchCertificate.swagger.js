/**
 * @swagger
 * tags:
 *   - name: BatchCertificate
 *     description: Batch certificate management APIs (create, read, update, delete certificates)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BatchCertificate:
 *       type: object
 *       required:
 *         - certificateCode
 *         - issueDate
 *         - issuedBy
 *         - fileUrl
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the certificate
 *           example: 507f1f77bcf86cd799439015
 *         certificateCode:
 *           type: string
 *           description: Unique certificate code
 *           example: CERT001
 *         issueDate:
 *           type: string
 *           format: date
 *           description: Date the certificate was issued
 *           example: 2025-01-01
 *         issuedBy:
 *           type: string
 *           description: Entity that issued the certificate
 *           example: Certification Authority
 *         fileUrl:
 *           type: string
 *           description: URL of the certificate file
 *           example: https://example.com/certificate.pdf
 *         note:
 *           type: string
 *           description: Additional notes for the certificate
 *           example: Certificate for batch quality assurance
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the certificate was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the certificate was last updated
 *
 *     BatchCertificateInput:
 *       type: object
 *       required:
 *         - certificateCode
 *         - issueDate
 *         - issuedBy
 *         - fileUrl
 *       properties:
 *         certificateCode:
 *           type: string
 *           description: Unique certificate code
 *           example: CERT001
 *         issueDate:
 *           type: string
 *           format: date
 *           description: Date the certificate was issued
 *           example: 2025-01-01
 *         issuedBy:
 *           type: string
 *           description: Entity that issued the certificate
 *           example: Certification Authority
 *         fileUrl:
 *           type: string
 *           description: URL of the certificate file
 *           example: https://example.com/certificate.pdf
 *         note:
 *           type: string
 *           description: Additional notes for the certificate
 *           example: Certificate for batch quality assurance
 */

/**
 * @swagger
 * /api/batch-certificate:
 *   post:
 *     summary: Create a new batch certificate
 *     tags: [BatchCertificate]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatchCertificateInput'
 *     responses:
 *       201:
 *         description: Certificate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BatchCertificate'
 */

/**
 * @swagger
 * /api/batch-certificate:
 *   get:
 *     summary: Get all batch certificates
 *     tags: [BatchCertificate]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Certificates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BatchCertificate'
 */

/**
 * @swagger
 * /api/batch-certificate/{certificateId}:
 *   get:
 *     summary: Get batch certificate by ID
 *     tags: [BatchCertificate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: certificateId
 *         required: true
 *         schema:
 *           type: string
 *         description: Certificate ID
 *         example: 507f1f77bcf86cd799439015
 *     responses:
 *       200:
 *         description: Certificate retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BatchCertificate'
 */

/**
 * @swagger
 * /api/batch-certificate/{certificateId}:
 *   put:
 *     summary: Update batch certificate by ID
 *     tags: [BatchCertificate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: certificateId
 *         required: true
 *         schema:
 *           type: string
 *         description: Certificate ID
 *         example: 507f1f77bcf86cd799439015
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatchCertificateInput'
 *     responses:
 *       200:
 *         description: Certificate updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BatchCertificate'
 */

/**
 * @swagger
 * /api/batch-certificate/{certificateId}:
 *   delete:
 *     summary: Delete batch certificate
 *     tags: [BatchCertificate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: certificateId
 *         required: true
 *         schema:
 *           type: string
 *         description: Certificate ID
 *         example: 507f1f77bcf86cd799439015
 *     responses:
 *       200:
 *         description: Certificate deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đã xoá chứng nhận
 *                 data:
 *                   $ref: '#/components/schemas/BatchCertificate'
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
