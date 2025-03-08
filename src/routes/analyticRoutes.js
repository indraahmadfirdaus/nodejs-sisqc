const express = require("express");
const router = express.Router();
const analyticController = require('../controllers/analyticController');
const auth = require("../middleware/auth");
const authorizeRoles = require('../middleware/authorization');
const ROLES = require("../constant/roles");


/**
 * @swagger
 * /api/analytics/monthly-stats:
 *   get:
 *     tags: [Analytics]
 *     summary: Get monthly report statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/monthly-stats", auth, authorizeRoles([ROLES.MANAGER]), analyticController.getMonthlyReportStats);

/**
 * @swagger
 * /api/analytics/officer-performance:
 *   get:
 *     tags: [Analytics]
 *     summary: Get officer performance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/officer-performance", auth,  authorizeRoles([ROLES.MANAGER]), analyticController.getOfficerPerformance);

/**
 * @swagger
 * /api/analytics/top-rejected-items:
 *   get:
 *     tags: [Analytics]
 *     summary: Get top rejected items
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/top-rejected-items", auth,  authorizeRoles([ROLES.MANAGER]), analyticController.getTopRejectedItems);


/**
 * @swagger
 * /api/analytics/top-approved-items:
 *   get:
 *     tags: [Analytics]
 *     summary: Get top approved items
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/top-approved-items", auth,  authorizeRoles([ROLES.MANAGER]), analyticController.getTopApprovedItems);

/**
 * @swagger
 * /api/analytics/approval-ratio:
 *   get:
 *     tags: [Analytics]
 *     summary: Get approval ratio
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/approval-ratio", auth,  authorizeRoles([ROLES.MANAGER]), analyticController.getApprovalRatio);

module.exports = router;
