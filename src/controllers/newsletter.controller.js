const NewsletterModel = require('../models/newsletter.model');
const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');
const emailService = require('../services/email.service');

// POST /api/newsletter/subscribe — public
const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const subscriber = await NewsletterModel.subscribe(email);
  emailService.sendNewsletterWelcome(email).catch(() => {});
  return sendSuccess(res, { statusCode: 201, data: subscriber, message: 'Inscription à la newsletter réussie.' });
});

// POST /api/newsletter/unsubscribe — public
const unsubscribe = asyncHandler(async (req, res) => {
  const existing = await NewsletterModel.findByEmail(req.body.email);
  if (!existing) throw ApiError.notFound('Cette adresse email n\'est pas inscrite.');
  await NewsletterModel.unsubscribe(req.body.email);
  return sendSuccess(res, { message: 'Désinscription réussie.' });
});

// GET /api/newsletter — admin
const listSubscribers = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = getPagination(req.query);
  const [items, total] = await Promise.all([
    NewsletterModel.findAll({ skip, take }),
    NewsletterModel.count(),
  ]);
  return sendSuccess(res, { data: items, meta: buildMeta({ page, limit, total }) });
});

// DELETE /api/newsletter/:id — admin
const deleteSubscriber = asyncHandler(async (req, res) => {
  await NewsletterModel.remove(req.params.id);
  return sendSuccess(res, { message: 'Abonné supprimé.' });
});

module.exports = { subscribe, unsubscribe, listSubscribers, deleteSubscriber };
