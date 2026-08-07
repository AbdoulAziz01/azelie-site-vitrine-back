const { body } = require('express-validator');

const login = [
  body('email').trim().notEmpty().withMessage("L'email est requis.").isEmail().withMessage('Email invalide.'),
  body('password').notEmpty().withMessage('Le mot de passe est requis.'),
];

const register = [
  body('email').trim().notEmpty().withMessage("L'email est requis.").isEmail().withMessage('Email invalide.'),
  body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),
  body('fullName').trim().notEmpty().withMessage('Le nom complet est requis.'),
];

module.exports = { login, register };
