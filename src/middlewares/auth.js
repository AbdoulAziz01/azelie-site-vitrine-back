const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Protège les routes d'administration (futur dashboard). Attend un header Authorization: Bearer <token>.
const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Authentification requise.');
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    throw ApiError.unauthorized('Session invalide ou expirée.');
  }
});

// Restreint l'accès à certains rôles (ex: SUPER_ADMIN pour la gestion des comptes admin).
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      throw ApiError.forbidden('Permissions insuffisantes.');
    }
    next();
  };
}

// Authentification optionnelle: si un token valide est fourni, req.admin est renseigné
// (utile pour que l'admin voie les éléments inactifs sur les mêmes routes publiques).
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return next();

  const token = header.split(' ')[1];
  try {
    req.admin = jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    // Token invalide/expiré : on continue en tant que visiteur anonyme.
  }
  next();
}

module.exports = { requireAuth, requireRole, optionalAuth };
