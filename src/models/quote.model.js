const { prisma } = require('../config/db');

const QuoteModel = {
  create: (data) => prisma.quote.create({ data }),
  findAll: ({ skip, take, status } = {}) =>
    prisma.quote.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
  count: ({ status } = {}) => prisma.quote.count({ where: status ? { status } : undefined }),
  findById: (id) => prisma.quote.findUnique({ where: { id } }),
  updateStatus: (id, status) => prisma.quote.update({ where: { id }, data: { status } }),
  remove: (id) => prisma.quote.delete({ where: { id } }),
};

module.exports = QuoteModel;
