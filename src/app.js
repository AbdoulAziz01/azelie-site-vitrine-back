const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const env = require('./config/env');
const corsOptions = require('./config/corsOptions');
const routes = require('./routes');
const { globalLimiter } = require('./middlewares/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();

app.set('trust proxy', 1);

// Sécurité HTTP de base.
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());

// Logs HTTP (format concis en prod, détaillé en dev).
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  stream: { write: (msg) => logger.info(msg.trim()) },
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Fichiers statiques uploadés (images services/produits/réalisations/blog/témoignages).
app.use('/uploads', express.static(path.join(process.cwd(), env.UPLOAD_DIR)));

// Rate limiting global sur toute l'API.
app.use('/api', globalLimiter);

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Bienvenue sur l\'API Azélie', docs: '/api/health' });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
