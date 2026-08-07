const { body, param } = require('express-validator');

const subscribe = [
  body('email').trim().notEmpty().withMessage("L'email est requis.").isEmail().withMessage('Email invalide.'),
];

const unsubscribe = [
  body('email').trim().notEmpty().withMessage("L'email est requis.").isEmail().withMessage('Email invalide.'),
];

const idParam = [param('id').isUUID().withMessage('Identifiant invalide.')];

module.exports = { subscribe, unsubscribe, idParam };
