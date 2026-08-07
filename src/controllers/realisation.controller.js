const RealisationModel = require('../models/realisation.model');
const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');
const slugify = require('../utils/slugify');

// GET /api/realisations — public/admin
const listRealisations = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = getPagination(req.query);
  const { featured, category } = req.query;
  const [items, total] = await Promise.all([
    RealisationModel.findAll({ skip, take, onlyFeatured: featured === 'true', category }),
    RealisationModel.count({ onlyFeatured: featured === 'true', category }),
  ]);
  return sendSuccess(res, { data: items, meta: buildMeta({ page, limit, total }) });
});

// GET /api/realisations/:slug — public
const getRealisationBySlug = asyncHandler(async (req, res) => {
  const realisation = await RealisationModel.findBySlug(req.params.slug);
  if (!realisation) throw ApiError.notFound('Réalisation introuvable.');
  return sendSuccess(res, { data: realisation });
});

// POST /api/realisations — admin
const createRealisation = asyncHandler(async (req, res) => {
  const { title, description, client, category, isFeatured, completedAt } = req.body;
  const images = req.files?.length
    ? req.files.map((f) => `/uploads/images/${f.filename}`)
    : req.body.images || [];
  const realisation = await RealisationModel.create({
    title,
    slug: slugify(title),
    description,
    client,
    category,
    images,
    isFeatured,
    completedAt: completedAt ? new Date(completedAt) : undefined,
  });
  return sendSuccess(res, { statusCode: 201, data: realisation, message: 'Réalisation créée.' });
});

// PUT /api/realisations/:id — admin
const updateRealisation = asyncHandler(async (req, res) => {
  const existing = await RealisationModel.findById(req.params.id);
  if (!existing) throw ApiError.notFound('Réalisation introuvable.');

  const { title, description, client, category, isFeatured, completedAt } = req.body;
  const images = req.files?.length
    ? req.files.map((f) => `/uploads/images/${f.filename}`)
    : req.body.images;
  const realisation = await RealisationModel.update(req.params.id, {
    ...(title && { title, slug: slugify(title) }),
    ...(description && { description }),
    ...(client !== undefined && { client }),
    ...(category !== undefined && { category }),
    ...(images !== undefined && { images }),
    ...(isFeatured !== undefined && { isFeatured }),
    ...(completedAt !== undefined && { completedAt: new Date(completedAt) }),
  });
  return sendSuccess(res, { data: realisation, message: 'Réalisation mise à jour.' });
});

// DELETE /api/realisations/:id — admin
const deleteRealisation = asyncHandler(async (req, res) => {
  await RealisationModel.remove(req.params.id);
  return sendSuccess(res, { message: 'Réalisation supprimée.' });
});

module.exports = {
  listRealisations,
  getRealisationBySlug,
  createRealisation,
  updateRealisation,
  deleteRealisation,
};
