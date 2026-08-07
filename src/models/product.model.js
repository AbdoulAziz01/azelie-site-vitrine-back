const { prisma } = require('../config/db');

const ProductModel = {
  create: (data) => prisma.product.create({ data }),
  findAll: ({ skip, take, onlyActive, category } = {}) =>
    prisma.product.findMany({
      where: {
        ...(onlyActive ? { isActive: true } : {}),
        ...(category ? { category } : {}),
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
  count: ({ onlyActive, category } = {}) =>
    prisma.product.count({
      where: {
        ...(onlyActive ? { isActive: true } : {}),
        ...(category ? { category } : {}),
      },
    }),
  findById: (id) => prisma.product.findUnique({ where: { id } }),
  findBySlug: (slug) => prisma.product.findUnique({ where: { slug } }),
  update: (id, data) => prisma.product.update({ where: { id }, data }),
  remove: (id) => prisma.product.delete({ where: { id } }),
};

module.exports = ProductModel;
