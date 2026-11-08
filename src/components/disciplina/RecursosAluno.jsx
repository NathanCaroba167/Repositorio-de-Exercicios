import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../AuthProvider";
import { getReferencias, urlArquivo } from "../../services/api";

export function RecursosAluno({ disciplinaId, tipo, vazio }) {
    const { usuario } = useAuth();
    const [itens, setItens] = useState(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!usuario || !disciplinaId) return;
        let ativo = true;
        setItens(null);
        getReferencias(disciplinaId, tipo)
            .then((dados) => { if (ativo) { setItens(dados); setErro(""); } })
            .catch((err) => { if (ativo) setErro(err.message); });
        return () => { ativo = false; };
    }, [usuario, disciplinaId, tipo]);

    const caixa = "mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6";

    if (!usuario) {
        return (
            <p className={`${caixa} text-sm text-slate-500`}>
                <Link to="/login" className="font-bold text-orange-600 hover:underline">Entre na sua conta</Link>{" "}
                para acessar este conteúdo.
            </p>
        );
    }
    if (!disciplinaId) {
        return <p className={`${caixa} text-sm text-slate-500`}>Disponível apenas com o servidor conectado.</p>;
    }
    if (erro) return <p role="alert" className={`${caixa} text-sm text-red-700`}>{erro}</p>;
    if (itens === null) return <p className={`${caixa} text-sm text-slate-400`}>Carregando...</p>;
    if (itens.length === 0) return <p className={`${caixa} text-sm text-slate-500`}>{vazio}</p>;

    return (
        <div className="mx-auto max-w-4xl space-y-3">
            {itens.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            {item.aula && <span className="text-xs font-bold text-orange-600">{item.aula}</span>}
                            {item.formato && (
                                <span className="rounded-md bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-700">
                                    {item.formato}
                                </span>
                            )}
                        </div>
                        <h3 className="mt-1 font-semibold text-slate-900">{item.titulo}</h3>
                        {item.descricao && <p className="mt-1 text-sm text-slate-500">{item.descricao}</p>}
                    </div>
                    <div className="flex shrink-0 gap-4 text-sm font-bold">
                        {item.url && (
                            <a href={item.url} target="_blank" rel="noreferrer noopener" className="text-orange-600 hover:underline">
                                Abrir
                            </a>
                        )}
                        {item.arquivo_url && (
                            <a href={urlArquivo(item.arquivo_url)} target="_blank" rel="noreferrer noopener" className="text-orange-600 hover:underline">
                                Baixar PDF
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}