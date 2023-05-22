const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { messageService } = require('../services');

const createMessage = catchAsync(async (req, res) => {
  const message = await messageService.createMessage(req.user.dataValues.id, req.body);
  res.status(httpStatus.CREATED).send(message);
});

module.exports = {
  createMessage,
};
