const { app, pool, request, montarCenario } = require('./helpers');

let ctx;
beforeEach(async () => {
    ctx = await montarCenario();
});
afterAll(() => pool.end());

const auth = (token) => ({ Authorization: `Bearer ${token}` });

async function criarDuvida() {
    const res = await request(app)
        .post('/api/duvidas')
        .set(auth(ctx.tokens.aluno))
        .send({ exercicio_id: ctx.ids.exercicio, pergunta: 'Como analiso o espaço auxiliar?' });
    return res;
}

describe('criar dúvida', () => {
    it('aluno cria: 201', async () => {
        const res = await criarDuvida();
        expect(res.status).toBe(201);
        expect(res.body.resposta).toBeNull();
    });

    it('professor não cria: 403', async () => {
        const res = await request(app)
            .post('/api/duvidas')
            .set(auth(ctx.tokens.vanessa))
            .send({ exercicio_id: ctx.ids.exercicio, pergunta: 'Teste' });
        expect(res.status).toBe(403);
    });

    it('pergunta vazia: 400', async () => {
        const res = await request(app)
            .post('/api/duvidas')
            .set(auth(ctx.tokens.aluno))
            .send({ exercicio_id: ctx.ids.exercicio, pergunta: '   ' });
        expect(res.status).toBe(400);
    });

    it('exercício inexistente: 404', async () => {
        const res = await request(app)
            .post('/api/duvidas')
            .set(auth(ctx.tokens.aluno))
            .send({ exercicio_id: 9999, pergunta: 'Existe?' });
        expect(res.status).toBe(404);
    });

    it('sem token: 401', async () => {
        const res = await request(app)
            .post('/api/duvidas')
            .send({ exercicio_id: ctx.ids.exercicio, pergunta: 'Oi' });
        expect(res.status).toBe(401);
    });
});

describe('responder dúvida', () => {
    it('professora da disciplina vê a pendente e responde', async () => {
        const duvida = (await criarDuvida()).body;

        const pendentes = await request(app)
            .get('/api/duvidas/pendentes')
            .set(auth(ctx.tokens.vanessa));
        expect(pendentes.status).toBe(200);
        expect(pendentes.body).toHaveLength(1);

        const resp = await request(app)
            .put(`/api/duvidas/${duvida.id}/responder`)
            .set(auth(ctx.tokens.vanessa))
            .send({ resposta: 'O vetor auxiliar tem tamanho n.' });
        expect(resp.status).toBe(200);
        expect(resp.body.resposta).toBe('O vetor auxiliar tem tamanho n.');

        const depois = await request(app)
            .get('/api/duvidas/pendentes')
            .set(auth(ctx.tokens.vanessa));
        expect(depois.body).toHaveLength(0);
    });

    it('outro professor não vê nem responde: 404', async () => {
        const duvida = (await criarDuvida()).body;

        const pendentes = await request(app)
            .get('/api/duvidas/pendentes')
            .set(auth(ctx.tokens.oswaldo));
        expect(pendentes.body).toHaveLength(0);

        const resp = await request(app)
            .put(`/api/duvidas/${duvida.id}/responder`)
            .set(auth(ctx.tokens.oswaldo))
            .send({ resposta: 'Invadindo' });
        expect(resp.status).toBe(404);
    });

    it('aluno não responde: 403', async () => {
        const duvida = (await criarDuvida()).body;
        const resp = await request(app)
            .put(`/api/duvidas/${duvida.id}/responder`)
            .set(auth(ctx.tokens.aluno))
            .send({ resposta: 'Eu mesmo respondo' });
        expect(resp.status).toBe(403);
    });
});

describe('listar por exercício', () => {
    it('logado vê as dúvidas do exercício', async () => {
        await criarDuvida();
        const res = await request(app)
            .get(`/api/duvidas?exercicio_id=${ctx.ids.exercicio}`)
            .set(auth(ctx.tokens.aluno));
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].aluno).toBe('Nathan');
    });

    it('sem exercicio_id: 400', async () => {
        const res = await request(app).get('/api/duvidas').set(auth(ctx.tokens.aluno));
        expect(res.status).toBe(400);
    });
});