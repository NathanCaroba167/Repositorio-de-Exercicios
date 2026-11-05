import React, { useState } from 'react';

export function TabReferencias() {
    const [refs, setRefs] = useState([
        { id: 1, titulo: "Bibliografia Oficial", url: "https://exemplo.com", desc: "Livro base da matéria" }
    ]);
    const [novo, setNovo] = useState({ titulo: "", url: "", desc: "" });

    const handleAdd = (e) => {
        e.preventDefault();
        if (!novo.titulo) return;
        setRefs([...refs, { id: Date.now(), ...novo }]);
        setNovo({ titulo: "", url: "", desc: "" });
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">+ Adicionar Referência</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text" placeholder="Título"
                        value={novo.titulo} onChange={e => setNovo({...novo, titulo: e.target.value})}
                        className="p-2 border rounded-lg text-sm"
                    />
                    <input
                        type="text" placeholder="Link (URL)"
                        value={novo.url} onChange={e => setNovo({...novo, url: e.target.value})}
                        className="p-2 border rounded-lg text-sm"
                    />
                    <input
                        type="text" placeholder="Descrição curta"
                        value={novo.desc} onChange={e => setNovo({...novo, desc: e.target.value})}
                        className="p-2 border rounded-lg text-sm"
                    />
                </div>
                <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700">
                    Salvar Referência
                </button>
            </form>

            <div className="space-y-3">
                {refs.map(r => (
                    <div key={r.id} className="p-4 bg-white border rounded-xl shadow-sm">
                        <div className="flex justify-between">
                            <h3 className="font-semibold text-gray-800">{r.titulo}</h3>
                            <a href={r.url} target="_blank" rel="noreferrer" className="text-sm text-orange-600 font-bold hover:underline">Abrir Link</a>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{r.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}