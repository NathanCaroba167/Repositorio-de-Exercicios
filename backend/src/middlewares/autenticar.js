const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const dados = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = dados;
        next();
    } catch {
        res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
}

function soProfessor(req, res, next) {
    if (req.usuario.tipo !== 'professor') {
        return res.status(403).json({ erro: 'Acesso restrito a professores' });
    }
    next();
}

module.exports = { autenticar, soProfessor };