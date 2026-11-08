const { app, pool, request, montarCenario } = require('./helpers');

let ctx, tokenBia;
beforeEach(async () => {
    ctx = await montarCenario();
    const bia = await request(app)
        .post('/api/auth/cadastrar')
        .send({ nome: 'Bia', email: 'bia@uel.br', senha: 'segredo12' });
    tokenBia = bia.body.token;
});
afterAll(() => pool.end());

const auth = (token) => ({ Authorization: `Bearer ${token}` });
const listar = (token) =>
    request(app).get(`/api/duvidas?exercicio_id=${ctx.ids.exercicio}`).set(auth(token));

async function perguntar() {
    const r = await request(app)
        .post('/api/duvidas')
        .set(auth(ctx.tokens.aluno))
        .send({ exercicio_id: ctx.ids.exercicio, pergunta: 'Dúvida do Nathan' });
    return r.body;
}

const responder = (id, corpo) =>
    request(app).put(`/api/duvidas/${id}/responder`).set(auth(ctx.tokens.vanessa)).send(corpo);

describe('privacidade das dúvidas', () => {
    it('dúvida privada: outro aluno não vê', async () => {
        await perguntar();
        const res = await listar(tokenBia);
        expect(res.body).toHaveLength(0);
    });

    it('respondida mas não pública: continua escondida de outro aluno', async () => {
        const d = await perguntar();
        await responder(d.id, { resposta: 'Resposta' });
        const res = await listar(tokenBia);
        expect(res.body).toHaveLength(0);
    });

    it('respondida e pública: outro aluno vê, sem o nome do autor', async () => {
        const d = await perguntar();
        await responder(d.id, { resposta: 'Resposta', publica: true });
        const res = await listar(tokenBia);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].resposta).toBe('Resposta');
        expect(res.body[0].aluno).toBeNull();
    });

    it('o autor e o professor veem o nome', async () => {
        await perguntar();
        const autor = await listar(ctx.tokens.aluno);
        const prof = await listar(ctx.tokens.vanessa);
        expect(autor.body[0].aluno).toBe('Nathan');
        expect(prof.body[0].aluno).toBe('Nathan');
    });
});

describe('painel do professor', () => {
    it('lista só as dúvidas da própria disciplina', async () => {
        await perguntar();
        const url = `/api/duvidas/professor?disciplina_id=${ctx.ids.algoritmos}&status=pendentes`;
        const dona = await request(app).get(url).set(auth(ctx.tokens.vanessa));
        const outro = await request(app).get(url).set(auth(ctx.tokens.oswaldo));
        expect(dona.body).toHaveLength(1);
        expect(outro.body).toHaveLength(0);
    });

    it('marcar como lida: só o professor da disciplina', async () => {
        const d = await perguntar();
        const dono = await request(app).put(`/api/duvidas/${d.id}/lida`).set(auth(ctx.tokens.vanessa));
        const outro = await request(app).put(`/api/duvidas/${d.id}/lida`).set(auth(ctx.tokens.oswaldo));
        expect(dono.status).toBe(200);
        expect(outro.status).toBe(404);
    });

    it('GET /api/disciplinas/minhas: professor vê as suas, aluno é barrado', async () => {
        const prof = await request(app).get('/api/disciplinas/minhas').set(auth(ctx.tokens.vanessa));
        expect(prof.body).toHaveLength(1);
        expect(prof.body[0].nome).toBe('Algoritmos');
        const aluno = await request(app).get('/api/disciplinas/minhas').set(auth(ctx.tokens.aluno));
        expect(aluno.status).toBe(403);
    });
});

describe('"Entendi" do aluno', () => {
    it('só na própria dúvida e só depois de respondida', async () => {
        const d = await perguntar();
        const antes = await request(app).put(`/api/duvidas/${d.id}/resolvida`).set(auth(ctx.tokens.aluno));
        expect(antes.status).toBe(404);

        await responder(d.id, { resposta: 'Resposta' });
        const outro = await request(app).put(`/api/duvidas/${d.id}/resolvida`).set(auth(tokenBia));
        const dono = await request(app).put(`/api/duvidas/${d.id}/resolvida`).set(auth(ctx.tokens.aluno));
        expect(outro.status).toBe(404);
        expect(dono.status).toBe(200);
    });
});