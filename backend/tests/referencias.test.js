const { app, pool, request, montarCenario } = require('./helpers');

let ctx;
beforeEach(async () => {
    ctx = await montarCenario();
});
afterAll(() => pool.end());

const auth = (token) => ({ Authorization: `Bearer ${token}` });

describe('referências', () => {
    it('professor posta link na própria disciplina e o aluno lista', async () => {
        const criar = await request(app)
            .post('/api/referencias')
            .set(auth(ctx.tokens.vanessa))
            .field('titulo', 'Vídeo-aula de Merge Sort')
            .field('aula', 'Aula 1')
            .field('disciplina_id', String(ctx.ids.algoritmos))
            .field('url', 'https://exemplo.com/merge-sort');
        expect(criar.status).toBe(201);

        const lista = await request(app)
            .get(`/api/referencias?disciplina_id=${ctx.ids.algoritmos}`)
            .set(auth(ctx.tokens.aluno));
        expect(lista.status).toBe(200);
        expect(lista.body).toHaveLength(1);
        expect(lista.body[0].url).toBe('https://exemplo.com/merge-sort');
    });

    it('professor não posta na disciplina de outro: 403', async () => {
        const res = await request(app)
            .post('/api/referencias')
            .set(auth(ctx.tokens.vanessa))
            .field('titulo', 'Intruso')
            .field('disciplina_id', String(ctx.ids.calculo))
            .field('url', 'https://exemplo.com');
        expect(res.status).toBe(403);
    });

    it('aluno não posta: 403', async () => {
        const res = await request(app)
            .post('/api/referencias')
            .set(auth(ctx.tokens.aluno))
            .field('titulo', 'Do aluno')
            .field('disciplina_id', String(ctx.ids.algoritmos))
            .field('url', 'https://exemplo.com');
        expect(res.status).toBe(403);
    });

    it('sem PDF e sem link: 400', async () => {
        const res = await request(app)
            .post('/api/referencias')
            .set(auth(ctx.tokens.vanessa))
            .field('titulo', 'Vazio')
            .field('disciplina_id', String(ctx.ids.algoritmos));
        expect(res.status).toBe(400);
    });

    it('arquivo que não é PDF é rejeitado: 400', async () => {
        const res = await request(app)
            .post('/api/referencias')
            .set(auth(ctx.tokens.vanessa))
            .field('titulo', 'Imagem')
            .field('disciplina_id', String(ctx.ids.algoritmos))
            .attach('arquivo', Buffer.from('não sou um pdf'), { filename: 'foto.png', contentType: 'image/png' });
        expect(res.status).toBe(400);
    });

    it('outro professor não remove: 404', async () => {
        const criar = await request(app)
            .post('/api/referencias')
            .set(auth(ctx.tokens.vanessa))
            .field('titulo', 'Meu material')
            .field('disciplina_id', String(ctx.ids.algoritmos))
            .field('url', 'https://exemplo.com');

        const res = await request(app)
            .delete(`/api/referencias/${criar.body.id}`)
            .set(auth(ctx.tokens.oswaldo));
        expect(res.status).toBe(404);
    });
});