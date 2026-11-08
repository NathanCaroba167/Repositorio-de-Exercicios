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

// Quem vê o quê num exercício:
//  - o próprio aluno vê as dele
//  - o professor da disciplina vê todas
//  - qualquer logado vê só as respondidas E marcadas como públicas, sem o nome do autor
async function listarPorExercicio(req, res) {
    try {
        const { exercicio_id } = req.query;
        if (!exercicio_id) {
            return res.status(400).json({ erro: 'Informe exercicio_id' });
        }
        const r = await pool.query(
            `SELECT du.id, du.pergunta, du.resposta, du.publica, du.criado_em, du.respondido_em,
                    CASE WHEN du.aluno_id = $2 OR d.professor_id = $2 THEN u.nome END AS aluno
             FROM duvidas du
                      JOIN exercicios e ON du.exercicio_id = e.id
                      JOIN disciplinas d ON e.disciplina_id = d.id
                      JOIN usuarios u ON du.aluno_id = u.id
             WHERE du.exercicio_id = $1
               AND (du.aluno_id = $2
                 OR d.professor_id = $2
                 OR (du.publica = TRUE AND du.resposta IS NOT NULL))
             ORDER BY du.criado_em DESC`,
            [exercicio_id, req.usuario.id]
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

// Professor responde (só dúvidas das suas disciplinas) e decide se fica pública
async function responder(req, res) {
    try {
        const { id } = req.params;
        const { resposta, publica } = req.body;
        if (!resposta || !resposta.trim()) {
            return res.status(400).json({ erro: 'Informe a resposta' });
        }
        const r = await pool.query(
            `UPDATE duvidas
             SET resposta = $1, respondido_em = NOW(), publica = $2, lida = TRUE
             WHERE id = $3 AND exercicio_id IN (
                 SELECT e.id FROM exercicios e
                                      JOIN disciplinas d ON e.disciplina_id = d.id
                 WHERE d.professor_id = $4
             )
                 RETURNING *`,
            [resposta.trim(), publica === true, id, req.usuario.id]
        );
        if (!r.rows.length) {
            return res.status(404).json({ erro: 'Dúvida não encontrada para as suas disciplinas' });
        }
        res.json(r.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// Professor: dúvidas de UMA disciplina sua, pendentes ou respondidas
async function doProfessor(req, res) {
    try {
        const disciplinaId = Number(req.query.disciplina_id);
        if (!Number.isInteger(disciplinaId)) {
            return res.status(400).json({ erro: 'Informe disciplina_id' });
        }
        const respondidas = req.query.status === 'respondidas';
        const r = await pool.query(
            `SELECT du.id, du.pergunta, du.resposta, du.publica, du.lida, du.criado_em,
              e.id AS exercicio_id, e.titulo AS exercicio_titulo, e.aula,
              u.nome AS aluno
       FROM duvidas du
       JOIN exercicios e ON du.exercicio_id = e.id
       JOIN disciplinas d ON e.disciplina_id = d.id
       JOIN usuarios u ON du.aluno_id = u.id
       WHERE d.id = $1 AND d.professor_id = $2
         AND du.resposta IS ${respondidas ? 'NOT NULL' : 'NULL'}
       ORDER BY du.criado_em ${respondidas ? 'DESC' : 'ASC'}`,
            [disciplinaId, req.usuario.id]
        );
        res.json(r.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// Aluno: todas as dúvidas que ele mandou
async function minhas(req, res) {
    try {
        const r = await pool.query(
            `SELECT du.id, du.pergunta, du.resposta, du.resolvida, du.criado_em, du.respondido_em,
              e.id AS exercicio_id, e.titulo AS exercicio_titulo, e.aula,
              d.id AS disciplina_id, d.nome AS disciplina
       FROM duvidas du
       JOIN exercicios e ON du.exercicio_id = e.id
       JOIN disciplinas d ON e.disciplina_id = d.id
       WHERE du.aluno_id = $1
       ORDER BY du.criado_em DESC`,
            [req.usuario.id]
        );
        res.json(r.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// Professor marca como lida (só das suas disciplinas)
async function marcarLida(req, res) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ erro: 'ID inválido' });
        const r = await pool.query(
            `UPDATE duvidas SET lida = TRUE
       WHERE id = $1 AND exercicio_id IN (
         SELECT e.id FROM exercicios e
         JOIN disciplinas d ON e.disciplina_id = d.id
         WHERE d.professor_id = $2
       )
       RETURNING id, lida`,
            [id, req.usuario.id]
        );
        if (!r.rows.length) {
            return res.status(404).json({ erro: 'Dúvida não encontrada para as suas disciplinas' });
        }
        res.json(r.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// Aluno marca "Entendi" (só na própria dúvida, e só depois de respondida)
async function marcarResolvida(req, res) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ erro: 'ID inválido' });
        const r = await pool.query(
            `UPDATE duvidas SET resolvida = TRUE
       WHERE id = $1 AND aluno_id = $2 AND resposta IS NOT NULL
       RETURNING id, resolvida`,
            [id, req.usuario.id]
        );
        if (!r.rows.length) {
            return res.status(404).json({ erro: 'Dúvida não encontrada ou ainda sem resposta' });
        }
        res.json(r.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

module.exports = {
    criar, listarPorExercicio, pendentes, doProfessor, minhas,
    responder, marcarLida, marcarResolvida,
};