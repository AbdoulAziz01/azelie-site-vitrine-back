const ContactModel = require('../models/contact.model');
const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');
const emailService = require('../services/email.service');

// POST /api/contact — public
const submitContact = asyncHandler(async (req, res) => {
  const { fullName, email, phone, subject, message } = req.body;
  const contact = await ContactModel.create({ fullName, email, phone, subject, message });
  emailService.notifyAdminNewContact(contact).catch(() => {});
  return sendSuccess(res, { statusCode: 201, data: contact, message: 'Votre message a bien été envoyé.' });
});

// GET /api/contact — admin
const listContacts = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = getPagination(req.query);
  const { status } = req.query;
  const [items, total] = await Promise.all([
    ContactModel.findAll({ skip, take, status }),
    ContactModel.count({ status }),
  ]);
  return sendSuccess(res, { data: items, meta: buildMeta({ page, limit, total }) });
});

// GET /api/contact/:id — admin
const getContact = asyncHandler(async (req, res) => {
  const contact = await ContactModel.findById(req.params.id);
  if (!contact) throw ApiError.notFound('Message de contact introuvable.');
  return sendSuccess(res, { data: contact });
});

// PATCH /api/contact/:id/status — admin
const updateContactStatus = asyncHandler(async (req, res) => {
  const contact = await ContactModel.updateStatus(req.params.id, req.body.status);
  return sendSuccess(res, { data: contact, message: 'Statut mis à jour.' });
});

// DELETE /api/contact/:id — admin
const deleteContact = asyncHandler(async (req, res) => {
  await ContactModel.remove(req.params.id);
  return sendSuccess(res, { message: 'Message supprimé.' });
});

module.exports = { submitContact, listContacts, getContact, updateContactStatus, deleteContact };
