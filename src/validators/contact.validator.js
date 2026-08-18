const { body, param } = require('express-validator');

const createContact = [
  body('fullName').trim().notEmpty().withMessage('Le nom complet est requis.').isLength({ max: 150 }),
  body('email').trim().notEmpty().withMessage("L'email est requis.").isEmail().withMessage('Email invalide.'),
  body('phone').optional({ checkFalsy: true }).isMobilePhone('any').withMessage('Numéro de téléphone invalide.'),
  body('company').optional({ checkFalsy: true }).trim().isLength({ max: 150 }),
  body('subject').optional({ checkFalsy: true }).isLength({ max: 200 }),
  body('message').trim().notEmpty().withMessage('Le message est requis.').isLength({ min: 10, max: 5000 }),
];

const updateStatus = [
  param('id').isUUID().withMessage('Identifiant invalide.'),
  body('status').isIn(['NEW', 'IN_PROGRESS', 'ANSWERED', 'CLOSED']).withMessage('Statut invalide.'),
];

const idParam = [param('id').isUUID().withMessage('Identifiant invalide.')];

module.exports = { createContact, updateStatus, idParam };
