const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');

/**
 * Get all blogs
 * @param {Object} filter - Sequelize filter
 * @returns {Promise<blog[]>}
 */
const getAllBlogs = async () => {
  return db.blog.findAll();
};

/**
 * Get blog by id
 * @param {ObjectId} id
 * @returns {Promise<blog>}
 */
const getBlogById = async (id) => {
  return db.blog.findByPk(id);
};

/**
 * Create blog
 * @param {Object} blogBody
 * @returns {Promise<blog>}
 */
const createBlog = async (blogBody, authorId) => {
  return db.blog.create({...blogBody,authorId});
};

/**
 * Update blog by id
 * @param {ObjectId} blogId
 * @param {Object} updateBody
 * @returns {Promise<blog>}
 */
const updateBlogById = async (blogId, updateBody) => {
  const blog = await getBlogById(blogId);
  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
  }
  Object.assign(blog, updateBody);
  await blog.save();
  return blog;
};

/**
 * Delete blog by id
 * @param {ObjectId} blogId
 * @returns {Promise<blog>}
 */
const deleteBlogById = async (blogId) => {
  const blog = await getBlogById(blogId);
  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
  }
  await blog.destroy();
  return blog;
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlogById,
  deleteBlogById,
};
