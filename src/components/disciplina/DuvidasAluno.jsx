import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../AuthProvider";
import { useStudy } from "../UseStudy";
import { getMinhasDuvidas, marcarDuvidaResolvida } from "../../services/api";

export function DuvidasAluno({ disciplinaId, subject }) {
    const { usuario } = useAuth();
    const { openDoubtModal, doubtVersion } = useStudy();
    const [duvidas, setDuvidas] = useState(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (usuario?.tipo !== "aluno") return;
        let ativo = true;
        getMinhasDuvidas()
            .then((todas) => {
                if (ativo) {
                    setDuvidas(todas.filter((d) => d.disciplina_id === disciplinaId));
                    setErro("");
                }
            })
            .catch((err) => { if (ativo) setErro(err.message); });
        return () => { ativo = false; };
    }, [usuario, disciplinaId, doubtVersion]);

    async function entendi(id) {
        try {
            await marcarDuvidaResolvida(id);
            setDuvidas((lista) => lista.map((d) => (d.id === id ? { ...d, resolvida: true } : d)));
        } catch (err) {
            setErro(err.message);
        }
    }

    const caixa = "mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6";

    if (!usuario) {
        return (
            <p className={`${caixa} text-sm text-slate-500`}>
                <Link to="/login" className="font-bold text-orange-600 hover:underline">Entre na sua conta</Link>{" "}
                para ver suas dúvidas.
            </p>
        );
    }
    if (usuario.tipo !== "aluno") {
        return <p className={`${caixa} text-sm text-slate-500`}>Professores respondem as dúvidas pelo painel "Gerenciar disciplina".</p>;
    }
    if (erro) return <p role="alert" className={`${caixa} text-sm text-red-700`}>{erro}</p>;
    if (duvidas === null) return <p className={`${caixa} text-sm text-slate-400`}>Carregando...</p>;
    if (duvidas.length === 0) {
        return <p className={`${caixa} text-sm text-slate-500`}>Você ainda não enviou dúvidas nesta matéria. Use "Tirar dúvida" em qualquer exercício.</p>;
    }

    return (
        <div className="mx-auto max-w-4xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Suas dúvidas e respostas</h3>
            {duvidas.map((d) => (
                <div key={d.id} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-bold text-orange-600">{d.aula} · {d.exercicio_titulo}</span>
                        {d.resolvida ? (
                            <span className="rounded-md bg-green-100 px-2 py-0.5 font-bold text-green-700">Resolvida</span>
                        ) : !d.resposta ? (
                            <span className="rounded-md bg-slate-200 px-2 py-0.5 font-bold text-slate-600">Aguardando resposta</span>
                        ) : null}
                    </div>

                    <p className="whitespace-pre-wrap text-sm font-semibold text-slate-900">{d.pergunta}</p>

                    {d.resposta && (
                        <div className="space-y-1 rounded-lg border border-orange-100 bg-orange-50 p-3 text-sm text-slate-700">
                            <strong className="block text-xs font-extrabold uppercase text-orange-700">Resposta do professor</strong>
                            <p className="whitespace-pre-wrap">{d.resposta}</p>
                        </div>
                    )}

                    {d.resposta && !d.resolvida && (
                        <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                            <button
                                onClick={() => openDoubtModal(subject, d.exercicio_titulo, d.exercicio_id)}
                                className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                            >
                                Perguntar novamente
                            </button>
                            <button
                                onClick={() => entendi(d.id)}
                                className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-700"
                            >
                                Entendi
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}