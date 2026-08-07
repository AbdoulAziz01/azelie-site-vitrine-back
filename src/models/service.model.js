const { prisma } = require('../config/db');

const ServiceModel = {
  create: (data) => prisma.service.create({ data }),
  findAll: ({ skip, take, onlyActive } = {}) =>
    prisma.service.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: { order: 'asc' },
      skip,
      take,
    }),
  count: ({ onlyActive } = {}) => prisma.service.count({ where: onlyActive ? { isActive: true } : undefined }),
  findById: (id) => prisma.service.findUnique({ where: { id } }),
  findBySlug: (slug) => prisma.service.findUnique({ where: { slug } }),
  update: (id, data) => prisma.service.update({ where: { id }, data }),
  remove: (id) => prisma.service.delete({ where: { id } }),
};

module.exports = ServiceModel;
