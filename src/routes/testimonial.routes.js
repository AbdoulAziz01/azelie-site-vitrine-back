const express = require('express');
const testimonialController = require('../controllers/testimonial.controller');
const testimonialValidator = require('../validators/testimonial.validator');
const validate = require('../middlewares/validate');
const { requireAuth, optionalAuth } = require('../middlewares/auth');
const { strictLimiter } = require('../middlewares/rateLimiter');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/', optionalAuth, testimonialController.listTestimonials);
router.post('/', strictLimiter, upload.single('photo'), testimonialValidator.createTestimonial, validate, testimonialController.createTestimonial);
router.put('/:id', requireAuth, upload.single('photo'), testimonialValidator.updateTestimonial, validate, testimonialController.updateTestimonial);
router.delete('/:id', requireAuth, testimonialValidator.idParam, validate, testimonialController.deleteTestimonial);

module.exports = router;
