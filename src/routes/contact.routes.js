const express = require('express');
const contactController = require('../controllers/contact.controller');
const contactValidator = require('../validators/contact.validator');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { strictLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/', strictLimiter, contactValidator.createContact, validate, contactController.submitContact);
router.get('/', requireAuth, contactController.listContacts);
router.get('/:id', requireAuth, contactValidator.idParam, validate, contactController.getContact);
router.patch('/:id/status', requireAuth, contactValidator.updateStatus, validate, contactController.updateContactStatus);
router.delete('/:id', requireAuth, contactValidator.idParam, validate, contactController.deleteContact);

module.exports = router;
