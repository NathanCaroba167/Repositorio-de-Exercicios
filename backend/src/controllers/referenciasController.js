const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

const PASTA = path.join(__dirname, '..', '..', 'uploads');
const TIPOS = ['aula', 'material', 'referencia'];
const URL_VALIDA = /^https?:\/\/\S+$/i;

function apagarArquivo(nome) {
    if (nome) fs.unlink(path.join(PASTA, nome), () => {});
}

// Professor posta conteúdo na SUA disciplina
async function criar(req, res) {
    const arquivo = req.file ? req.file.filename : null;
    const recusar = (status, erro) => {
        apagarArquivo(arquivo);
        return res.status(status).json({ erro });
    };

    try {
        const { titulo, aula, descricao, formato } = req.body;
        const tipo = req.body.tipo || 'referencia';
        const url = typeof req.body.url === 'string' ? req.body.url.trim() : '';
        const disciplinaId = Number(req.body.disciplina_id);

        if (!TIPOS.includes(tipo)) return recusar(400, 'Tipo inválido');
        if (typeof titulo !== 'string' || !titulo.trim() || !Number.isInteger(disciplinaId)) {
            return recusar(400, 'Informe titulo e disciplina_id');
        }
        if (url && !URL_VALIDA.test(url)) {
            return recusar(400, 'O link deve começar com http:// ou https://');
        }
        if (tipo === 'material' && !arquivo) return recusar(400, 'Materiais exigem um PDF');
        if (!arquivo && !url) return recusar(400, 'Envie um PDF ou informe um link');

        const dono = await pool.query(
            'SELECT id FROM disciplinas WHERE id = $1 AND professor_id = $2',
            [disciplinaId, req.usuario.id]
        );
        if (!dono.rows.length) {
            return recusar(403, 'Você só pode postar materiais nas suas disciplinas');
        }

        const r = await pool.query(
            `INSERT INTO referencias (titulo, aula, tipo, formato, descricao, url, arquivo, disciplina_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [titulo.trim(), aula || null, tipo, formato || null, descricao || null, url || null, arquivo, disciplinaId]
        );
        res.status(201).json(r.rows[0]);
    } catch (err) {
        apagarArquivo(arquivo);
        res.status(500).json({ erro: err.message });
    }
}

// Qualquer usuário logado lista, com filtro opcional por tipo
async function listar(req, res) {
    try {
        const disciplinaId = Number(req.query.disciplina_id);
        if (!Number.isInteger(disciplinaId)) {
            return res.status(400).json({ erro: 'Informe disciplina_id' });
        }
        const params = [disciplinaId];
        let filtro = '';
        if (req.query.tipo) {
            if (!TIPOS.includes(req.query.tipo)) {
                return res.status(400).json({ erro: 'Tipo inválido' });
            }
            params.push(req.query.tipo);
            filtro = ' AND tipo = $2';
        }
        const r = await pool.query(
            `SELECT id, titulo, aula, tipo, formato, descricao, url, criado_em,
              CASE WHEN arquivo IS NULL THEN NULL
                   ELSE '/uploads/' || arquivo END AS arquivo_url
       FROM referencias
       WHERE disciplina_id = $1${filtro}
       ORDER BY criado_em ASC`,
            params
        );
        res.json(r.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// Professor remove conteúdo da sua disciplina
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