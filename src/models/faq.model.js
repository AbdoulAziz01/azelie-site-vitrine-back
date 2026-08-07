const { prisma } = require('../config/db');

const FaqModel = {
  create: (data) => prisma.faq.create({ data }),
  findAll: ({ skip, take, onlyActive, category } = {}) =>
    prisma.faq.findMany({
      where: {
        ...(onlyActive ? { isActive: true } : {}),
        ...(category ? { category } : {}),
      },
      orderBy: { order: 'asc' },
      skip,
      take,
    }),
  count: ({ onlyActive, category } = {}) =>
    prisma.faq.count({
      where: {
        ...(onlyActive ? { isActive: true } : {}),
        ...(category ? { category } : {}),
      },
    }),
  findById: (id) => prisma.faq.findUnique({ where: { id } }),
  update: (id, data) => prisma.faq.update({ where: { id }, data }),
  remove: (id) => prisma.faq.delete({ where: { id } }),
};

module.exports = FaqModel;
