import { useEffect, useState } from 'react';
import { getExerciciosDaDisciplina, criarExercicio, removerExercicio } from '../../services/api';

const entrada = 'p-2 border rounded-lg text-sm w-full';
const VAZIO = {
    titulo: '', conteudo: '', aula: '', dificuldade: 'Básico', descricao: '', solucao: '',
};

export function TabExercicios({ disciplinaId }) {
    const [exercicios, setExercicios] = useState([]);
    const [form, setForm] = useState(VAZIO);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState('');
    const [recarregar, setRecarregar] = useState(0);

    useEffect(() => {
        let ativo = true;
        setCarregando(true);
        getExerciciosDaDisciplina(disciplinaId)
            .then((dados) => {
                if (ativo) { setExercicios([...dados].sort((a, b) => a.id - b.id)); setErro(''); }
            })
            .catch((err) => { if (ativo) setErro(err.message); })
            .finally(() => { if (ativo) setCarregando(false); });
        return () => { ativo = false; };
    }, [disciplinaId, recarregar]);

    const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

    async function criar(e) {
        e.preventDefault();
        setErro('');
        setEnviando(true);
        try {
            await criarExercicio({ ...form, disciplina_id: disciplinaId });
            setForm(VAZIO);
            setRecarregar((v) => v + 1);
        } catch (err) {
            setErro(err.message);
        } finally {
            setEnviando(false);
        }
    }

    async function remover(ex) {
        const aviso = `Remover "${ex.titulo}"? As dúvidas dos alunos neste exercício também serão apagadas.`;
        if (!window.confirm(aviso)) return;
        try {
            await removerExercicio(ex.id);
            setRecarregar((v) => v + 1);
        } catch (err) {
            setErro(err.message);
        }
    }

    return (
        <div className="space-y-6">
            <form onSubmit={criar} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">+ Adicionar exercício</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text" placeholder="Título" required maxLength={200}
                        value={form.titulo} onChange={mudar('titulo')} className={entrada}
                    />
                    <input
                        type="text" placeholder="Conteúdo (ex.: Recursão)" required maxLength={100}
                        value={form.conteudo} onChange={mudar('conteudo')} className={entrada}
                    />
                    <input
                        type="text" placeholder="Aula (ex.: Aula 1)" maxLength={50}
                        value={form.aula} onChange={mudar('aula')} className={entrada}
                    />
                    <select value={form.dificuldade} onChange={mudar('dificuldade')} className={entrada}>
                        <option>Básico</option>
                        <option>Intermediário</option>
                        <option>Avançado</option>
                    </select>
                </div>
                <textarea
                    rows={3} placeholder="Enunciado" required
                    value={form.descricao} onChange={mudar('descricao')} className={entrada}
                />
                <textarea
                    rows={3} placeholder="Solução comentada" required
                    value={form.solucao} onChange={mudar('solucao')} className={entrada}
                />
                {erro && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}
                <button
                    type="submit" disabled={enviando}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 disabled:opacity-60"
                >
                    {enviando ? 'Criando...' : 'Criar exercício'}
                </button>
            </form>

            <div className="space-y-3">
                {carregando ? (
                    <p className="text-sm text-slate-400">Carregando...</p>
                ) : exercicios.length === 0 ? (
                    <p className="text-sm text-slate-400">Nenhum exercício nesta disciplina.</p>
                ) : (
                    exercicios.map((ex) => (
                        <div key={ex.id} className="p-4 bg-white border rounded-xl shadow-sm flex justify-between items-center gap-4">
                            <div className="min-w-0">
                                <h3 className="font-semibold text-gray-800">{ex.titulo}</h3>
                                <span className="text-xs text-gray-400">
                                    {ex.aula} · {ex.conteudo} · {ex.dificuldade}
                                </span>
                            </div>
                            <button onClick={() => remover(ex)} className="text-sm font-bold text-red-600 hover:underline">
                                Remover
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}