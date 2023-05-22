const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');
const { sendEmail } = require('./email.service');

/**
 * Send reciever a notification
 * @param {number} user
 * @returns {Promise<>}
 */
const sendNotification = async (user) => {
  const { email } = user.dataValues;
  await sendEmail(email, 'New Message', 'You have a new message');
};

/**
 * Create a new message
 * @param {number} senderId
 * @param {object} messageBody
 * @param {string} messageBody.message
 * @param {string} messageBody.submissionId
 * @param {string} messageBody.receiverId
 * @param {string} messageBody.senderId
 * @returns {Promise<message>}
 */
const createMessage = async (senderId, messageBody) => {
  const submission = await db.submission.findByPk(messageBody.submissionId);

  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Submission not found');
  }

  const reciever = await db.user.findByPk(messageBody.receiverId);
  if (!reciever) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reciever not found');
  }

  const message = await db.message.create({ ...messageBody, senderId });
  await sendNotification(reciever);
  return message;
};

module.exports = {
  createMessage,
};
