const QuoteModel = require('../models/quote.model');
const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');
const emailService = require('../services/email.service');

// POST /api/quotes — public
const submitQuote = asyncHandler(async (req, res) => {
  const { fullName, email, phone, company, projectType, budget, description } = req.body;
  const quote = await QuoteModel.create({ fullName, email, phone, company, projectType, budget, description });
  emailService.notifyAdminNewQuote(quote).catch(() => {});
  return sendSuccess(res, { statusCode: 201, data: quote, message: 'Votre demande de devis a bien été envoyée.' });
});

// GET /api/quotes — admin
const listQuotes = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = getPagination(req.query);
  const { status } = req.query;
  const [items, total] = await Promise.all([
    QuoteModel.findAll({ skip, take, status }),
    QuoteModel.count({ status }),
  ]);
  return sendSuccess(res, { data: items, meta: buildMeta({ page, limit, total }) });
});

// GET /api/quotes/:id — admin
const getQuote = asyncHandler(async (req, res) => {
  const quote = await QuoteModel.findById(req.params.id);
  if (!quote) throw ApiError.notFound('Demande de devis introuvable.');
  return sendSuccess(res, { data: quote });
});

// PATCH /api/quotes/:id/status — admin
const updateQuoteStatus = asyncHandler(async (req, res) => {
  const quote = await QuoteModel.updateStatus(req.params.id, req.body.status);
  return sendSuccess(res, { data: quote, message: 'Statut mis à jour.' });
});

// DELETE /api/quotes/:id — admin
const deleteQuote = asyncHandler(async (req, res) => {
  await QuoteModel.remove(req.params.id);
  return sendSuccess(res, { message: 'Demande de devis supprimée.' });
});

module.exports = { submitQuote, listQuotes, getQuote, updateQuoteStatus, deleteQuote };
