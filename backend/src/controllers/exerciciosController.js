const pool = require('../config/database');

// Listar todos os exercícios (com filtros opcionais)
async function listar(req, res) {
    try {
        const { disciplina, dificuldade, q } = req.query;

        let query = `
      SELECT e.id, e.titulo, e.conteudo, e.descricao, e.solucao,
             e.dificuldade, e.aula, e.criado_em,
             d.nome AS disciplina, d.codigo, d.cor,
             u.nome AS professor
      FROM exercicios e
      JOIN disciplinas d ON e.disciplina_id = d.id
      JOIN usuarios u ON d.professor_id = u.id
      WHERE 1=1
    `;
        const params = [];

        if (disciplina) {
            params.push(disciplina);
            query += ` AND d.nome ILIKE $${params.length}`;
        }
        if (dificuldade) {
            params.push(dificuldade);
            query += ` AND e.dificuldade = $${params.length}`;
        }
        if (q) {
            params.push(`%${q}%`);
            query += ` AND (e.titulo ILIKE $${params.length} OR e.conteudo ILIKE $${params.length} OR e.descricao ILIKE $${params.length})`;
        }

        query += ' ORDER BY e.criado_em DESC';

        const resultado = await pool.query(query, params);
        res.json(resultado.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// Buscar um exercício por ID
async function buscarPorId(req, res) {
    try {
        const { id } = req.params;
        const resultado = await pool.query(
            `SELECT e.*, d.nome AS disciplina, d.codigo, d.cor, u.nome AS professor
       FROM exercicios e
       JOIN disciplinas d ON e.disciplina_id = d.id
       JOIN usuarios u ON d.professor_id = u.id
       WHERE e.id = $1`,
            [id]
        );
        if (!resultado.rows.length) {
            return res.status(404).json({ erro: 'Exercício não encontrado' });
        }
        res.json(resultado.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// Criar exercício (só na própria disciplina)
async function criar(req, res) {
    try {
        const { titulo, conteudo, descricao, solucao, dificuldade, aula, disciplina_id } = req.body;

        if (!titulo || !conteudo || !descricao || !solucao || !disciplina_id) {
            return res.status(400).json({ erro: 'Preencha titulo, conteudo, descricao, solucao e disciplina_id' });
        }

        const dono = await pool.query(
            'SELECT id FROM disciplinas WHERE id = $1 AND professor_id = $2',
            [disciplina_id, req.usuario.id]
        );
        if (!dono.rows.length) {
            return res.status(403).json({ erro: 'Você só pode criar exercícios nas suas disciplinas' });
        }

        const resultado = await pool.query(
            `INSERT INTO exercicios (titulo, conteudo, descricao, solucao, dificuldade, aula, disciplina_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [titulo, conteudo, descricao, solucao, dificuldade, aula, disciplina_id]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// Atualizar exercício (só os da própria disciplina)
async function atualizar(req, res) {
    try {
        const { id } = req.params;
        const { titulo, conteudo, descricao, solucao, dificuldade, aula } = req.body;
        const resultado = await pool.query(
            `UPDATE exercicios SET titulo=$1, conteudo=$2, descricao=$3,
                                   solucao=$4, dificuldade=$5, aula=$6
             WHERE id=$7 AND disciplina_id IN (
                 SELECT id FROM disciplinas WHERE professor_id = $8
             )
                 RETURNING *`,
            [titulo, conteudo, descricao, solucao, dificuldade, aula, id, req.usuario.id]
        );
        if (!resultado.rows.length) {
            return res.status(404).json({ erro: 'Exercício não encontrado nas suas disciplinas' });
        }
        res.json(resultado.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// Deletar exercício (só os da própria disciplina, junto com as dúvidas dele)
async function deletar(req, res) {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        await client.query('BEGIN');

        const dono = await client.query(
            `SELECT e.id FROM exercicios e
       JOIN disciplinas d ON e.disciplina_id = d.id
       WHERE e.id = $1 AND d.professor_id = $2`,
            [id, req.usuario.id]
        );
        if (!dono.rows.length) {
            await client.query('ROLLBACK');
            return res.status(404).json({ erro: 'Exercício não encontrado nas suas disciplinas' });
        }

        await client.query('DELETE FROM duvidas WHERE exercicio_id = $1', [id]);
        await client.query('DELETE FROM exercicios WHERE id = $1', [id]);
        await client.query('COMMIT');
        res.json({ mensagem: 'Exercício removido com sucesso' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ erro: err.message });
    } finally {
        client.release();
    }
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar };