const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/database');

afterAll(async () => {
    await pool.end();
});

describe('GET /api/health', () => {
    it('responde ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});

describe('proteção de rotas', () => {
    it('rejeita criar exercício sem token', async () => {
        const res = await request(app).post('/api/exercicios').send({});
        expect(res.status).toBe(401);
    });
});