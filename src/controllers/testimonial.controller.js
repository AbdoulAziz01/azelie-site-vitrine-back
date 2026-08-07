const TestimonialModel = require('../models/testimonial.model');
const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');

// GET /api/testimonials — public/admin
const listTestimonials = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = getPagination(req.query);
  const onlyActive = !req.admin;
  const [items, total] = await Promise.all([
    TestimonialModel.findAll({ skip, take, onlyActive }),
    TestimonialModel.count({ onlyActive }),
  ]);
  return sendSuccess(res, { data: items, meta: buildMeta({ page, limit, total }) });
});

// POST /api/testimonials — public (soumission client) ou admin
const createTestimonial = asyncHandler(async (req, res) => {
  const { fullName, company, message, rating } = req.body;
  const photo = req.file ? `/uploads/images/${req.file.filename}` : req.body.photo;
  // Les témoignages soumis publiquement restent inactifs jusqu'à validation admin.
  const isActive = req.admin ? req.body.isActive ?? true : false;
  const testimonial = await TestimonialModel.create({
    fullName,
    company,
    message,
    rating: rating !== undefined ? Number(rating) : undefined,
    photo,
    isActive,
  });
  return sendSuccess(res, { statusCode: 201, data: testimonial, message: 'Témoignage enregistré.' });
});

// PUT /api/testimonials/:id — admin
const updateTestimonial = asyncHandler(async (req, res) => {
  const existing = await TestimonialModel.findById(req.params.id);
  if (!existing) throw ApiError.notFound('Témoignage introuvable.');

  const { fullName, company, message, rating, isActive } = req.body;
  const photo = req.file ? `/uploads/images/${req.file.filename}` : req.body.photo;
  const testimonial = await TestimonialModel.update(req.params.id, {
    ...(fullName && { fullName }),
    ...(company !== undefined && { company }),
    ...(message && { message }),
    ...(rating !== undefined && { rating: Number(rating) }),
    ...(photo !== undefined && { photo }),
    ...(isActive !== undefined && { isActive }),
  });
  return sendSuccess(res, { data: testimonial, message: 'Témoignage mis à jour.' });
});

// DELETE /api/testimonials/:id — admin
const deleteTestimonial = asyncHandler(async (req, res) => {
  await TestimonialModel.remove(req.params.id);
  return sendSuccess(res, { message: 'Témoignage supprimé.' });
});

module.exports = { listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
