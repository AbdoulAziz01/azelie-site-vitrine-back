const { uploadImage } = require('../config/multer');

// Upload d'une seule image (ex: cover, photo).
const single = (fieldName) => uploadImage.single(fieldName);

// Upload de plusieurs images (ex: galeries produits/réalisations).
const multiple = (fieldName, maxCount = 10) => uploadImage.array(fieldName, maxCount);

module.exports = { single, multiple };
