const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route introuvable: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  let { statusCode, message, errors } = err;

  // Erreurs Prisma connues
  if (err.code === 'P2002') {
    statusCode = 409;
    message = `Cette valeur existe déjà (${err.meta?.target?.join(', ') || 'champ unique'}).`;
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Ressource introuvable.';
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token invalide.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expiré.';
  }

  statusCode = statusCode || 500;
  message = message || 'Erreur interne du serveur';

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} -> ${err.stack || err.message}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors && errors.length ? errors : undefined,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = { notFoundHandler, errorHandler };
