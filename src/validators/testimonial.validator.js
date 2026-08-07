const { body, param } = require('express-validator');

const createTestimonial = [
  body('fullName').trim().notEmpty().withMessage('Le nom complet est requis.').isLength({ max: 150 }),
  body('company').optional({ checkFalsy: true }).isLength({ max: 150 }),
  body('message').trim().notEmpty().withMessage('Le témoignage est requis.').isLength({ max: 2000 }),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('La note doit être comprise entre 1 et 5.'),
  body('photo').optional({ checkFalsy: true }).isString(),
  body('isActive').optional().isBoolean(),
];

const updateTestimonial = [
  param('id').isUUID().withMessage('Identifiant invalide.'),
  body('fullName').optional().trim().isLength({ max: 150 }),
  body('company').optional({ checkFalsy: true }).isLength({ max: 150 }),
  body('message').optional().trim().isLength({ max: 2000 }),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('photo').optional({ checkFalsy: true }).isString(),
  body('isActive').optional().isBoolean(),
];

const idParam = [param('id').isUUID().withMessage('Identifiant invalide.')];

module.exports = { createTestimonial, updateTestimonial, idParam };
