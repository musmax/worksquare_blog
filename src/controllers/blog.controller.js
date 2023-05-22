const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { blogService } = require('../services');
const pick = require('../utils/pick');

const createBlog = catchAsync(async (req, res) => {
  const blog = await blogService.createBlog(req.body,req.user.id);
  res.status(httpStatus.CREATED).send(blog);
});

const getBlogs = catchAsync(async (req, res) => {
  const blogs = await blogService.getAllBlogs();
  res.status(httpStatus.OK).send(blogs);
});

const getBlogById = catchAsync(async (req, res) => {
  const blog = await blogService.getBlogById(req.params.blogId);
  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'blog not found');
  }
  res.status(httpStatus.OK).send(blog);
});

const updateBlogById = catchAsync(async (req, res) => {
  const blog = await blogService.updateBlogById(req.params.blogId, req.body);
  res.status(httpStatus.OK).send(blog);
});

const deleteBlogById = catchAsync(async (req, res) => {
  await blogService.deleteBlogById(req.params.blogId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlogById,
  deleteBlogById,
};
