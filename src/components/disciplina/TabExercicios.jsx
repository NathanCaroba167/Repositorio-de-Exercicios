import React, { useState } from 'react';

export function TabExercicios() {
    const [exercicios, setExercicios] = useState([
        { id: 1, titulo: "Lista 1 de Fixação", aula: "Aula 1: Introdução" }
    ]);
    const [titulo, setTitle] = useState("");
    const [aulaRef, setAulaRef] = useState("Aula 1");

    const handleAdd = (e) => {
        e.preventDefault();
        if (!titulo) return;
        setExercicios([...exercicios, { id: Date.now(), titulo, aula: aulaRef }]);
        setTitle("");
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">+ Adicionar Exercício</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Título do Exercício / Tarefa"
                        value={titulo}
                        onChange={(e) => setTitle(e.target.value)}
                        className="p-2 border rounded-lg text-sm"
                    />
                    <select
                        value={aulaRef}
                        onChange={(e) => setAulaRef(e.target.value)}
                        className="p-2 border rounded-lg text-sm"
                    >
                        <option value="Aula 1: Introdução">Referente à: Aula 1: Introdução</option>
                        <option value="Aula 2: Prática">Referente à: Aula 2: Prática</option>
                    </select>
                </div>
                <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700">
                    Criar Exercício
                </button>
            </form>

            <div className="space-y-3">
                {exercicios.map(ex => (
                    <div key={ex.id} className="p-4 bg-white border rounded-xl shadow-sm flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-gray-800">{ex.titulo}</h3>
                            <span className="text-xs text-gray-400">Vinculado a: {ex.aula}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}