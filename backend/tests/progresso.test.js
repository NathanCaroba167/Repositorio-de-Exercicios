const { app, pool, request, montarCenario } = require('./helpers');

let ctx;
beforeEach(async () => {
    ctx = await montarCenario();
});
afterAll(() => pool.end());

const auth = (token) => ({ Authorization: `Bearer ${token}` });

describe('progresso do aluno', () => {
    it('marcar é idempotente e aparece na listagem', async () => {
        const url = `/api/progresso/concluidos/${ctx.ids.exercicio}`;
        const a = await request(app).put(url).set(auth(ctx.tokens.aluno));
        const b = await request(app).put(url).set(auth(ctx.tokens.aluno));
        expect(a.status).toBe(200);
        expect(b.status).toBe(200);

        await request(app)
            .put(`/api/progresso/matriculas/${ctx.ids.algoritmos}`)
            .set(auth(ctx.tokens.aluno));

        const res = await request(app).get('/api/progresso').set(auth(ctx.tokens.aluno));
        expect(res.body.concluidos).toEqual([ctx.ids.exercicio]);
        expect(res.body.matriculas).toEqual([ctx.ids.algoritmos]);
        expect(res.body.uteis).toEqual([]);
    });

    it('desmarcar remove', async () => {
        const url = `/api/progresso/uteis/${ctx.ids.exercicio}`;
        await request(app).put(url).set(auth(ctx.tokens.aluno));
        await request(app).delete(url).set(auth(ctx.tokens.aluno));

        const res = await request(app).get('/api/progresso').set(auth(ctx.tokens.aluno));
        expect(res.body.uteis).toEqual([]);
    });

    it('o progresso é de cada usuário', async () => {
        await request(app)
            .put(`/api/progresso/concluidos/${ctx.ids.exercicio}`)
            .set(auth(ctx.tokens.aluno));

        const res = await request(app).get('/api/progresso').set(auth(ctx.tokens.vanessa));
        expect(res.body.concluidos).toEqual([]);
    });

    it('total_uteis reflete as marcações', async () => {
        await request(app)
            .put(`/api/progresso/uteis/${ctx.ids.exercicio}`)
            .set(auth(ctx.tokens.aluno));

        const res = await request(app).get(`/api/exercicios/${ctx.ids.exercicio}`);
        expect(res.body.total_uteis).toBe(1);
    });

    it('item inexistente: 404', async () => {
        const res = await request(app).put('/api/progresso/concluidos/9999').set(auth(ctx.tokens.aluno));
        expect(res.status).toBe(404);
    });

    it('tipo inválido: 404', async () => {
        const res = await request(app).put('/api/progresso/foo/1').set(auth(ctx.tokens.aluno));
        expect(res.status).toBe(404);
    });

    it('sem token: 401', async () => {
        const res = await request(app).get('/api/progresso');
        expect(res.status).toBe(401);
    });
});