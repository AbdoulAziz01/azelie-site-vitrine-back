const { body, param } = require('express-validator');

const createFaq = [
  body('question').trim().notEmpty().withMessage('La question est requise.').isLength({ max: 300 }),
  body('answer').trim().notEmpty().withMessage('La réponse est requise.'),
  body('category').optional({ checkFalsy: true }).isString(),
  body('order').optional().isInt(),
  body('isActive').optional().isBoolean(),
];

const updateFaq = [
  param('id').isUUID().withMessage('Identifiant invalide.'),
  body('question').optional().trim().isLength({ max: 300 }),
  body('answer').optional().trim(),
  body('category').optional({ checkFalsy: true }).isString(),
  body('order').optional().isInt(),
  body('isActive').optional().isBoolean(),
];

const idParam = [param('id').isUUID().withMessage('Identifiant invalide.')];

module.exports = { createFaq, updateFaq, idParam };
