const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Cadastro
async function cadastrar(req, res) {
    try {
        const { nome, email, senha, tipo } = req.body;

        // Verifica se email já existe
        const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
        if (existe.rows.length) {
            return res.status(400).json({ erro: 'E-mail já cadastrado' });
        }

        // Gera o hash da senha
        const senha_hash = await bcrypt.hash(senha, 10);

        const resultado = await pool.query(
            `INSERT INTO usuarios (nome, email, senha_hash, tipo)
       VALUES ($1, $2, $3, $4) RETURNING id, nome, email, tipo`,
            [nome, email, senha_hash, tipo]
        );

        const usuario = resultado.rows[0];
        const token = jwt.sign(
            { id: usuario.id, tipo: usuario.tipo },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ usuario, token });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// Login
async function login(req, res) {
    try {
        const { email, senha } = req.body;

        const resultado = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        if (!resultado.rows.length) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
        }

        const usuario = resultado.rows[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
        }

        const token = jwt.sign(
            { id: usuario.id, tipo: usuario.tipo },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
            token
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

module.exports = { cadastrar, login };