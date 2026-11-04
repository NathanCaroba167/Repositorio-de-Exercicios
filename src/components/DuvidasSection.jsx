import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "./AuthProvider";
import { useStudy } from "./UseStudy";
import { getDuvidas } from "../services/api";

export function DuvidasSection({ exerciseId }) {
    const { usuario } = useAuth();
    const { doubtVersion } = useStudy();
    const [duvidas, setDuvidas] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!usuario) return;
        let ativo = true;
        getDuvidas(exerciseId)
            .then((dados) => { if (ativo) { setDuvidas(dados); setErro(""); } })
            .catch((err) => { if (ativo) setErro(err.message); });
        return () => { ativo = false; };
    }, [exerciseId, usuario, doubtVersion]);

    return (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-sm font-extrabold text-slate-900">Dúvidas deste exercício</h2>

            {!usuario ? (
                <p className="mt-3 text-sm text-slate-500">
                    <Link to="/login" className="font-bold text-orange-600 hover:underline">Entre na sua conta</Link>{" "}
                    para ver e enviar dúvidas.
                </p>
            ) : erro ? (
                <p role="alert" className="mt-3 text-sm text-red-700">{erro}</p>
            ) : duvidas.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">Nenhuma dúvida ainda. Seja o primeiro a perguntar.</p>
            ) : (
                <ul className="mt-4 space-y-4">
                    {duvidas.map((d) => (
                        <li key={d.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="font-bold text-slate-600">{d.aluno}</span>
                                <span>{new Date(d.criado_em).toLocaleDateString("pt-BR")}</span>
                            </div>
                            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">{d.pergunta}</p>
                            {d.resposta ? (
                                <div className="mt-3 rounded-lg border border-orange-100 bg-orange-50 p-3">
                                    <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-orange-700">
                                        Resposta do professor
                                    </p>
                                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{d.resposta}</p>
                                </div>
                            ) : (
                                <span className="mt-3 inline-block rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                                    Aguardando resposta
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}