const { app, pool, request, montarCenario } = require('./helpers');

let ctx;
beforeEach(async () => {
    ctx = await montarCenario();
});
afterAll(() => pool.end());

const novoExercicio = (disciplina_id) => ({
    titulo: 'Busca binária',
    conteudo: 'Recursão',
    descricao: 'Implemente a busca binária.',
    solucao: 'Divida o intervalo ao meio.',
    dificuldade: 'Básico',
    aula: 'Aula 2',
    disciplina_id,
});

describe('leitura', () => {
    it('lista exercícios com disciplina e professor', async () => {
        const res = await request(app).get('/api/exercicios');

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].disciplina).toBe('Algoritmos');
        expect(res.body[0].professor).toBe('Vanessa');
    });

    it('busca por id e devolve 404 se não existir', async () => {
        const ok = await request(app).get(`/api/exercicios/${ctx.ids.exercicio}`);
        expect(ok.status).toBe(200);

        const nao = await request(app).get('/api/exercicios/9999');
        expect(nao.status).toBe(404);
    });

    it('a listagem traz disciplina_id', async () => {
        const res = await request(app).get('/api/exercicios');
        expect(res.body[0].disciplina_id).toBe(ctx.ids.algoritmos);
    });
});

describe('escrita: quem pode o quê', () => {
    it('sem token: 401', async () => {
        const res = await request(app).post('/api/exercicios').send(novoExercicio(ctx.ids.algoritmos));
        expect(res.status).toBe(401);
    });

    it('aluno: 403', async () => {
        const res = await request(app)
            .post('/api/exercicios')
            .set('Authorization', `Bearer ${ctx.tokens.aluno}`)
            .send(novoExercicio(ctx.ids.algoritmos));
        expect(res.status).toBe(403);
    });

    it('professor cria na própria disciplina: 201', async () => {
        const res = await request(app)
            .post('/api/exercicios')
            .set('Authorization', `Bearer ${ctx.tokens.vanessa}`)
            .send(novoExercicio(ctx.ids.algoritmos));
        expect(res.status).toBe(201);
    });

    it('professor não cria na disciplina de outro: 403', async () => {
        const res = await request(app)
            .post('/api/exercicios')
            .set('Authorization', `Bearer ${ctx.tokens.vanessa}`)
            .send(novoExercicio(ctx.ids.calculo));
        expect(res.status).toBe(403);
    });

    it('rejeita campos obrigatórios faltando: 400', async () => {
        const res = await request(app)
            .post('/api/exercicios')
            .set('Authorization', `Bearer ${ctx.tokens.vanessa}`)
            .send({ titulo: 'Só o título', disciplina_id: ctx.ids.algoritmos });
        expect(res.status).toBe(400);
    });

    it('professor de outra disciplina não edita: 404', async () => {
        const res = await request(app)
            .put(`/api/exercicios/${ctx.ids.exercicio}`)
            .set('Authorization', `Bearer ${ctx.tokens.oswaldo}`)
            .send({ ...novoExercicio(ctx.ids.algoritmos), titulo: 'Invadido' });
        expect(res.status).toBe(404);

        const r = await pool.query('SELECT titulo FROM exercicios WHERE id = $1', [ctx.ids.exercicio]);
        expect(r.rows[0].titulo).toBe('Merge Sort');
    });

    it('professor de outra disciplina não apaga: 404', async () => {
        const res = await request(app)
            .delete(`/api/exercicios/${ctx.ids.exercicio}`)
            .set('Authorization', `Bearer ${ctx.tokens.oswaldo}`);
        expect(res.status).toBe(404);
    });

    it('apagar o exercício apaga as dúvidas dele junto', async () => {
        await pool.query(
            'INSERT INTO duvidas (pergunta, exercicio_id, aluno_id) VALUES ($1, $2, $3)',
            ['Pergunta?', ctx.ids.exercicio, ctx.ids.aluno]
        );

        const res = await request(app)
            .delete(`/api/exercicios/${ctx.ids.exercicio}`)
            .set('Authorization', `Bearer ${ctx.tokens.vanessa}`);
        expect(res.status).toBe(200);

        const r = await pool.query('SELECT COUNT(*)::int AS n FROM duvidas');
        expect(r.rows[0].n).toBe(0);
    });
});