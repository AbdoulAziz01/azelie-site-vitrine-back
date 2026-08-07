const { prisma } = require('../config/db');

const AdminModel = {
  findByEmail: (email) => prisma.admin.findUnique({ where: { email } }),
  findById: (id) => prisma.admin.findUnique({ where: { id } }),
  create: (data) => prisma.admin.create({ data }),
  count: () => prisma.admin.count(),
};

module.exports = AdminModel;
