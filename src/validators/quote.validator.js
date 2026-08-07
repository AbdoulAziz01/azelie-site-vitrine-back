const { body, param } = require('express-validator');

const createQuote = [
  body('fullName').trim().notEmpty().withMessage('Le nom complet est requis.').isLength({ max: 150 }),
  body('email').trim().notEmpty().withMessage("L'email est requis.").isEmail().withMessage('Email invalide.'),
  body('phone').optional({ checkFalsy: true }).isMobilePhone('any').withMessage('Numéro de téléphone invalide.'),
  body('company').optional({ checkFalsy: true }).isLength({ max: 150 }),
  body('projectType').optional({ checkFalsy: true }).isLength({ max: 150 }),
  body('budget').optional({ checkFalsy: true }).isLength({ max: 100 }),
  body('description').trim().notEmpty().withMessage('La description du projet est requise.').isLength({ min: 10, max: 5000 }),
];

const updateStatus = [
  param('id').isUUID().withMessage('Identifiant invalide.'),
  body('status').isIn(['NEW', 'IN_PROGRESS', 'ANSWERED', 'CLOSED']).withMessage('Statut invalide.'),
];

const idParam = [param('id').isUUID().withMessage('Identifiant invalide.')];

module.exports = { createQuote, updateStatus, idParam };
