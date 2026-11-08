const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { autenticar, soProfessor } = require('../middlewares/autenticar');

// Disciplinas do professor logado (o painel usa para escolher onde trabalhar)
router.get('/minhas', autenticar, soProfessor, async (req, res) => {
    try {
        const r = await pool.query(
            'SELECT id, nome, codigo, cor FROM disciplinas WHERE professor_id = $1 ORDER BY nome',
            [req.usuario.id]
        );
        res.json(r.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;