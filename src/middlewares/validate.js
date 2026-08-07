const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// À placer après un tableau de règles express-validator dans une route.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw ApiError.badRequest('Données invalides', formatted);
  }
  next();
}

module.exports = validate;
