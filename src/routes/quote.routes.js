const express = require('express');
const quoteController = require('../controllers/quote.controller');
const quoteValidator = require('../validators/quote.validator');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { strictLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/', strictLimiter, quoteValidator.createQuote, validate, quoteController.submitQuote);
router.get('/', requireAuth, quoteController.listQuotes);
router.get('/:id', requireAuth, quoteValidator.idParam, validate, quoteController.getQuote);
router.patch('/:id/status', requireAuth, quoteValidator.updateStatus, validate, quoteController.updateQuoteStatus);
router.delete('/:id', requireAuth, quoteValidator.idParam, validate, quoteController.deleteQuote);

module.exports = router;
