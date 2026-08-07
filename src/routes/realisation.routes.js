const express = require('express');
const realisationController = require('../controllers/realisation.controller');
const realisationValidator = require('../validators/realisation.validator');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/', realisationController.listRealisations);
router.get('/:slug', realisationValidator.slugParam, validate, realisationController.getRealisationBySlug);
router.post('/', requireAuth, upload.multiple('images'), realisationValidator.createRealisation, validate, realisationController.createRealisation);
router.put('/:id', requireAuth, upload.multiple('images'), realisationValidator.updateRealisation, validate, realisationController.updateRealisation);
router.delete('/:id', requireAuth, realisationValidator.idParam, validate, realisationController.deleteRealisation);

module.exports = router;
