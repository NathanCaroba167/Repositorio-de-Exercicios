import { useEffect, useState } from 'react';
import { TabMateriais } from '../components/disciplina/TabMateriais';
import { TabExercicios } from '../components/disciplina/TabExercicios';
import { TabAulas } from '../components/disciplina/TabAulas';
import { TabDuvidas } from '../components/disciplina/TabDuvidas';
import { TabReferencias } from '../components/disciplina/TabReferencias';
import { getMinhasDisciplinas } from '../services/api';

export function GerenciarDisciplinaPage() {
    const [activeTab, setActiveTab] = useState('aulas');
    const [disciplinas, setDisciplinas] = useState(null); // null = carregando
    const [disciplinaId, setDisciplinaId] = useState(null);
    const [erro, setErro] = useState('');

    useEffect(() => {
        getMinhasDisciplinas()
            .then((lista) => {
                setDisciplinas(lista);
                if (lista.length) setDisciplinaId(lista[0].id);
            })
            .catch((err) => {
                setErro(err.message);
                setDisciplinas([]);
            });
    }, []);

    if (disciplinas === null) {
        return <p className="p-6 text-sm text-slate-500">Carregando suas disciplinas...</p>;
    }
    if (erro) {
        return <p role="alert" className="p-6 text-sm text-red-700">{erro}</p>;
    }
    if (!disciplinas.length) {
        return <p className="p-6 text-sm text-slate-500">Você ainda não é responsável por nenhuma disciplina.</p>;
    }

    const atual = disciplinas.find((d) => d.id === disciplinaId);

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Gerenciar Disciplina</h1>
                    <p className="mt-1 text-sm text-slate-500">{atual.nome} · {atual.codigo}</p>
                </div>
                {disciplinas.length > 1 && (
                    <select
                        value={disciplinaId}
                        onChange={(e) => setDisciplinaId(Number(e.target.value))}
                        aria-label="Escolher disciplina"
                        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 outline-none focus:border-orange-400"
                    >
                        {disciplinas.map((d) => (
                            <option key={d.id} value={d.id}>{d.nome}</option>
                        ))}
                    </select>
                )}
            </div>

            <div className="flex border-b border-gray-200 overflow-x-auto">
                {['Aulas', 'Materiais', 'Exercícios', 'Dúvidas', 'Referências'].map((tab) => {
                    const tabKey = tab.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tabKey)}
                            className={`py-3 px-6 text-sm font-medium transition-colors whitespace-nowrap ${
                                activeTab === tabKey
                                    ? 'text-orange-600 border-b-2 border-orange-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6">
                {activeTab === 'aulas' && <TabAulas disciplinaId={disciplinaId} />}
                {activeTab === 'materiais' && <TabMateriais disciplinaId={disciplinaId} />}
                {activeTab === 'exercicios' && <TabExercicios disciplinaId={disciplinaId} />}
                {activeTab === 'duvidas' && <TabDuvidas key={disciplinaId} disciplinaId={disciplinaId} />}
                {activeTab === 'referencias' && <TabReferencias disciplinaId={disciplinaId} />}
            </div>
        </div>
    );
}