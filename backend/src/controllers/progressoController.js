const pool = require('../config/database');

// Lista fixa: o :tipo da URL só vale se estiver aqui.
// Isso evita injetar um nome de tabela qualquer na query.
const TIPOS = {
    matriculas: { tabela: 'matriculas', coluna: 'disciplina_id' },
    concluidos: { tabela: 'concluidos', coluna: 'exercicio_id' },
    uteis: { tabela: 'uteis', coluna: 'exercicio_id' },
};

// Devolve tudo de uma vez, para o frontend carregar no login
async function listar(req, res) {
    try {
        const uid = req.usuario.id;
        const [m, c, u] = await Promise.all([
            pool.query('SELECT disciplina_id FROM matriculas WHERE usuario_id = $1', [uid]),
            pool.query('SELECT exercicio_id FROM concluidos WHERE usuario_id = $1', [uid]),
            pool.query('SELECT exercicio_id FROM uteis WHERE usuario_id = $1', [uid]),
        ]);
        res.json({
            matriculas: m.rows.map((r) => r.disciplina_id),
            concluidos: c.rows.map((r) => r.exercicio_id),
            uteis: u.rows.map((r) => r.exercicio_id),
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// PUT: marcar (repetir a chamada não faz mal)
async function marcar(req, res) {
    const config = TIPOS[req.params.tipo];
    const id = Number(req.params.id);
    if (!config) return res.status(404).json({ erro: 'Tipo inválido' });
    if (!Number.isInteger(id)) return res.status(400).json({ erro: 'ID inválido' });

    try {
        await pool.query(
            `INSERT INTO ${config.tabela} (usuario_id, ${config.coluna})
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [req.usuario.id, id]
        );
        res.json({ ok: true });
    } catch (err) {
        if (err.code === '23503') {
            return res.status(404).json({ erro: 'Item não encontrado' });
        }
        res.status(500).json({ erro: err.message });
    }
}

// DELETE: desmarcar
async function desmarcar(req, res) {
    const config = TIPOS[req.params.tipo];
    const id = Number(req.params.id);
    if (!config) return res.status(404).json({ erro: 'Tipo inválido' });
    if (!Number.isInteger(id)) return res.status(400).json({ erro: 'ID inválido' });

    try {
        await pool.query(
            `DELETE FROM ${config.tabela} WHERE usuario_id = $1 AND ${config.coluna} = $2`,
            [req.usuario.id, id]
        );
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

module.exports = { listar, marcar, desmarcar };