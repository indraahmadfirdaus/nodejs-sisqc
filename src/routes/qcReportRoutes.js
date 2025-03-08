const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../utils/multer');
const qcReportController = require('../controllers/qcReportController');

/**
 * @swagger
 * /api/qc-reports:
 *   get:
 *     tags: [QC Reports]
 *     summary: Get all QC reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of QC reports retrieved successfully
 */
router.get('/',
    auth,
    qcReportController.getAllReports);

/**
 * @swagger
 * /api/qc-reports/{id}:
 *   get:
 *     tags: [QC Reports]
 *     summary: Get QC Reports by id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: QC Report retrieved successfully
 */
router.get('/:id', auth, qcReportController.getReportById);

/**
 * @swagger
 * /api/qc-reports:
 *   post:
 *     tags: [QC Reports]
 *     summary: Create new QC report
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - items
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               report_notes:
 *                 type: string
 *               report_date:
 *                  type: date string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - goods_id
 *                   properties:
 *                     goods_id:
 *                       type: string
 *                     approved_count:
 *                       type: number
 *                     rejected_count:
 *                       type: number
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Base64 encoded image string
 *     responses:
 *       201:
 *         description: QC report created successfully
 */
router.post('/', auth, qcReportController.createReport);

/**
 * @swagger
 * /api/qc-reports/{id}:
 *   put:
 *     tags: [QC Reports]
 *     summary: Update QC report
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               report_notes:
 *                 type: string
 *               report_date:
 *                 type: date string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     goods_id:
 *                       type: string
 *                     approved_count:
 *                       type: number
 *                     rejected_count:
 *                       type: number
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Base64 encoded image string
 *     responses:
 *       200:
 *         description: QC report updated successfully
 */
router.put('/:id', auth, qcReportController.updateReport);


/**
 * @swagger
 * /api/qc-reports/{id}/approval:
 *   put:
 *     tags: [QC Reports]
 *     summary: Approve or reject QC report
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approval_status
 *             properties:
 *               approval_status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *               approval_notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: QC report approval status updated successfully
 */
router.put('/:id/approval', auth, qcReportController.updateApprovalStatus);

/**
 * @swagger
 * /api/qc-reports/reporter/{reporterId}:
 *   get:
 *     tags: [QC Reports]
 *     summary: Get all QC reports by reporter ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reporterId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reporter
 *     responses:
 *       200:
 *         description: List of QC reports for the specified reporter
 *       404:
 *         description: No reports found for this reporter
 */
router.get('/reporter/:reporterId', auth, qcReportController.getReportsByReporterId);

/**
 * @swagger
 * /api/qc-reports/{id}:
 *   delete:
 *     tags: [QC Reports]
 *     summary: Delete QC report
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: QC report deleted successfully
 */
router.delete('/:id', auth, qcReportController.deleteReport);

module.exports = router;