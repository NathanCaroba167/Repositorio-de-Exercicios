const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

require('./config/database');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/exercicios', require('./routes/exercicios'));
app.use('/api/duvidas', require('./routes/duvidas'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor Exercita rodando!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});