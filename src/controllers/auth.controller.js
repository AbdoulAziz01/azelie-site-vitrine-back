const AdminModel = require('../models/admin.model');
const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// POST /api/auth/login — public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await AdminModel.findByEmail(email);
  if (!admin || !admin.isActive) throw ApiError.unauthorized('Identifiants invalides.');

  const valid = await authService.comparePassword(password, admin.password);
  if (!valid) throw ApiError.unauthorized('Identifiants invalides.');

  const token = authService.generateToken(admin);
  return sendSuccess(res, {
    data: {
      token,
      admin: { id: admin.id, email: admin.email, fullName: admin.fullName, role: admin.role },
    },
    message: 'Connexion réussie.',
  });
});

// POST /api/auth/register — protégé (SUPER_ADMIN uniquement), permet de créer de futurs comptes admin.
// Bootstrap: si aucun admin n'existe encore en base, la création est autorisée sans authentification.
const register = asyncHandler(async (req, res) => {
  const { email, password, fullName, role } = req.body;

  const existing = await AdminModel.findByEmail(email);
  if (existing) throw ApiError.conflict('Un compte existe déjà avec cet email.');

  const hashed = await authService.hashPassword(password);
  const admin = await AdminModel.create({ email, password: hashed, fullName, role: role || 'ADMIN' });

  return sendSuccess(res, {
    statusCode: 201,
    data: { id: admin.id, email: admin.email, fullName: admin.fullName, role: admin.role },
    message: 'Compte administrateur créé.',
  });
});

// GET /api/auth/me — protégé
const me = asyncHandler(async (req, res) => {
  const admin = await AdminModel.findById(req.admin.sub);
  if (!admin) throw ApiError.notFound('Administrateur introuvable.');
  return sendSuccess(res, {
    data: { id: admin.id, email: admin.email, fullName: admin.fullName, role: admin.role },
  });
});

module.exports = { login, register, me };
