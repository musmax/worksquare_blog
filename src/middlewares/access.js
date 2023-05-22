const httpStatus = require('http-status');
const auth = require('./auth');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');

// define a middleqare to check if the user is an admin or has access to edit resou
const canModifyUser = async (req, res, next) => {
  const isAdmin = req.user.dataValues.roles.includes('admin');

  // if the user is an admin, they can edit
  if (isAdmin || (parseInt(req.params.userId, 10) === req.user.dataValues.id && !req.body.role)) {
    return next();
  }

  //   if the user is not an admin, they cannot edit
  next(new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to modify this user'));
};

// middleware to check if the user can modify records depending on the submission status
const canModifyRecord = async (req, res, next) => {
  const userId = req.user.dataValues.id;
  const isAdmin = req.user.dataValues.roles.includes('admin');

  // if the user is an admin, they can edit
  if (isAdmin) {
    return next();
  }

  // if user is not an admin, they can only edit their own records if there is no status of approved
  const submission = await db.submission.findOne({
    where: {
      submittedBy: userId,
      status: 'approved',
    },
  });

  if (submission) {
    next(new ApiError(httpStatus.FORBIDDEN, 'Your record has been approved and cannot be modified'));
  }

  next();
};

// middleware to check if the user is an admin or has access to get all records
const canGetAllRecords = async (req, res, next) => {
  if (req.headers.authorization) auth()(req, res, next);
  else next();
};

module.exports = {
  canModifyUser,
  canGetAllRecords,
  canModifyRecord,
};
