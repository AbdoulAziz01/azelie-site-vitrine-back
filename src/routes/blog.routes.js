const express = require('express');
const blogController = require('../controllers/blog.controller');
const blogValidator = require('../validators/blog.validator');
const validate = require('../middlewares/validate');
const { requireAuth, optionalAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/', optionalAuth, blogController.listPosts);
router.get('/:slug', blogValidator.slugParam, validate, blogController.getPostBySlug);
router.post('/', requireAuth, upload.single('coverImage'), blogValidator.createBlogPost, validate, blogController.createPost);
router.put('/:id', requireAuth, upload.single('coverImage'), blogValidator.updateBlogPost, validate, blogController.updatePost);
router.delete('/:id', requireAuth, blogValidator.idParam, validate, blogController.deletePost);

module.exports = router;
