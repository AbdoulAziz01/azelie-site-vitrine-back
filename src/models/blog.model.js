const { prisma } = require('../config/db');

const BlogModel = {
  create: (data) => prisma.blogPost.create({ data }),
  findAll: ({ skip, take, onlyPublished, tag } = {}) =>
    prisma.blogPost.findMany({
      where: {
        ...(onlyPublished ? { isPublished: true } : {}),
        ...(tag ? { tags: { has: tag } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
  count: ({ onlyPublished, tag } = {}) =>
    prisma.blogPost.count({
      where: {
        ...(onlyPublished ? { isPublished: true } : {}),
        ...(tag ? { tags: { has: tag } } : {}),
      },
    }),
  findById: (id) => prisma.blogPost.findUnique({ where: { id } }),
  findBySlug: (slug) => prisma.blogPost.findUnique({ where: { slug } }),
  update: (id, data) => prisma.blogPost.update({ where: { id }, data }),
  remove: (id) => prisma.blogPost.delete({ where: { id } }),
};

module.exports = BlogModel;
