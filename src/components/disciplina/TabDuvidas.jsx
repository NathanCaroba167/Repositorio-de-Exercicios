import { useEffect, useState } from 'react';
import { getDuvidasProfessor, responderDuvida, marcarDuvidaLida } from '../../services/api';

export function TabDuvidas({ disciplinaId }) {
    const [filtroStatus, setFiltroStatus] = useState('pendentes');
    const [duvidas, setDuvidas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [recarregar, setRecarregar] = useState(0);

    const [duvidaSelecionada, setDuvidaSelecionada] = useState(null);
    const [respostaTexto, setRespostaTexto] = useState('');
    const [tornarPublica, setTornarPublica] = useState(false);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        let ativo = true;
        setCarregando(true);
        getDuvidasProfessor(disciplinaId, filtroStatus)
            .then((dados) => { if (ativo) { setDuvidas(dados); setErro(''); } })
            .catch((err) => { if (ativo) setErro(err.message); })
            .finally(() => { if (ativo) setCarregando(false); });
        return () => { ativo = false; };
    }, [disciplinaId, filtroStatus, recarregar]);

    async function marcarLida(id) {
        try {
            await marcarDuvidaLida(id);
            setDuvidas((lista) => lista.map((d) => (d.id === id ? { ...d, lida: true } : d)));
        } catch (err) {
            setErro(err.message);
        }
    }

    function abrirModalResposta(duvida) {
        setDuvidaSelecionada(duvida);
        setRespostaTexto('');
        setTornarPublica(false);
        if (!duvida.lida) marcarLida(duvida.id);
    }

    async function enviarResposta(e) {
        e.preventDefault();
        if (!respostaTexto.trim()) return;
        setEnviando(true);
        try {
            await responderDuvida(duvidaSelecionada.id, respostaTexto, tornarPublica);
            setDuvidaSelecionada(null);
            setRecarregar((v) => v + 1);
        } catch (err) {
            setErro(err.message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-2 border-b border-slate-200 pb-3">
                {[['pendentes', 'Não respondidas'], ['respondidas', 'Já respondidas']].map(([chave, rotulo]) => (
                    <button
                        key={chave}
                        onClick={() => setFiltroStatus(chave)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                            filtroStatus === chave
                                ? 'bg-orange-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {rotulo}
                    </button>
                ))}
            </div>

            {erro && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
            )}

            <div className="space-y-4">
                {carregando ? (
                    <p className="text-sm text-slate-400">Carregando dúvidas...</p>
                ) : duvidas.length === 0 ? (
                    <p className="text-sm text-slate-400">Nenhuma dúvida nesta aba.</p>
                ) : (
                    duvidas.map((duvida) => (
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
                                    <span className="text-xs font-bold text-orange-600">{duvida.aula}</span>
                                    <span className="text-xs text-slate-400">•</span>
                                    <span className="text-xs font-semibold text-slate-500">
                                        Exercício: {duvida.exercicio_titulo}
                                    </span>
                                    <span className="text-xs text-slate-400">• {duvida.aluno}</span>
                                </div>

                                <p className="font-semibold text-sm pt-1 whitespace-pre-wrap">{duvida.pergunta}</p>

                                {duvida.resposta && (
                                    <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                                        <strong className="text-slate-800">Sua resposta:</strong> {duvida.resposta}
                                        {duvida.publica && (
                                            <span className="ml-2 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                Pública no exercício
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {!duvida.resposta && (
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
                    <form onSubmit={enviarResposta} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="font-extrabold text-slate-900">Responder dúvida</h3>
                            <button
                                type="button"
                                onClick={() => setDuvidaSelecionada(null)}
                                aria-label="Fechar"
                                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="text-xs space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                            <div>
                                <span className="text-slate-400 font-medium">Origem: </span>
                                <span className="font-bold text-orange-600">{duvidaSelecionada.aula}</span>
                                <span className="text-slate-400"> · {duvidaSelecionada.exercicio_titulo}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 font-medium">Aluno: </span>
                                <span className="font-semibold text-slate-700">{duvidaSelecionada.aluno}</span>
                            </div>
                            <div className="pt-1 text-slate-800 font-medium italic border-t border-slate-200/60 mt-1">
                                "{duvidaSelecionada.pergunta}"
                            </div>
                        </div>

                        <textarea
                            rows={4}
                            value={respostaTexto}
                            onChange={(e) => setRespostaTexto(e.target.value)}
                            placeholder="Escreva sua resposta com o máximo de detalhes possível..."
                            className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
                            autoFocus
                        />

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={tornarPublica}
                                    onChange={(e) => setTornarPublica(e.target.checked)}
                                    className="size-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                />
                                Tornar pública (aparece no exercício, sem o nome do aluno)
                            </label>

                            <button
                                type="submit"
                                disabled={enviando || !respostaTexto.trim()}
                                className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700 shadow-sm shadow-orange-200 disabled:opacity-50"
                            >
                                {enviando ? 'Enviando...' : 'Enviar resposta'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}