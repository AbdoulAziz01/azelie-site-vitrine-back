const express = require('express');

const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/contact', require('./contact.routes'));
router.use('/quotes', require('./quote.routes'));
router.use('/newsletter', require('./newsletter.routes'));
router.use('/services', require('./service.routes'));
router.use('/products', require('./product.routes'));
router.use('/realisations', require('./realisation.routes'));
router.use('/blog', require('./blog.routes'));
router.use('/testimonials', require('./testimonial.routes'));
router.use('/faqs', require('./faq.routes'));

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API opérationnelle', timestamp: new Date().toISOString() });
});

module.exports = router;
