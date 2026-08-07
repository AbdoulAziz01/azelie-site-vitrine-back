const ServiceModel = require('../models/service.model');
const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');
const slugify = require('../utils/slugify');

// GET /api/services — public
const listServices = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = getPagination(req.query);
  const onlyActive = !req.admin;
  const [items, total] = await Promise.all([
    ServiceModel.findAll({ skip, take, onlyActive }),
    ServiceModel.count({ onlyActive }),
  ]);
  return sendSuccess(res, { data: items, meta: buildMeta({ page, limit, total }) });
});

// GET /api/services/:slug — public
const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await ServiceModel.findBySlug(req.params.slug);
  if (!service) throw ApiError.notFound('Service introuvable.');
  return sendSuccess(res, { data: service });
});

// POST /api/services — admin
const createService = asyncHandler(async (req, res) => {
  const { title, description, icon, order, isActive } = req.body;
  const image = req.file ? `/uploads/images/${req.file.filename}` : req.body.image;
  const service = await ServiceModel.create({
    title,
    slug: slugify(title),
    description,
    icon,
    image,
    order: order !== undefined ? Number(order) : undefined,
    isActive,
  });
  return sendSuccess(res, { statusCode: 201, data: service, message: 'Service créé.' });
});

// PUT /api/services/:id — admin
const updateService = asyncHandler(async (req, res) => {
  const existing = await ServiceModel.findById(req.params.id);
  if (!existing) throw ApiError.notFound('Service introuvable.');

  const { title, description, icon, order, isActive } = req.body;
  const image = req.file ? `/uploads/images/${req.file.filename}` : req.body.image;
  const service = await ServiceModel.update(req.params.id, {
    ...(title && { title, slug: slugify(title) }),
    ...(description && { description }),
    ...(icon !== undefined && { icon }),
    ...(image !== undefined && { image }),
    ...(order !== undefined && { order: Number(order) }),
    ...(isActive !== undefined && { isActive }),
  });
  return sendSuccess(res, { data: service, message: 'Service mis à jour.' });
});

// DELETE /api/services/:id — admin
const deleteService = asyncHandler(async (req, res) => {
  await ServiceModel.remove(req.params.id);
  return sendSuccess(res, { message: 'Service supprimé.' });
});

module.exports = { listServices, getServiceBySlug, createService, updateService, deleteService };
