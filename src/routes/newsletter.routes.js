const express = require('express');
const newsletterController = require('../controllers/newsletter.controller');
const newsletterValidator = require('../validators/newsletter.validator');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { strictLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/subscribe', strictLimiter, newsletterValidator.subscribe, validate, newsletterController.subscribe);
router.post('/unsubscribe', strictLimiter, newsletterValidator.unsubscribe, validate, newsletterController.unsubscribe);
router.get('/', requireAuth, newsletterController.listSubscribers);
router.delete('/:id', requireAuth, newsletterValidator.idParam, validate, newsletterController.deleteSubscriber);

module.exports = router;
