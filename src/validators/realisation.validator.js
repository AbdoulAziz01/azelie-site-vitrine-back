const { body, param } = require('express-validator');

const createRealisation = [
  body('title').trim().notEmpty().withMessage('Le titre est requis.').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('La description est requise.'),
  body('client').optional({ checkFalsy: true }).isString(),
  body('category').optional({ checkFalsy: true }).isString(),
  body('images').optional().isArray().withMessage('Les images doivent être un tableau.'),
  body('isFeatured').optional().isBoolean(),
  body('completedAt').optional({ checkFalsy: true }).isISO8601().withMessage('Date invalide.'),
];

const updateRealisation = [
  param('id').isUUID().withMessage('Identifiant invalide.'),
  body('title').optional().trim().isLength({ max: 200 }),
  body('description').optional().trim(),
  body('client').optional({ checkFalsy: true }).isString(),
  body('category').optional({ checkFalsy: true }).isString(),
  body('images').optional().isArray(),
  body('isFeatured').optional().isBoolean(),
  body('completedAt').optional({ checkFalsy: true }).isISO8601(),
];

const idParam = [param('id').isUUID().withMessage('Identifiant invalide.')];
const slugParam = [param('slug').trim().notEmpty().withMessage('Slug requis.')];

module.exports = { createRealisation, updateRealisation, idParam, slugParam };
