const bcrypt = require('bcryptjs');
const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/database');

// Trava de segurança: TRUNCATE só no banco de testes
function garantirBancoDeTeste() {
    if (process.env.DB_NAME !== 'exercita_test') {
        throw new Error(
            `Testes abortados: DB_NAME é "${process.env.DB_NAME}", esperado "exercita_test"`
        );
    }
}

async function resetar() {
    garantirBancoDeTeste();
    await pool.query(
        `TRUNCATE uteis, concluidos, matriculas, referencias, duvidas,
              exercicios, disciplinas, usuarios RESTART IDENTITY CASCADE`
    );
}

let hashCache;
async function hashSenha() {
    // custo 4 deixa os testes rápidos (em produção usamos 10)
    if (!hashCache) hashCache = await bcrypt.hash('123456', 4);
    return hashCache;
}

async function criarUsuario(nome, email, tipo) {
    const r = await pool.query(
        'INSERT INTO usuarios (nome, email, senha_hash, tipo) VALUES ($1, $2, $3, $4) RETURNING id',
        [nome, email, await hashSenha(), tipo]
    );
    return r.rows[0].id;
}

async function login(email) {
    const res = await request(app)
        .post('/api/auth/login')
        .send({ email, senha: '123456' });
    return res.body.token;
}

// Cenário padrão: 2 professores, 1 aluno, 2 disciplinas, 1 exercício
async function montarCenario() {
    await resetar();

    const vanessaId = await criarUsuario('Vanessa', 'vanessa@uel.br', 'professor');
    const oswaldoId = await criarUsuario('Oswaldo', 'oswaldo@uel.br', 'professor');
    const alunoId = await criarUsuario('Nathan', 'nathan@uel.br', 'aluno');

    const algoritmos = await pool.query(
        "INSERT INTO disciplinas (nome, codigo, professor_id, cor) VALUES ('Algoritmos', 'CCO101', $1, 'green') RETURNING id",
        [vanessaId]
    );
    const calculo = await pool.query(
        "INSERT INTO disciplinas (nome, codigo, professor_id, cor) VALUES ('Cálculo I', 'MAT101', $1, 'blue') RETURNING id",
        [oswaldoId]
    );

    const exercicio = await pool.query(
        `INSERT INTO exercicios (titulo, conteudo, descricao, solucao, dificuldade, aula, disciplina_id)
     VALUES ('Merge Sort', 'Ordenação', 'Implemente o Merge Sort.', 'Divida e intercale.', 'Básico', 'Aula 1', $1)
     RETURNING id`,
        [algoritmos.rows[0].id]
    );

    return {
        ids: {
            vanessa: vanessaId,
            oswaldo: oswaldoId,
            aluno: alunoId,
            algoritmos: algoritmos.rows[0].id,
            calculo: calculo.rows[0].id,
            exercicio: exercicio.rows[0].id,
        },
        tokens: {
            vanessa: await login('vanessa@uel.br'),
            oswaldo: await login('oswaldo@uel.br'),
            aluno: await login('nathan@uel.br'),
        },
    };
}

module.exports = { app, pool, request, resetar, montarCenario };