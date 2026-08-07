const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const env = require('./env');
const ApiError = require('../utils/ApiError');

const IMAGE_DIR = path.join(process.cwd(), env.UPLOAD_DIR, 'images');
const DOCUMENT_DIR = path.join(process.cwd(), env.UPLOAD_DIR, 'documents');

[IMAGE_DIR, DOCUMENT_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function buildStorage(destination) {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, destination),
    filename: (req, file, cb) => {
      const uniqueSuffix = crypto.randomBytes(8).toString('hex');
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
    },
  });
}

function imageFileFilter(req, file, cb) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return cb(new ApiError(400, 'Format de fichier non supporté. Formats acceptés: JPEG, PNG, WEBP, GIF.'));
  }
  cb(null, true);
}

const uploadImage = multer({
  storage: buildStorage(IMAGE_DIR),
  fileFilter: imageFileFilter,
  limits: { fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024 },
});

module.exports = { uploadImage, IMAGE_DIR, DOCUMENT_DIR };
