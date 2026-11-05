import { useState, useEffect } from 'react';

export function GerenciarDisciplinaPage() {

    const [duvidas, setDuvidas] = useState([
        { id: 1, texto: "Como resolvo a equação da página 4?", lida: false, respondida: false },
        { id: 2, texto: "Qual a data da prova?", lida: true, respondida: false },
        { id: 3, texto: "Dúvida já resolvida.", lida: true, respondida: true },
    ]);

    const duvidasAtivas = duvidas.filter(duvida => !duvida.respondida);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Gerenciar Disciplina</h1>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                <button className="p-4 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg shadow font-medium transition">
                    + Adicionar material
                </button>
                <button className="p-4 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg shadow font-medium transition">
                    + Adicionar exercício
                </button>
                <button className="p-4 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg shadow font-medium transition">
                    + Adicionar aulas
                </button>
                <button className="p-4 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg shadow font-medium transition">
                    Responder dúvidas
                </button>
                <button className="p-4 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg shadow font-medium transition">
                    Editar referências
                </button>
            </div>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Dúvidas dos Alunos</h2>
                <div className="space-y-4">
                    {duvidasAtivas.length === 0 ? (
                        <p className="text-gray-500">Nenhuma dúvida pendente no momento.</p>
                    ) : (
                        duvidasAtivas.map(duvida => (
                            <div
                                key={duvida.id}

                                className={`p-4 rounded-lg shadow border-l-4 ${
                                    duvida.lida
                                        ? 'bg-gray-100 border-gray-400 text-gray-600'
                                        : 'bg-white border-orange-500 text-gray-800'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <p className="font-medium">{duvida.texto}</p>
                                    <span className="text-sm">
                    {duvida.lida ? 'Visualizada' : 'Nova'}
                  </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}