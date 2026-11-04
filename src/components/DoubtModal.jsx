import { useState } from "react";
import { Link } from "react-router";
import { useStudy } from "./UseStudy";
import { useAuth } from "./AuthProvider";
import { Icon } from "./Icon";
import { criarDuvida } from "../services/api";

export function DoubtModal() {
    const { doubtContext, closeDoubtModal, duvidaEnviada } = useStudy();
    const { usuario } = useAuth();
    const [pergunta, setPergunta] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [enviada, setEnviada] = useState(false);

    if (!doubtContext.isOpen) return null;

    function fechar() {
        setPergunta("");
        setErro("");
        setEnviada(false);
        closeDoubtModal();
    }

    async function enviar() {
        setErro("");
        setEnviando(true);
        try {
            await criarDuvida(doubtContext.exerciseId, pergunta);
            setEnviada(true);
            setPergunta("");
            duvidaEnviada();
        } catch (err) {
            setErro(err.message);
        } finally {
            setEnviando(false);
        }
    }

    let corpo;
    if (!usuario) {
        corpo = (
            <div className="p-6 text-center">
                <p className="text-sm font-bold text-slate-800">Entre para enviar uma dúvida</p>
                <p className="mt-1 text-sm text-slate-500">
                    Assim o professor sabe quem perguntou e você acompanha a resposta.
                </p>
                <Link
                    to="/login"
                    onClick={fechar}
                    className="mt-4 inline-block rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700"
                >
                    Entrar
                </Link>
            </div>
        );
    } else if (usuario.tipo !== "aluno") {
        corpo = (
            <p className="p-6 text-center text-sm text-slate-500">
                Apenas alunos enviam dúvidas. Professores respondem pelo painel.
            </p>
        );
    } else if (enviada) {
        corpo = (
            <div className="p-6 text-center">
                <p className="text-sm font-bold text-emerald-700">Dúvida enviada!</p>
                <p className="mt-1 text-sm text-slate-500">
                    A resposta do professor vai aparecer na página do exercício.
                </p>
                <button
                    onClick={fechar}
                    className="mt-4 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                    Fechar
                </button>
            </div>
        );
    } else {
        corpo = (
            <>
                <div className="space-y-4 p-4">
                    <div className="flex items-center border-b border-slate-100 pb-2">
                        <span className="w-16 text-sm text-slate-500">Para:</span>
                        <span className="rounded bg-orange-100 px-2 py-0.5 text-[13px] font-semibold text-orange-800">
                            {doubtContext.subject}
                        </span>
                    </div>
                    {doubtContext.exercise && (
                        <div className="flex items-center border-b border-slate-100 pb-2">
                            <span className="w-16 text-sm text-slate-500">Ex:</span>
                            <span className="text-[13px] font-medium text-slate-700">
                                {doubtContext.exercise}
                            </span>
                        </div>
                    )}
                    <textarea
                        value={pergunta}
                        onChange={(e) => setPergunta(e.target.value)}
                        className="min-h-[180px] w-full resize-none bg-transparent pt-2 text-[15px] text-slate-800 outline-none placeholder:text-slate-400"
                        placeholder="Descreva sua dúvida com o máximo de detalhes possível..."
                        maxLength={2000}
                        autoFocus
                    />
                    {erro && (
                        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                            {erro}
                        </p>
                    )}
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 bg-white p-4">
                    <button
                        onClick={enviar}
                        disabled={enviando || !pergunta.trim() || !doubtContext.exerciseId}
                        className="rounded-full bg-orange-600 px-6 py-2 text-sm font-bold text-white transition hover:bg-orange-700 disabled:opacity-50"
                    >
                        {enviando ? "Enviando..." : "Enviar"}
                    </button>
                    <span className="text-xs text-slate-400">{pergunta.length}/2000</span>
                </div>
            </>
        );
    }

    return (
        <div
            role="dialog"
            aria-label="Nova dúvida"
            className="fixed bottom-0 right-4 z-[100] w-[calc(100vw-2rem)] overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.2)] sm:right-16 sm:w-[450px]"
        >
            <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-slate-50 px-4">
                <span className="text-[13px] font-bold text-slate-700">Nova dúvida</span>
                <button
                    onClick={fechar}
                    aria-label="Fechar"
                    className="text-slate-400 transition hover:text-slate-700"
                >
                    <Icon name="close" size={16} />
                </button>
            </div>
            {corpo}
        </div>
    );
}