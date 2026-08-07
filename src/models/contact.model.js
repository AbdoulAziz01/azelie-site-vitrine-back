const { prisma } = require('../config/db');

const ContactModel = {
  create: (data) => prisma.contact.create({ data }),
  findAll: ({ skip, take, status } = {}) =>
    prisma.contact.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
  count: ({ status } = {}) => prisma.contact.count({ where: status ? { status } : undefined }),
  findById: (id) => prisma.contact.findUnique({ where: { id } }),
  updateStatus: (id, status) => prisma.contact.update({ where: { id }, data: { status } }),
  remove: (id) => prisma.contact.delete({ where: { id } }),
};

module.exports = ContactModel;
