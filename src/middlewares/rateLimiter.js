const rateLimit = require('express-rate-limit');
const env = require('../config/env');

// Limiteur global appliqué à toute l'API.
const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de requêtes, veuillez réessayer plus tard.' },
});

// Limiteur strict pour les endpoints sensibles (contact, devis, newsletter, login) contre le spam/brute-force.
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de tentatives, veuillez réessayer dans quelques minutes.' },
});

module.exports = { globalLimiter, strictLimiter };
