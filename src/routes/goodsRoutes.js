const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../utils/multer');
const authorizeRoles = require('../middleware/authorization');
const ROLES = require('../constant/roles');
const goodsController = require('../controllers/goodsController');

/**
 * @swagger
 * /api/goods:
 *   post:
 *     tags: [Goods]
 *     summary: Create new goods
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
 *             properties:
 *               sku_code:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               photo:
 *                 type: file
 *     responses:
 *       201:
 *         description: Goods created successfully
 */
router.post('/', auth, upload.single('photo'), goodsController.createGoods);

/**
 * @swagger
 * /api/goods:
 *   get:
 *     tags: [Goods]
 *     summary: Get all goods
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Goods retrieved successfully
 */
router.get('/', auth, goodsController.getAllGoods);

/**
 * @swagger
 * /api/goods/{id}:
 *   get:
 *     tags: [Goods]
 *     summary: Get goods by ID
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
 *         description: Goods retrieved successfully
 */
router.get('/:id', auth, goodsController.getGoodsById);

/**
 * @swagger
 * /api/goods/{id}:
 *   put:
 *     tags: [Goods]
 *     summary: Update goods
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               sku_code:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               photo:
 *                 type: file
 *     responses:
 *       200:
 *         description: Goods updated successfully
 */
router.put('/:id', auth, upload.single('photo'), goodsController.updateGoods);

/**
 * @swagger
 * /api/goods/{id}:
 *   delete:
 *     tags: [Goods]
 *     summary: Delete goods
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
 *         description: Goods deleted successfully
 */
router.delete('/:id', auth, goodsController.deleteGoods);

module.exports = router;