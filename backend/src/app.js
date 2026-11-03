const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./docs/openapi');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não definido no .env');
}

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));

app.use(express.json());

require('./config/database');

const limiteAuth = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test',
    message: { erro: 'Muitas tentativas. Tente novamente em alguns minutos.' },
});

app.use('/api/auth', limiteAuth, require('./routes/auth'));
app.use('/api/exercicios', require('./routes/exercicios'));
app.use('/api/duvidas', require('./routes/duvidas'));
app.use('/api/disciplinas', require('./routes/disciplinas'));
app.use('/api/referencias', require('./routes/referencias'));
app.use('/api/progresso', require('./routes/progresso'));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor Exercita rodando!' });
});

app.get('/api/docs.json', (req, res) => res.json(openapi));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi));

module.exports = app;