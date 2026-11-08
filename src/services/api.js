const HOST = 'http://localhost:3001';
const BASE_URL = `${HOST}/api`;
const CHAVE = 'exercita-auth';

// Endereço completo de um PDF enviado (a API devolve só "/uploads/xxx.pdf")
export const urlArquivo = (caminho) => (caminho ? `${HOST}${caminho}` : null);

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
    const ehFormulario = body instanceof FormData;
    if (body && !ehFormulario) headers['Content-Type'] = 'application/json';
    if (sessao?.token) headers.Authorization = `Bearer ${sessao.token}`;

    let res;
    try {
        res = await fetch(`${BASE_URL}${caminho}`, {
            method,
            headers,
            body: body ? (ehFormulario ? body : JSON.stringify(body)) : undefined,
        });
    } catch {
        throw new Error('Não foi possível conectar ao servidor');
    }

    const dados = await res.json().catch(() => null);
    if (!res.ok) throw new Error(dados?.erro || 'Erro inesperado');
    return dados;
}

// Auth
export const login = (email, senha) =>
    requisitar('/auth/login', { method: 'POST', body: { email, senha } });
export const cadastrar = (nome, email, senha) =>
    requisitar('/auth/cadastrar', { method: 'POST', body: { nome, email, senha } });

// Exercícios
export function getExercicios(filtros = {}) {
    const params = new URLSearchParams();
    if (filtros.disciplina) params.append('disciplina', filtros.disciplina);
    if (filtros.dificuldade) params.append('dificuldade', filtros.dificuldade);
    if (filtros.q) params.append('q', filtros.q);
    return requisitar(`/exercicios?${params}`);
}
export const getExercicioPorId = (id) => requisitar(`/exercicios/${id}`);
export const getExerciciosDaDisciplina = (disciplinaId) =>
    requisitar(`/exercicios?disciplina_id=${disciplinaId}`);
export const criarExercicio = (dados) =>
    requisitar('/exercicios', { method: 'POST', body: dados });
export const removerExercicio = (id) =>
    requisitar(`/exercicios/${id}`, { method: 'DELETE' });

// Disciplinas
export const getMinhasDisciplinas = () => requisitar('/disciplinas/minhas');

// Aulas, materiais e referências
export const getReferencias = (disciplinaId, tipo) =>
    requisitar(`/referencias?disciplina_id=${disciplinaId}${tipo ? `&tipo=${tipo}` : ''}`);
export const criarReferencia = (formData) =>
    requisitar('/referencias', { method: 'POST', body: formData });
export const removerReferencia = (id) =>
    requisitar(`/referencias/${id}`, { method: 'DELETE' });

// Dúvidas
export const criarDuvida = (exercicio_id, pergunta) =>
    requisitar('/duvidas', { method: 'POST', body: { exercicio_id, pergunta } });
export const getDuvidas = (exercicioId) => requisitar(`/duvidas?exercicio_id=${exercicioId}`);
export const getMinhasDuvidas = () => requisitar('/duvidas/minhas');
export const getDuvidasPublicas = (disciplinaId) =>
    requisitar(`/duvidas/publicas?disciplina_id=${disciplinaId}`);
export const getDuvidasProfessor = (disciplinaId, status) =>
    requisitar(`/duvidas/professor?disciplina_id=${disciplinaId}&status=${status}`);
export const responderDuvida = (id, resposta, publica) =>
    requisitar(`/duvidas/${id}/responder`, { method: 'PUT', body: { resposta, publica } });
export const marcarDuvidaLida = (id) => requisitar(`/duvidas/${id}/lida`, { method: 'PUT' });
export const marcarDuvidaResolvida = (id) =>
    requisitar(`/duvidas/${id}/resolvida`, { method: 'PUT' });