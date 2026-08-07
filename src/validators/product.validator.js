const { body, param } = require('express-validator');

const createProduct = [
  body('name').trim().notEmpty().withMessage('Le nom est requis.').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('La description est requise.'),
  body('price').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif.'),
  body('category').optional({ checkFalsy: true }).isString(),
  body('stock').optional().isInt({ min: 0 }),
  body('images').optional().isArray().withMessage('Les images doivent être un tableau.'),
  body('isActive').optional().isBoolean(),
];

const updateProduct = [
  param('id').isUUID().withMessage('Identifiant invalide.'),
  body('name').optional().trim().isLength({ max: 200 }),
  body('description').optional().trim(),
  body('price').optional({ checkFalsy: true }).isFloat({ min: 0 }),
  body('category').optional({ checkFalsy: true }).isString(),
  body('stock').optional().isInt({ min: 0 }),
  body('images').optional().isArray(),
  body('isActive').optional().isBoolean(),
];

const idParam = [param('id').isUUID().withMessage('Identifiant invalide.')];
const slugParam = [param('slug').trim().notEmpty().withMessage('Slug requis.')];

module.exports = { createProduct, updateProduct, idParam, slugParam };
