const express = require('express');
const faqController = require('../controllers/faq.controller');
const faqValidator = require('../validators/faq.validator');
const validate = require('../middlewares/validate');
const { requireAuth, optionalAuth } = require('../middlewares/auth');

const router = express.Router();

router.get('/', optionalAuth, faqController.listFaqs);
router.post('/', requireAuth, faqValidator.createFaq, validate, faqController.createFaq);
router.put('/:id', requireAuth, faqValidator.updateFaq, validate, faqController.updateFaq);
router.delete('/:id', requireAuth, faqValidator.idParam, validate, faqController.deleteFaq);

module.exports = router;
