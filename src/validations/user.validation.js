const Joi = require('joi');
const { password } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    isVerified: Joi.boolean(),
    role: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required(),
  }),
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().custom(password),
    firstName: Joi.string(),
    lastName: Joi.string(),
    middleName: Joi.string(),
    address: Joi.string(),
    chamber: Joi.string().valid('House of Representatives', 'Senate'),
    identificationNumber: Joi.string(),
    identificationImage: Joi.string(),
    profileImage: Joi.string(),
    phoneNumber: Joi.string(),
    isVerified: Joi.boolean(),
    maritalStatus: Joi.string(),
    dateOfBirth: Joi.date(),
    state: Joi.string(),
    constituency: Joi.string(),
    party: Joi.string(),
    parliamentNumber: Joi.string(),
    parliamentAddress: Joi.string(),
    facebook: Joi.string(),
    twitter: Joi.string(),
    certificateOfReturn: Joi.string(),
    identificationType: Joi.string().valid('International Passport', 'National ID Card', "Driver's License"),
    numberOfChildren: Joi.number(),
    nextOfKin: Joi.string(),
    nextOfKinPhoneNumber: Joi.string(),
    nextOfKinAddress: Joi.string(),
    gender: Joi.string(),
    role: Joi.string(),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
