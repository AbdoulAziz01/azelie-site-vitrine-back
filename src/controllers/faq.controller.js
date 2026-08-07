const FaqModel = require('../models/faq.model');
const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');

// GET /api/faqs — public/admin
const listFaqs = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = getPagination(req.query);
  const onlyActive = !req.admin;
  const { category } = req.query;
  const [items, total] = await Promise.all([
    FaqModel.findAll({ skip, take, onlyActive, category }),
    FaqModel.count({ onlyActive, category }),
  ]);
  return sendSuccess(res, { data: items, meta: buildMeta({ page, limit, total }) });
});

// POST /api/faqs — admin
const createFaq = asyncHandler(async (req, res) => {
  const { question, answer, category, order, isActive } = req.body;
  const faq = await FaqModel.create({
    question,
    answer,
    category,
    order: order !== undefined ? Number(order) : undefined,
    isActive,
  });
  return sendSuccess(res, { statusCode: 201, data: faq, message: 'FAQ créée.' });
});

// PUT /api/faqs/:id — admin
const updateFaq = asyncHandler(async (req, res) => {
  const existing = await FaqModel.findById(req.params.id);
  if (!existing) throw ApiError.notFound('FAQ introuvable.');

  const { question, answer, category, order, isActive } = req.body;
  const faq = await FaqModel.update(req.params.id, {
    ...(question && { question }),
    ...(answer && { answer }),
    ...(category !== undefined && { category }),
    ...(order !== undefined && { order: Number(order) }),
    ...(isActive !== undefined && { isActive }),
  });
  return sendSuccess(res, { data: faq, message: 'FAQ mise à jour.' });
});

// DELETE /api/faqs/:id — admin
const deleteFaq = asyncHandler(async (req, res) => {
  await FaqModel.remove(req.params.id);
  return sendSuccess(res, { message: 'FAQ supprimée.' });
});

module.exports = { listFaqs, createFaq, updateFaq, deleteFaq };
