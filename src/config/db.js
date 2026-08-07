const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

// Client Prisma unique (singleton) partagé par toute l'application.
// Aucune connexion n'est ouverte tant qu'aucune requête n'est exécutée,
// donc l'API démarre même sans DATABASE_URL valide configurée.
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('PostgreSQL connecté via Prisma');
  } catch (error) {
    logger.warn(`Base de données non connectée (${error.message}). L'API reste disponible pour les routes ne nécessitant pas de DB.`);
  }
}

async function disconnectDatabase() {
  await prisma.$disconnect();
}

module.exports = { prisma, connectDatabase, disconnectDatabase };
