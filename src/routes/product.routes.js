const express = require('express');
const productController = require('../controllers/product.controller');
const productValidator = require('../validators/product.validator');
const validate = require('../middlewares/validate');
const { requireAuth, optionalAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/', optionalAuth, productController.listProducts);
router.get('/:slug', productValidator.slugParam, validate, productController.getProductBySlug);
router.post('/', requireAuth, upload.multiple('images'), productValidator.createProduct, validate, productController.createProduct);
router.put('/:id', requireAuth, upload.multiple('images'), productValidator.updateProduct, validate, productController.updateProduct);
router.delete('/:id', requireAuth, productValidator.idParam, validate, productController.deleteProduct);

module.exports = router;
