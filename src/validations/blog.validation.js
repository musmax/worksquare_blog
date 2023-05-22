const Joi = require('joi');

const createBlog = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

const getBlogs = {
  query: Joi.object().keys({
  }),
};

const getBlog = {
  params: Joi.object().keys({
    blogId: Joi.string().required(),
  }),
};

const updateBlogById = {
  params: Joi.object().keys({
    blogId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    content: Joi.string(),
  }),
};

const deleteBlogById = {
  params: Joi.object().keys({
    blogId: Joi.string().required(),
  }),
};

module.exports = {
  createBlog,
  getBlog,
  updateBlogById,
  deleteBlogById,
  getBlogs,
};
