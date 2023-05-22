const { db } = require('../models');

/**
 * Get all permissions
 * @returns {Promise<Permissions[]>}
 */
const getAllPermissions = async () => {
  return db.permission.findAll();
};

/**
 * Get permissions by id
 * @param {ObjectId} id
 * @returns {Promise<Permissions>}
 */
const getPermissionsById = async (id) => {
  return db.permission.findByPk(id);
};

module.exports = {
  getAllPermissions,
  getPermissionsById,
};
