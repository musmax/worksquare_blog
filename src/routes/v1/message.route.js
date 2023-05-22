const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { messageValidation } = require('../../validations');
const { messageController } = require('../../controllers');

const router = express.Router();

router.route('/').post(auth(), validate(messageValidation.createMessage), messageController.createMessage);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messages management and retrieval
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Create an message
 *     description: Only admins and users can create messages.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - submissionId
 *               - receiverId
 *             properties:
 *               message:
 *                 type: string
 *               submissionId:
 *                 type: string
 *               receiverId:
 *                 type: string
 *             example:
 *               message: Please reupload your Identification number
 *               submissionId: 5f9f1b9b8b7c1c0f8c8b9b9b
 *               receiverId: 5f9f1b9b8b7c1c0f8c8b9b9b
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Messages'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */
