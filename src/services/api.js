const BASE_URL = 'http://localhost:3001/api';

export async function getExercicios(filtros = {}) {
    const params = new URLSearchParams();
    if (filtros.disciplina) params.append('disciplina', filtros.disciplina);
    if (filtros.dificuldade) params.append('dificuldade', filtros.dificuldade);
    if (filtros.q) params.append('q', filtros.q);

    const res = await fetch(`${BASE_URL}/exercicios?${params}`);
    return res.json();
}

export async function getExercicioPorId(id) {
    const res = await fetch(`${BASE_URL}/exercicios/${id}`);
    return res.json();
}