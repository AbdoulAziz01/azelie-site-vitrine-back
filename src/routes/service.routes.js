const express = require('express');
const serviceController = require('../controllers/service.controller');
const serviceValidator = require('../validators/service.validator');
const validate = require('../middlewares/validate');
const { requireAuth, optionalAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/', optionalAuth, serviceController.listServices);
router.get('/:slug', serviceValidator.slugParam, validate, serviceController.getServiceBySlug);
router.post('/', requireAuth, upload.single('image'), serviceValidator.createService, validate, serviceController.createService);
router.put('/:id', requireAuth, upload.single('image'), serviceValidator.updateService, validate, serviceController.updateService);
router.delete('/:id', requireAuth, serviceValidator.idParam, validate, serviceController.deleteService);

module.exports = router;
