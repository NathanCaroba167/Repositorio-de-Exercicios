import { useEffect, useState } from 'react';
import { getReferencias, criarReferencia, removerReferencia, urlArquivo } from '../../services/api';

const entrada = 'p-2 border rounded-lg text-sm w-full';
const VAZIO = { titulo: '', aula: '', formato: 'Vídeo', url: '', descricao: '' };
const LIMITE_PDF = 10 * 1024 * 1024;

export function RecursosTab({ disciplinaId, tipo, titulo, campos }) {
    const [itens, setItens] = useState([]);
    const [form, setForm] = useState(VAZIO);
    const [arquivo, setArquivo] = useState(null);
    const [chaveArquivo, setChaveArquivo] = useState(0); // zera o campo de arquivo
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState('');
    const [recarregar, setRecarregar] = useState(0);

    useEffect(() => {
        let ativo = true;
        setCarregando(true);
        getReferencias(disciplinaId, tipo)
            .then((dados) => { if (ativo) { setItens(dados); setErro(''); } })
            .catch((err) => { if (ativo) setErro(err.message); })
            .finally(() => { if (ativo) setCarregando(false); });
        return () => { ativo = false; };
    }, [disciplinaId, tipo, recarregar]);

    const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

    async function salvar(e) {
        e.preventDefault();
        setErro('');
        if (arquivo && arquivo.size > LIMITE_PDF) {
            setErro('O PDF deve ter no máximo 10 MB');
            return;
        }
        const dados = new FormData();
        dados.append('tipo', tipo);
        dados.append('disciplina_id', String(disciplinaId));
        dados.append('titulo', form.titulo);
        if (campos.includes('aula') && form.aula) dados.append('aula', form.aula);
        if (campos.includes('formato')) dados.append('formato', form.formato);
        if (campos.includes('url') && form.url) dados.append('url', form.url);
        if (campos.includes('descricao') && form.descricao) dados.append('descricao', form.descricao);
        if (campos.includes('arquivo') && arquivo) dados.append('arquivo', arquivo);

        setEnviando(true);
        try {
            await criarReferencia(dados);
            setForm(VAZIO);
            setArquivo(null);
            setChaveArquivo((k) => k + 1);
            setRecarregar((v) => v + 1);
        } catch (err) {
            setErro(err.message);
        } finally {
            setEnviando(false);
        }
    }

    async function remover(item) {
        if (!window.confirm(`Remover "${item.titulo}"?`)) return;
        try {
            await removerReferencia(item.id);
            setRecarregar((v) => v + 1);
        } catch (err) {
            setErro(err.message);
        }
    }

    return (
        <div className="space-y-6">
            <form onSubmit={salvar} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">+ {titulo}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text" placeholder="Título" required maxLength={200}
                        value={form.titulo} onChange={mudar('titulo')} className={entrada}
                    />
                    {campos.includes('aula') && (
                        <input
                            type="text" placeholder="Aula (ex.: Aula 1)" maxLength={50}
                            value={form.aula} onChange={mudar('aula')} className={entrada}
                        />
                    )}
                    {campos.includes('formato') && (
                        <select value={form.formato} onChange={mudar('formato')} className={entrada}>
                            <option value="Vídeo">Vídeo (YouTube/Link)</option>
                            <option value="Slide">Slide</option>
                            <option value="Imagem">Imagem</option>
                        </select>
                    )}
                    {campos.includes('url') && (
                        <input
                            type="url" placeholder="Link (https://...)" required
                            value={form.url} onChange={mudar('url')} className={entrada}
                        />
                    )}
                    {campos.includes('descricao') && (
                        <input
                            type="text" placeholder="Descrição curta"
                            value={form.descricao} onChange={mudar('descricao')} className={entrada}
                        />
                    )}
                    {campos.includes('arquivo') && (
                        <div>
                            <input
                                key={chaveArquivo} type="file" accept="application/pdf" required
                                onChange={(e) => setArquivo(e.target.files[0] || null)}
                                className="text-sm"
                            />
                            <p className="mt-1 text-xs text-slate-400">Somente PDF, até 10 MB.</p>
                        </div>
                    )}
                </div>
                {erro && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}
                <button
                    type="submit" disabled={enviando}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 disabled:opacity-60"
                >
                    {enviando ? 'Salvando...' : 'Salvar'}
                </button>
            </form>

            <div className="space-y-3">
                {carregando ? (
                    <p className="text-sm text-slate-400">Carregando...</p>
                ) : itens.length === 0 ? (
                    <p className="text-sm text-slate-400">Nada cadastrado ainda.</p>
                ) : (
                    itens.map((item) => (
                        <div key={item.id} className="p-4 bg-white border rounded-xl shadow-sm flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    {item.aula && <span className="text-xs font-bold text-orange-600">{item.aula}</span>}
                                    {item.formato && (
                                        <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md font-bold">
                                            {item.formato}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-gray-800">{item.titulo}</h3>
                                {item.descricao && <p className="text-xs text-gray-500 mt-1">{item.descricao}</p>}
                            </div>
                            <div className="flex shrink-0 items-center gap-4 text-sm font-bold">
                                {item.url && (
                                    <a href={item.url} target="_blank" rel="noreferrer noopener" className="text-orange-600 hover:underline">
                                        Abrir link
                                    </a>
                                )}
                                {item.arquivo_url && (
                                    <a href={urlArquivo(item.arquivo_url)} target="_blank" rel="noreferrer noopener" className="text-orange-600 hover:underline">
                                        Abrir PDF
                                    </a>
                                )}
                                <button onClick={() => remover(item)} className="text-red-600 hover:underline">
                                    Remover
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}