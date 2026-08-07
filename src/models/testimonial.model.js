const { prisma } = require('../config/db');

const TestimonialModel = {
  create: (data) => prisma.testimonial.create({ data }),
  findAll: ({ skip, take, onlyActive } = {}) =>
    prisma.testimonial.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
  count: ({ onlyActive } = {}) => prisma.testimonial.count({ where: onlyActive ? { isActive: true } : undefined }),
  findById: (id) => prisma.testimonial.findUnique({ where: { id } }),
  update: (id, data) => prisma.testimonial.update({ where: { id }, data }),
  remove: (id) => prisma.testimonial.delete({ where: { id } }),
};

module.exports = TestimonialModel;
