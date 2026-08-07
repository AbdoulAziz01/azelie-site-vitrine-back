const express = require('express');
const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator');
const validate = require('../middlewares/validate');
const { requireAuth, requireRole } = require('../middlewares/auth');
const { strictLimiter } = require('../middlewares/rateLimiter');
const asyncHandler = require('../utils/asyncHandler');
const AdminModel = require('../models/admin.model');

const router = express.Router();

// Autorise la création du tout premier compte admin sans authentification (bootstrap).
// Une fois qu'un admin existe, seul un SUPER_ADMIN peut en créer d'autres.
const bootstrapOrSuperAdmin = asyncHandler(async (req, res, next) => {
  const count = await AdminModel.count();
  if (count === 0) return next();
  return requireAuth(req, res, () => requireRole('SUPER_ADMIN')(req, res, next));
});

router.post('/login', strictLimiter, authValidator.login, validate, authController.login);
router.post('/register', strictLimiter, bootstrapOrSuperAdmin, authValidator.register, validate, authController.register);
router.get('/me', requireAuth, authController.me);

module.exports = router;
