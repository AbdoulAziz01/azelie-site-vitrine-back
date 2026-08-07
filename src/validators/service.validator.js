const { body, param } = require('express-validator');

const createService = [
  body('title').trim().notEmpty().withMessage('Le titre est requis.').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('La description est requise.'),
  body('icon').optional({ checkFalsy: true }).isString(),
  body('image').optional({ checkFalsy: true }).isString(),
  body('order').optional().isInt().withMessage("L'ordre doit être un entier."),
  body('isActive').optional().isBoolean(),
];

const updateService = [
  param('id').isUUID().withMessage('Identifiant invalide.'),
  body('title').optional().trim().isLength({ max: 200 }),
  body('description').optional().trim(),
  body('icon').optional({ checkFalsy: true }).isString(),
  body('image').optional({ checkFalsy: true }).isString(),
  body('order').optional().isInt(),
  body('isActive').optional().isBoolean(),
];

const idParam = [param('id').isUUID().withMessage('Identifiant invalide.')];
const slugParam = [param('slug').trim().notEmpty().withMessage('Slug requis.')];

module.exports = { createService, updateService, idParam, slugParam };
