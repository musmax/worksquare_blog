const Joi = require('joi');

const createMessage = {
  body: Joi.object().keys({
    message: Joi.string().required(),
    submissionId: Joi.string().required(),
    receiverId: Joi.string().required(),
  }),
};

module.exports = {
  createMessage,
};
