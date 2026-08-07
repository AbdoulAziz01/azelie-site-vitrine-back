const { prisma } = require('../config/db');

const RealisationModel = {
  create: (data) => prisma.realisation.create({ data }),
  findAll: ({ skip, take, onlyFeatured, category } = {}) =>
    prisma.realisation.findMany({
      where: {
        ...(onlyFeatured ? { isFeatured: true } : {}),
        ...(category ? { category } : {}),
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
  count: ({ onlyFeatured, category } = {}) =>
    prisma.realisation.count({
      where: {
        ...(onlyFeatured ? { isFeatured: true } : {}),
        ...(category ? { category } : {}),
      },
    }),
  findById: (id) => prisma.realisation.findUnique({ where: { id } }),
  findBySlug: (slug) => prisma.realisation.findUnique({ where: { slug } }),
  update: (id, data) => prisma.realisation.update({ where: { id }, data }),
  remove: (id) => prisma.realisation.delete({ where: { id } }),
};

module.exports = RealisationModel;
