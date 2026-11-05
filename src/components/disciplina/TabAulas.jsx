import React, { useState } from 'react';

export function TabAulas() {
    const [aulas, setAulas] = useState([
        { id: 1, titulo: "Aula 1: Introdução", tipo: "Vídeo", url: "https://youtube.com/..." },
    ]);
    const [novaAula, setNovaAula] = useState({ titulo: "", tipo: "Vídeo", url: "" });

    const adicionarAula = (e) => {
        e.preventDefault();
        if (!novaAula.titulo) return;
        setAulas([...aulas, { id: Date.now(), ...novaAula }]);
        setNovaAula({ titulo: "", tipo: "Vídeo", url: "" });
    };

    return (
        <div className="space-y-6">
            <form onSubmit={adicionarAula} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">+ Adicionar Aula</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Título da Aula"
                        value={novaAula.titulo}
                        onChange={(e) => setNovaAula({ ...novaAula, titulo: e.target.value })}
                        className="p-2 border rounded-lg text-sm"
                    />
                    <select
                        value={novaAula.tipo}
                        onChange={(e) => setNovaAula({ ...novaAula, tipo: e.target.value })}
                        className="p-2 border rounded-lg text-sm"
                    >
                        <option value="Vídeo">Vídeo (YouTube/Link)</option>
                        <option value="Slide">Slide</option>
                        <option value="Imagem">Imagem</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Link do recurso"
                        value={novaAula.url}
                        onChange={(e) => setNovaAula({ ...novaAula, url: e.target.value })}
                        className="p-2 border rounded-lg text-sm"
                    />
                </div>
                <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700">
                    Salvar Aula
                </button>
            </form>

            <div className="space-y-3">
                {aulas.map(aula => (
                    <div key={aula.id} className="p-4 bg-white border rounded-xl shadow-sm flex justify-between items-center">
                        <div>
                            <span className="text-xs font-bold text-orange-600 uppercase">{aula.tipo}</span>
                            <h3 className="font-semibold text-gray-800">{aula.titulo}</h3>
                        </div>
                        <a href={aula.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">Acessar</a>
                    </div>
                ))}
            </div>
        </div>
    );
}