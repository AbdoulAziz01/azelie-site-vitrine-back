const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const { connectDatabase, disconnectDatabase } = require('./config/db');

let server;

async function start() {
  await connectDatabase();
  server = app.listen(env.PORT, env.HOST, () => {
    logger.info(`Serveur démarré sur ${env.HOST}:${env.PORT} (${env.NODE_ENV})`);
  });
}

async function shutdown(signal) {
  logger.info(`${signal} reçu, arrêt du serveur...`);
  if (server) {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

start();
