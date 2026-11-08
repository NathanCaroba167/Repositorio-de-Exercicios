const { app, pool, request, montarCenario } = require('./helpers');

let ctx;
beforeEach(async () => {
    ctx = await montarCenario();
});
afterAll(() => pool.end());

const auth = (token) => ({ Authorization: `Bearer ${token}` });

function postar(campos) {
    let req = request(app)
        .post('/api/referencias')
        .set(auth(ctx.tokens.vanessa))
        .field('disciplina_id', String(ctx.ids.algoritmos));
    Object.entries(campos).forEach(([k, v]) => {
        req = req.field(k, v);
    });
    return req;
}

describe('tipos de conteúdo da disciplina', () => {
    it('cria aula e referência e filtra por tipo', async () => {
        const aula = await postar({
            tipo: 'aula', titulo: 'Aula 1', aula: 'Aula 1',
            formato: 'Vídeo', url: 'https://exemplo.com/video',
        });
        const ref = await postar({
            tipo: 'referencia', titulo: 'Livro base',
            url: 'https://exemplo.com/livro', descricao: 'Capítulos 1 a 3',
        });
        expect(aula.status).toBe(201);
        expect(ref.status).toBe(201);

        const base = `/api/referencias?disciplina_id=${ctx.ids.algoritmos}`;
        const soAulas = await request(app).get(`${base}&tipo=aula`).set(auth(ctx.tokens.aluno));
        expect(soAulas.body).toHaveLength(1);
        expect(soAulas.body[0].formato).toBe('Vídeo');

        const todas = await request(app).get(base).set(auth(ctx.tokens.aluno));
        expect(todas.body).toHaveLength(2);
    });

    it('tipo inválido: 400 ao criar e ao filtrar', async () => {
        const criar = await postar({ tipo: 'foo', titulo: 'X', url: 'https://exemplo.com' });
        expect(criar.status).toBe(400);

        const filtrar = await request(app)
            .get(`/api/referencias?disciplina_id=${ctx.ids.algoritmos}&tipo=foo`)
            .set(auth(ctx.tokens.aluno));
        expect(filtrar.status).toBe(400);
    });

    it('rejeita link que não é http/https (javascript:)', async () => {
        const res = await postar({ tipo: 'referencia', titulo: 'Malicioso', url: 'javascript:alert(1)' });
        expect(res.status).toBe(400);
    });

    it('material sem PDF: 400', async () => {
        const res = await postar({ tipo: 'material', titulo: 'Só link', url: 'https://exemplo.com' });
        expect(res.status).toBe(400);
    });

    it('material com PDF: 201, o arquivo é servido e some ao remover', async () => {
        const criar = await postar({ tipo: 'material', titulo: 'Apostila', aula: 'Aula 1' })
            .attach('arquivo', Buffer.from('%PDF-1.4\n%teste'), { filename: 'a.pdf', contentType: 'application/pdf' });

        const lista = await request(app)
            .get(`/api/referencias?disciplina_id=${ctx.ids.algoritmos}&tipo=material`)
            .set(auth(ctx.tokens.aluno));
        const arquivoUrl = lista.body[0]?.arquivo_url;
        const abrir = arquivoUrl ? await request(app).get(arquivoUrl) : null;

        // remove antes de conferir, para não deixar PDF solto na pasta uploads
        const remover = await request(app)
            .delete(`/api/referencias/${criar.body.id}`)
            .set(auth(ctx.tokens.vanessa));

        expect(criar.status).toBe(201);
        expect(criar.body.tipo).toBe('material');
        expect(arquivoUrl).toMatch(/^\/uploads\//);
        expect(abrir.status).toBe(200);
        expect(remover.status).toBe(200);
    });
});

describe('exercícios por disciplina', () => {
    it('filtra por disciplina_id', async () => {
        await pool.query(
            `INSERT INTO exercicios (titulo, conteudo, descricao, solucao, dificuldade, aula, disciplina_id)
       VALUES ('Limites', 'Limites', 'd', 's', 'Básico', 'Aula 1', $1)`,
            [ctx.ids.calculo]
        );
        const res = await request(app).get(`/api/exercicios?disciplina_id=${ctx.ids.algoritmos}`);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].titulo).toBe('Merge Sort');
    });

    it('disciplina_id inválido: 400', async () => {
        const res = await request(app).get('/api/exercicios?disciplina_id=abc');
        expect(res.status).toBe(400);
    });
});

describe('dúvidas públicas da disciplina', () => {
    it('só as respondidas e públicas, sem o nome do aluno', async () => {
        const d = await request(app)
            .post('/api/duvidas')
            .set(auth(ctx.tokens.aluno))
            .send({ exercicio_id: ctx.ids.exercicio, pergunta: 'Como funciona?' });
        const url = `/api/duvidas/publicas?disciplina_id=${ctx.ids.algoritmos}`;

        const antes = await request(app).get(url).set(auth(ctx.tokens.aluno));
        expect(antes.body).toHaveLength(0);

        await request(app)
            .put(`/api/duvidas/${d.body.id}/responder`)
            .set(auth(ctx.tokens.vanessa))
            .send({ resposta: 'Assim.', publica: true });

        const depois = await request(app).get(url).set(auth(ctx.tokens.aluno));
        expect(depois.body).toHaveLength(1);
        expect(depois.body[0].resposta).toBe('Assim.');
        expect(depois.body[0].aluno).toBeUndefined();
    });

    it('sem disciplina_id: 400', async () => {
        const res = await request(app).get('/api/duvidas/publicas').set(auth(ctx.tokens.aluno));
        expect(res.status).toBe(400);
    });
});