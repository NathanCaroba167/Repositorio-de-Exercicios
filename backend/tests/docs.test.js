const { app, pool, request } = require('./helpers');
const openapi = require('../src/docs/openapi');

afterAll(() => pool.end());

describe('documentação', () => {
    it('serve o JSON da especificação', async () => {
        const res = await request(app).get('/api/docs.json');
        expect(res.status).toBe(200);
        expect(res.body.openapi).toBe('3.0.3');
    });

    it('documenta todas as rotas do projeto', () => {
        const rotas = [
            '/api/auth/cadastrar', '/api/auth/login',
            '/api/exercicios', '/api/exercicios/{id}',
            '/api/duvidas', '/api/duvidas/pendentes', '/api/duvidas/{id}/responder',
            '/api/duvidas/publicas', '/api/duvidas/minhas', '/api/duvidas/professor', '/api/duvidas/{id}/lida', '/api/duvidas/{id}/resolvida',
            '/api/disciplinas', '/api/disciplinas/minhas', '/api/referencias', '/api/referencias/{id}',
            '/api/progresso', '/api/progresso/{tipo}/{id}',
        ];
        rotas.forEach((r) => expect(openapi.paths[r]).toBeDefined());
    });
});