import React, { useState } from 'react';

export function TabDuvidas() {
    const [filtroStatus, setFiltroStatus] = useState('pendentes');

    const [duvidaSelecionada, setDuvidaSelecionada] = useState(null);
    const [respostaTexto, setRespostaTexto] = useState("");
    const [tornarPublica, setTornarPublica] = useState(false);

    const [duvidas, setDuvidas] = useState([
        {
            id: 1,
            texto: "Como resolvo a equação da página 4?",
            lida: false,
            respondida: false,
            aula: "Aula 1",
            exercicioId: 1,
            exercicioTitulo: "Ordenação por intercalação",
            alunoNome: "Nathan",
            resposta: null,
            isPublic: false
        },
        {
            id: 2,
            texto: "Qual a data da prova?",
            lida: true,
            respondida: false,
            aula: "Aula 2",
            exercicioId: 2,
            exercicioTitulo: "Busca binária recursiva",
            alunoNome: "Vanessa",
            resposta: null,
            isPublic: false
        },
        {
            id: 3,
            texto: "Como identificar a condição de parada?",
            lida: true,
            respondida: true,
            aula: "Aula 2",
            exercicioId: 2,
            exercicioTitulo: "Busca binária recursiva",
            alunoNome: "Elieser",
            resposta: "A condição de parada ocorre quando o ponteiro inicial ultrapassa o final.",
            isPublic: true
        }
    ]);

    const marcarLida = (id) => {
        setDuvidas(duvidas.map(d => d.id === id ? { ...d, lida: true } : d));
    };

    const abrirModalResposta = (duvida) => {
        setDuvidaSelecionada(duvida);
        setRespostaTexto("");
        setTornarPublica(false);
        marcarLida(duvida.id);
    };

    const enviarResposta = (e) => {
        e.preventDefault();
        if (!respostaTexto.trim()) return;

        setDuvidas(duvidas.map(d =>
            d.id === duvidaSelecionada.id
                ? {
                    ...d,
                    respondida: true,
                    resposta: respostaTexto,
                    isPublic: tornarPublica
                }
                : d
        ));

        setDuvidaSelecionada(null);
    };

    const listaFiltrada = duvidas.filter(d => filtroStatus === 'pendentes' ? !d.respondida : d.respondida);

    return (
        <div className="space-y-6">
            <div className="flex gap-2 border-b border-slate-200 pb-3">
                <button
                    onClick={() => setFiltroStatus('pendentes')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        filtroStatus === 'pendentes' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    Não Respondidas ({duvidas.filter(d => !d.respondida).length})
                </button>
                <button
                    onClick={() => setFiltroStatus('respondidas')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        filtroStatus === 'respondidas' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    Já Respondidas ({duvidas.filter(d => d.respondida).length})
                </button>
            </div>

            <div className="space-y-4">
                {listaFiltrada.length === 0 ? (
                    <p className="text-sm text-slate-400">Nenhuma dúvida nesta aba.</p>
                ) : (
                    listaFiltrada.map(duvida => (
                        <div
                            key={duvida.id}
                            className={`p-5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                duvida.lida
                                    ? 'bg-slate-50 border-slate-200 text-slate-600'
                                    : 'bg-white border-orange-300 text-slate-900 shadow-sm'
                            }`}
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md ${
                                        duvida.lida ? 'bg-slate-200 text-slate-600' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                        {duvida.lida ? 'Visualizada' : 'Nova'}
                                    </span>
                                    <span className="text-xs font-bold text-orange-600">
                                        {duvida.aula}
                                    </span>
                                    <span className="text-xs text-slate-400">•</span>
                                    <span className="text-xs font-semibold text-slate-500">
                                        Exercício: {duvida.exercicioTitulo}
                                    </span>
                                </div>

                                <p className="font-semibold text-sm pt-1">{duvida.texto}</p>

                                {duvida.resposta && (
                                    <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                                        <strong className="text-slate-800">Sua resposta:</strong> {duvida.resposta}
                                        {duvida.isPublic && (
                                            <span className="ml-2 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                Pública no Exercício
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {!duvida.respondida && (
                                <div className="flex gap-2 shrink-0">
                                    {!duvida.lida && (
                                        <button
                                            onClick={() => marcarLida(duvida.id)}
                                            className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3.5 py-2 rounded-xl font-bold transition"
                                        >
                                            Marcar lida
                                        </button>
                                    )}
                                    <button
                                        onClick={() => abrirModalResposta(duvida)}
                                        className="text-xs bg-orange-600 text-white hover:bg-orange-700 px-4 py-2 rounded-xl font-bold transition shadow-sm shadow-orange-200"
                                    >
                                        Responder
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {duvidaSelecionada && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="font-extrabold text-slate-900">Responder dúvida</h3>
                            <button
                                onClick={() => setDuvidaSelecionada(null)}
                                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="text-xs space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                            <div>
                                <span className="text-slate-400 font-medium">Origem: </span>
                                <span className="font-bold text-orange-600">{duvidaSelecionada.aula}</span>
                                <span className="text-slate-400"> · {duvidaSelecionada.exercicioTitulo}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 font-medium">Aluno: </span>
                                <span className="font-semibold text-slate-700">{duvidaSelecionada.alunoNome}</span>
                            </div>
                            <div className="pt-1 text-slate-800 font-medium italic border-t border-slate-200/60 mt-1">
                                "{duvidaSelecionada.texto}"
                            </div>
                        </div>

                        <textarea
                            rows={4}
                            value={respostaTexto}
                            onChange={(e) => setRespostaTexto(e.target.value)}
                            placeholder="Escreva sua resposta com o máximo de detalhes possível..."
                            className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
                        />

                        {/* Rodapé: Anexar pública + Botão Enviar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={tornarPublica}
                                    onChange={(e) => setTornarPublica(e.target.checked)}
                                    className="size-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                />
                                Tornar pública (Anexar ao exercício)
                            </label>

                            <button
                                onClick={enviarResposta}
                                className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700 shadow-sm shadow-orange-200"
                            >
                                Enviar resposta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}