const BASE_URL = 'http://localhost:3001/api';
const CHAVE = 'exercita-auth';

export function lerSessao() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE)) || null;
    } catch {
        return null;
    }
}

export function salvarSessao(sessao) {
    localStorage.setItem(CHAVE, JSON.stringify(sessao));
}

export function limparSessao() {
    localStorage.removeItem(CHAVE);
}

// Toda chamada passa por aqui: manda o token (se houver) e converte erros em Error
async function requisitar(caminho, { method = 'GET', body } = {}) {
    const sessao = lerSessao();
    const headers = {};
    if (body) headers['Content-Type'] = 'application/json';
    if (sessao?.token) headers.Authorization = `Bearer ${sessao.token}`;

    let res;
    try {
        res = await fetch(`${BASE_URL}${caminho}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new Error('Não foi possível conectar ao servidor');
    }

    const dados = await res.json().catch(() => null);
    if (!res.ok) throw new Error(dados?.erro || 'Erro inesperado');
    return dados;
}

export const login = (email, senha) =>
    requisitar('/auth/login', { method: 'POST', body: { email, senha } });

export const cadastrar = (nome, email, senha) =>
    requisitar('/auth/cadastrar', { method: 'POST', body: { nome, email, senha } });

export function getExercicios(filtros = {}) {
    const params = new URLSearchParams();
    if (filtros.disciplina) params.append('disciplina', filtros.disciplina);
    if (filtros.dificuldade) params.append('dificuldade', filtros.dificuldade);
    if (filtros.q) params.append('q', filtros.q);
    return requisitar(`/exercicios?${params}`);
}

export const getExercicioPorId = (id) => requisitar(`/exercicios/${id}`);