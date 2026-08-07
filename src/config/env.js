require('dotenv').config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  return value;
}

const env = {
  NODE_ENV: required('NODE_ENV', 'development'),
  PORT: parseInt(required('PORT', '5000'), 10),
  HOST: required('HOST', '0.0.0.0'),

  DATABASE_URL: required('DATABASE_URL', ''),

  JWT_SECRET: required('JWT_SECRET', 'change-me-in-production'),
  JWT_EXPIRES_IN: required('JWT_EXPIRES_IN', '1d'),

  CLIENT_URL: required('CLIENT_URL', 'http://localhost:3000'),
  CORS_ORIGINS: required('CORS_ORIGINS', 'http://localhost:3000'),

  SMTP_HOST: required('SMTP_HOST', ''),
  SMTP_PORT: parseInt(required('SMTP_PORT', '587'), 10),
  SMTP_SECURE: required('SMTP_SECURE', 'false') === 'true',
  SMTP_USER: required('SMTP_USER', ''),
  SMTP_PASSWORD: required('SMTP_PASSWORD', ''),
  MAIL_FROM: required('MAIL_FROM', 'no-reply@azelie.com'),
  MAIL_TO_ADMIN: required('MAIL_TO_ADMIN', ''),

  MAX_FILE_SIZE_MB: parseInt(required('MAX_FILE_SIZE_MB', '5'), 10),
  UPLOAD_DIR: required('UPLOAD_DIR', 'uploads'),

  RATE_LIMIT_WINDOW_MS: parseInt(required('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  RATE_LIMIT_MAX: parseInt(required('RATE_LIMIT_MAX', '100'), 10),
};

module.exports = env;
