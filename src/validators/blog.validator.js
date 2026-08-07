const { body, param } = require('express-validator');

const createBlogPost = [
  body('title').trim().notEmpty().withMessage('Le titre est requis.').isLength({ max: 200 }),
  body('content').trim().notEmpty().withMessage('Le contenu est requis.'),
  body('excerpt').optional({ checkFalsy: true }).isLength({ max: 500 }),
  body('coverImage').optional({ checkFalsy: true }).isString(),
  body('author').optional({ checkFalsy: true }).isString(),
  body('tags').optional().isArray(),
  body('isPublished').optional().isBoolean(),
];

const updateBlogPost = [
  param('id').isUUID().withMessage('Identifiant invalide.'),
  body('title').optional().trim().isLength({ max: 200 }),
  body('content').optional().trim(),
  body('excerpt').optional({ checkFalsy: true }).isLength({ max: 500 }),
  body('coverImage').optional({ checkFalsy: true }).isString(),
  body('author').optional({ checkFalsy: true }).isString(),
  body('tags').optional().isArray(),
  body('isPublished').optional().isBoolean(),
];

const idParam = [param('id').isUUID().withMessage('Identifiant invalide.')];
const slugParam = [param('slug').trim().notEmpty().withMessage('Slug requis.')];

module.exports = { createBlogPost, updateBlogPost, idParam, slugParam };
