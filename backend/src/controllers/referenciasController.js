const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

const PASTA = path.join(__dirname, '..', '..', 'uploads');

function apagarArquivo(nome) {
    if (nome) fs.unlink(path.join(PASTA, nome), () => {});
}

// Professor posta material na SUA disciplina
async function criar(req, res) {
    const arquivo = req.file ? req.file.filename : null;
    try {
        const { titulo, aula, disciplina_id, url } = req.body;

        if (!titulo || !disciplina_id) {
            apagarArquivo(arquivo);
            return res.status(400).json({ erro: 'Informe titulo e disciplina_id' });
        }
        if (!arquivo && !url) {
            return res.status(400).json({ erro: 'Envie um PDF ou informe um link' });
        }

        const dono = await pool.query(
            'SELECT id FROM disciplinas WHERE id = $1 AND professor_id = $2',
            [disciplina_id, req.usuario.id]
        );
        if (!dono.rows.length) {
            apagarArquivo(arquivo);
            return res.status(403).json({ erro: 'Você só pode postar materiais nas suas disciplinas' });
        }

        const r = await pool.query(
            `INSERT INTO referencias (titulo, aula, url, arquivo, disciplina_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [titulo.trim(), aula || null, url || null, arquivo, disciplina_id]
        );
        res.status(201).json(r.rows[0]);
    } catch (err) {
        apagarArquivo(arquivo);
        res.status(500).json({ erro: err.message });
    }
}

// Qualquer usuário logado lista os materiais de uma disciplina
async function listar(req, res) {
    try {
        const { disciplina_id } = req.query;
        if (!disciplina_id) {
            return res.status(400).json({ erro: 'Informe disciplina_id' });
        }
        const r = await pool.query(
            `SELECT id, titulo, aula, url, criado_em,
              CASE WHEN arquivo IS NULL THEN NULL
                   ELSE '/uploads/' || arquivo END AS arquivo_url
       FROM referencias
       WHERE disciplina_id = $1
       ORDER BY aula, criado_em DESC`,
            [disciplina_id]
        );
        res.json(r.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// Professor remove material da sua disciplina
async function remover(req, res) {
    try {
        const { id } = req.params;
        const r = await pool.query(
            `DELETE FROM referencias
       WHERE id = $1 AND disciplina_id IN (
         SELECT id FROM disciplinas WHERE professor_id = $2
       )
       RETURNING arquivo`,
            [id, req.usuario.id]
        );
        if (!r.rows.length) {
            return res.status(404).json({ erro: 'Material não encontrado nas suas disciplinas' });
        }
        apagarArquivo(r.rows[0].arquivo);
        res.json({ mensagem: 'Material removido com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

module.exports = { criar, listar, remover };