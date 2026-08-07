const { prisma } = require('../config/db');

const NewsletterModel = {
  findByEmail: (email) => prisma.newsletterSubscriber.findUnique({ where: { email } }),
  subscribe: (email) =>
    prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isSubscribed: true },
      create: { email },
    }),
  unsubscribe: (email) =>
    prisma.newsletterSubscriber.update({ where: { email }, data: { isSubscribed: false } }),
  findAll: ({ skip, take } = {}) =>
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' }, skip, take }),
  count: () => prisma.newsletterSubscriber.count(),
  remove: (id) => prisma.newsletterSubscriber.delete({ where: { id } }),
};

module.exports = NewsletterModel;
