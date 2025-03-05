import express from 'express';
import incidentController from '../controllers/incidentController';
import auth from '../middleware/auth';
const router = express.Router();

/**
 * @swagger
 * /api/incidents:
 *   post:
 *     summary: Create a new incident
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Incident created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, incidentController.createIncident);

/**
 * @swagger
 * /api/incidents:
 *   get:
 *     summary: Get all incidents
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all incidents
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, incidentController.getAllIncidents);

/**
 * @swagger
 * /api/incidents/{id}:
 *   get:
 *     summary: Get incident by ID
 *     tags: [Incidents]
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
 *         description: Incident details
 *       404:
 *         description: Incident not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authenticateToken, incidentController.getIncidentById);



export default router;
