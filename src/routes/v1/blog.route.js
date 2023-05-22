const express = require('express');
const validate = require('../../middlewares/validate');
const { blogValidation } = require('../../validations');
const { blogController } = require('../../controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(blogValidation.createBlog), blogController.createBlog)
  .get(auth(), validate(blogValidation.getBlogs), blogController.getBlogs);

router
  .route('/:blogId')
  .get(auth(),validate(blogValidation.getBlog), blogController.getBlogById)
  .patch(auth(), validate(blogValidation.updateBlogById), blogController.updateBlogById)
  .delete(auth(),validate(blogValidation.deleteBlogById), blogController.deleteBlogById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management and retrieval
 */

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a blog
 *     description: Allows all users to create a blog.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             example:
 *               title: How to be a man
 *               content: Just be born a man
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Blog'
 *       "400":
 *         $ref: '#/components/responses/NotFound'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all blogs
 *     description: Allows only admins to retrieve all blogs.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: query
 *        name: name
 *        schema:
 *          type: string
 *          description: Blog title
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get a blog
 *     description: Allows all users to fetch a blog.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Blog'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a blog
 *     description: Allows only admins to update a blog.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             example:
 *               title: How to be a woman
 *               content: Just be a woman
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Blog'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a blog
 *     description: Allows only admins to delete a blog.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
