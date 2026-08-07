const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env');

function generateToken(admin) {
  return jwt.sign(
    { sub: admin.id, email: admin.email, role: admin.role, fullName: admin.fullName },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
}

function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

module.exports = { generateToken, hashPassword, comparePassword };
