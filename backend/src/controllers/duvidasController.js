const pool = require('../config/database');

// Aluno cria uma dúvida
async function criar(req, res) {
    try {
        if (req.usuario.tipo !== 'aluno') {
            return res.status(403).json({ erro: 'Apenas alunos podem enviar dúvidas' });
        }
        const { exercicio_id, pergunta } = req.body;
        if (!exercicio_id || !pergunta || !pergunta.trim()) {
            return res.status(400).json({ erro: 'Informe exercicio_id e pergunta' });
        }
        const r = await pool.query(
            `INSERT INTO duvidas (pergunta, exercicio_id, aluno_id)
       VALUES ($1, $2, $3) RETURNING *`,
            [pergunta.trim(), exercicio_id, req.usuario.id]
        );
        res.status(201).json(r.rows[0]);
    } catch (err) {
        if (err.code === '23503') {
            return res.status(404).json({ erro: 'Exercício não encontrado' });
        }
        res.status(500).json({ erro: err.message });
    }
}

// Lista as dúvidas de um exercício
async function listarPorExercicio(req, res) {
    try {
        const { exercicio_id } = req.query;
        if (!exercicio_id) {
            return res.status(400).json({ erro: 'Informe exercicio_id' });
        }
        const r = await pool.query(
            `SELECT du.id, du.pergunta, du.resposta, du.criado_em, du.respondido_em,
              u.nome AS aluno
       FROM duvidas du
       JOIN usuarios u ON du.aluno_id = u.id
       WHERE du.exercicio_id = $1
       ORDER BY du.criado_em DESC`,
            [exercicio_id]
        );
        res.json(r.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// Professor vê as pendentes das suas disciplinas
async function pendentes(req, res) {
    try {
        const r = await pool.query(
            `SELECT du.id, du.pergunta, du.criado_em,
              e.id AS exercicio_id, e.titulo,
              d.nome AS disciplina, u.nome AS aluno
       FROM duvidas du
       JOIN exercicios e ON du.exercicio_id = e.id
       JOIN disciplinas d ON e.disciplina_id = d.id
       JOIN usuarios u ON du.aluno_id = u.id
       WHERE d.professor_id = $1 AND du.resposta IS NULL
       ORDER BY du.criado_em ASC`,
            [req.usuario.id]
        );
        res.json(r.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// Professor responde (só dúvidas das suas disciplinas)
async function responder(req, res) {
    try {
        const { id } = req.params;
        const { resposta } = req.body;
        if (!resposta || !resposta.trim()) {
            return res.status(400).json({ erro: 'Informe a resposta' });
        }
        const r = await pool.query(
            `UPDATE duvidas SET resposta = $1, respondido_em = NOW()
       WHERE id = $2 AND exercicio_id IN (
         SELECT e.id FROM exercicios e
         JOIN disciplinas d ON e.disciplina_id = d.id
         WHERE d.professor_id = $3
       )
       RETURNING *`,
            [resposta.trim(), id, req.usuario.id]
        );
        if (!r.rows.length) {
            return res.status(404).json({ erro: 'Dúvida não encontrada para as suas disciplinas' });
        }
        res.json(r.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

module.exports = { criar, listarPorExercicio, pendentes, responder };