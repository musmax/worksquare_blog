const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');
const logger = require('../config/logger');
const { sendEmail } = require('./email.service');
const { getMessageTemplateByTitle, convertTemplateToMessage } = require('./message_template.service');
const { deleteUploadedFile } = require('./upload.service');

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
const isEmailTaken = async function (email) {
  const user = await db.user.findOne({ where: { email } });
  logger.info(user);
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
const isPasswordMatch = async function (password, user) {
  const comp = bcrypt.compareSync(password, user.password);
  logger.info(comp);
  return comp;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return db.user.findByPk(id, {
    include: {
      model: db.roles,
      as: 'roles',
      attributes: ['name'],
      through: { attributes: [] },
    },
  });
};

const sendUserWelcomeEmail = async (user) => {
  // get user email and first name
  const { email, firstName } = user.dataValues;
  // get message template
  const {
    dataValues: { emailSubject, emailBody },
  } = await getMessageTemplateByTitle('Welcome_Email');

  const text = await convertTemplateToMessage(emailBody, {
    firstName,
  });

  await sendEmail(email, emailSubject, text);
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  // extact user role
  const { role, ...userProfile } = userBody;

  // check if email is taken
  if (await isEmailTaken(userProfile.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // get the user role
  const userRole = await db.roles.findOne({ where: { name: role } });

  // eslint-disable-next-line no-param-reassign
  userProfile.password = bcrypt.hashSync(userProfile.password, 8);
  const user = await db.user.create(userProfile);

  // set the user role
  await user.setRoles(userRole);

  // send welcome email
  await sendUserWelcomeEmail(user);

  // return user object with role
  return getUserById(user.id);
};

/**
 * Query for users
 * @param {Object} filter - filter
 * @param {Object} current - Query current
 * @param {string} [filter.firstName] - filter firstname
 * @param {string} [filter.isVerified] - filter isVerified
 * @param {number} [current.limit] - Maximum number of results per page (default = 25)
 * @param {number} [current.page] - The row to start from (default = 0)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, current) => {
  // get user and include their roles
  const options = {
    attributes: { exclude: ['password'] },
    page: current.page, // Default 1
    paginate: current.limit, // Default 25
    where: {
      firstName: {
        [Op.like]: `%${filter.firstName || ''}%`,
      },
      isVerified: {
        [Op.like]: `%${filter.isVerified || ''}%`,
      },
    },
    include: {
      model: db.roles,
      as: 'roles',
      attributes: ['name'],
      through: { attributes: [] },
    },
  };
  const { docs, pages, total } = await db.user.paginate(options);
  return { users: docs, limit: options.paginate, totalPages: pages, totalResults: total };
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return db.user.findOne({
    where: { email },
    include: {
      model: db.roles,
      as: 'roles',
      attributes: ['name'],
      through: { attributes: [] },
    },
  });
};

const handleFileDelete = async (certificateOfReturn, identificationImage, profileImage, user) => {
  // delete existing certificate of return
  if (certificateOfReturn && user.dataValues.certificateOfReturn) {
    await deleteUploadedFile(user.dataValues.certificateOfReturn);
  }

  // delete existing identification image
  if (identificationImage && user.dataValues.identificationImage) {
    await deleteUploadedFile(user.dataValues.identificationImage);
  }

  // delete existing profile image
  if (profileImage && user.dataValues.profileImage) {
    await deleteUploadedFile(user.dataValues.profileImage);
  }

  return true;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @param {Object} currentUser
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const { role, certificateOfReturn, identificationImage, profileImage, ...userProfile } = updateBody;
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (userProfile.email && (await isEmailTaken(userProfile.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // if password is updated, hash it
  if (userProfile.password) {
    // eslint-disable-next-line no-param-reassign
    userProfile.password = bcrypt.hashSync(userProfile.password, 8);
  }

  // if role is updated, get the role
  if (role) {
    // get the new role
    const userRole = await db.roles.findAll({ where: { name: role.map((r) => r) } });

    // confirm the role passed is valid
    if (userRole.length !== role.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role');
    }

    // remove existing role
    await user.removeRoles();
    // set the new role
    await user.setRoles(userRole);
  }

  // delete existing images if they are updated
  if (certificateOfReturn || identificationImage || profileImage) {
    await handleFileDelete(certificateOfReturn, identificationImage, profileImage, user);
  }

  Object.assign(user, { ...userProfile, certificateOfReturn, identificationImage, profileImage });
  await user.save();
  return getUserById(userId);
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await user.destroy();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  isPasswordMatch,
};
