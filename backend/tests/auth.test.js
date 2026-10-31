const { app, pool, request, resetar } = require('./helpers');

beforeEach(resetar);
afterAll(() => pool.end());

describe('cadastro', () => {
    it('cadastra aluno e devolve token', async () => {
        const res = await request(app)
            .post('/api/auth/cadastrar')
            .send({ nome: 'Ana', email: 'ana@uel.br', senha: 'segredo1' });

        expect(res.status).toBe(201);
        expect(res.body.token).toBeDefined();
        expect(res.body.usuario.tipo).toBe('aluno');
        expect(res.body.usuario.senha_hash).toBeUndefined();
    });

    it('ignora tipo "professor" enviado no cadastro público', async () => {
        const res = await request(app)
            .post('/api/auth/cadastrar')
            .send({ nome: 'Espertinho', email: 'esp@uel.br', senha: 'segredo1', tipo: 'professor' });

        expect(res.status).toBe(201);
        expect(res.body.usuario.tipo).toBe('aluno');
    });

    it('não guarda a senha em texto puro', async () => {
        await request(app)
            .post('/api/auth/cadastrar')
            .send({ nome: 'Ana', email: 'ana@uel.br', senha: 'segredo1' });

        const r = await pool.query("SELECT senha_hash FROM usuarios WHERE email = 'ana@uel.br'");
        expect(r.rows[0].senha_hash).not.toBe('segredo1');
        expect(r.rows[0].senha_hash.startsWith('$2')).toBe(true);
    });

    it('rejeita e-mail repetido', async () => {
        const dados = { nome: 'Ana', email: 'ana@uel.br', senha: 'segredo1' };
        await request(app).post('/api/auth/cadastrar').send(dados);
        const res = await request(app).post('/api/auth/cadastrar').send(dados);

        expect(res.status).toBe(400);
    });
});

describe('login', () => {
    beforeEach(async () => {
        await request(app)
            .post('/api/auth/cadastrar')
            .send({ nome: 'Ana', email: 'ana@uel.br', senha: 'segredo1' });
    });

    it('entra com credenciais corretas', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'ana@uel.br', senha: 'segredo1' });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it('rejeita senha errada', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'ana@uel.br', senha: 'errada' });

        expect(res.status).toBe(401);
    });

    it('rejeita e-mail que não existe', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'fantasma@uel.br', senha: 'segredo1' });

        expect(res.status).toBe(401);
    });
});