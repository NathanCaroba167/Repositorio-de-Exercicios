const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function gerarToken(usuario) {
    return jwt.sign(
        { id: usuario.id, tipo: usuario.tipo },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// Cadastro público: sempre cria aluno
async function cadastrar(req, res) {
    try {
        const { nome, senha } = req.body;
        const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

        if (!nome || !nome.trim() || !email || !senha) {
            return res.status(400).json({ erro: 'Informe nome, email e senha' });
        }
        if (!EMAIL_VALIDO.test(email)) {
            return res.status(400).json({ erro: 'E-mail inválido' });
        }
        if (typeof senha !== 'string' || senha.length < 8) {
            return res.status(400).json({ erro: 'A senha deve ter pelo menos 8 caracteres' });
        }

        const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
        if (existe.rows.length) {
            return res.status(400).json({ erro: 'E-mail já cadastrado' });
        }

        const senha_hash = await bcrypt.hash(senha, 10);

        const resultado = await pool.query(
            `INSERT INTO usuarios (nome, email, senha_hash, tipo)
       VALUES ($1, $2, $3, 'aluno') RETURNING id, nome, email, tipo`,
            [nome.trim(), email, senha_hash]
        );

        const usuario = resultado.rows[0];
        res.status(201).json({ usuario, token: gerarToken(usuario) });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// Login
async function login(req, res) {
    try {
        const { senha } = req.body;
        const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

        if (!email || !senha || typeof senha !== 'string') {
            return res.status(400).json({ erro: 'Informe email e senha' });
        }

        const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (!resultado.rows.length) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
        }

        const usuario = resultado.rows[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
        }

        res.json({
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
            token: gerarToken(usuario),
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

module.exports = { cadastrar, login };