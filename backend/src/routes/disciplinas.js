const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const r = await pool.query(
            `SELECT d.id, d.nome, d.codigo, d.cor, u.nome AS professor
       FROM disciplinas d
       JOIN usuarios u ON d.professor_id = u.id
       ORDER BY d.nome`
        );
        res.json(r.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;