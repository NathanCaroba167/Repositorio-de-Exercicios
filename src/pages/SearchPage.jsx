import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Icon } from "../components/Icon";

export function SearchPage() {
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [isPopUpOpen, setIsPopUpOpen] = useState(true) // Estado para controlar o pop-up flutuante

    return (
        <section className="relative min-h-[calc(100vh-139px)] bg-gradient-to-b from-orange-50/60 via-white to-white">
            <div className="mx-auto flex min-h-[calc(100vh-139px)] max-w-[1100px] items-center justify-center px-5 py-8 lg:px-8">
                <div className="w-full text-center">
                    <div className="mx-auto max-w-2xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-orange-700">
                            <Icon name="spark" size={14} /> Aprenda no seu ritmo
                        </div>
                        <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-5xl">
                            Encontre o exercício.
                            <br />
                            <span className="text-orange-600">Entenda a solução.</span>
                        </h1>
                        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500">
                            Busque por tema, matéria ou professor e encontre soluções
                            comentadas para apoiar seus estudos.
                        </p>
                    </div>

                    <form
                        className="mx-auto mt-8 max-w-3xl"
                        onSubmit={(event) => {
                            event.preventDefault()
                            const query = search.trim()
                            navigate(
                                query
                                    ? `/materias?q=${encodeURIComponent(query)}`
                                    : "/materias",
                            )
                        }}
                    >
                        <label className="group flex h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 shadow-[0_10px_35px_rgba(234,88,12,0.10)] transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
                            <span className="text-slate-400 group-focus-within:text-orange-600">
                                <Icon name="search" size={22} />
                            </span>
                            <input
                                className="min-w-0 flex-1 bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Busque por tema, matéria ou professor..."
                                autoFocus
                            />
                            <button className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700">
                                Buscar
                            </button>
                        </label>
                    </form>

                    <div className="mx-auto mt-6 grid max-w-2xl gap-4 sm:grid-cols-2">
                        <button
                            onClick={() => navigate("/materias")}
                            className="group relative flex flex-col items-center rounded-2xl border border-orange-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100/70"
                        >
                            <span className="grid size-14 place-items-center rounded-2xl bg-orange-600 text-white shadow-md shadow-orange-200">
                                <Icon name="book" size={25} />
                            </span>
                            <span className="mt-3">
                                <span className="block text-base font-extrabold text-slate-900">
                                  Listar por matérias
                                </span>
                                <span className="mt-1 block text-xs leading-5 text-slate-500">
                                  Explore a biblioteca por disciplina
                                </span>
                            </span>
                            <span className="absolute right-4 top-4 text-orange-300 transition group-hover:translate-x-1 group-hover:text-orange-600">
                                <Icon name="chevron" size={18} />
                            </span>
                        </button>
                        <button
                            onClick={() => navigate("/meu-curso")}
                            className="group relative flex flex-col items-center rounded-2xl border border-orange-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100/70"
                        >
                            <span className="grid size-14 place-items-center rounded-2xl bg-orange-100 text-orange-700">
                                <Icon name="trend" size={25} />
                            </span>
                            <span className="mt-3">
                                <span className="block text-base font-extrabold text-slate-900">
                                  Acompanhar meu curso
                                </span>
                                <span className="mt-1 block text-xs leading-5 text-slate-500">
                                  Escolha matérias e veja seu progresso
                                </span>
                            </span>
                            <span className="absolute right-4 top-4 text-orange-300 transition group-hover:translate-x-1 group-hover:text-orange-600">
                                <Icon name="chevron" size={18} />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* O POP-UP FLUTUANTE ADICIONADO AQUI (Com escala de 70%) */}
            {isPopUpOpen && (
                <div className="fixed bottom-6 right-6 z-40 origin-bottom-right scale-[0.70]">
                    <div className="relative w-[340px] rounded-[32px] border border-slate-200/60 bg-white/90 p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] backdrop-blur-xl">

                        {/* Botão de minimizar/fechar o pop-up */}
                        <button
                            onClick={() => setIsPopUpOpen(false)}
                            className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-700"
                        >
                            <Icon name="close" size={20} />
                        </button>

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ea580c] shadow-lg shadow-orange-200">
                            <span className="text-white"><Icon name="user" size={24} /></span>
                        </div>

                        <h3 className="mt-6 text-[22px] font-extrabold leading-tight tracking-tight text-slate-950">
                            Seu progresso,<br />
                            sempre com você.
                        </h3>

                        <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
                            Entre para acessar sua conta em qualquer dispositivo.
                        </p>

                        <button
                            onClick={() => navigate("/login")}
                            className="mt-6 w-full rounded-xl bg-[#ea580c] py-3.5 text-base font-bold text-white transition hover:bg-[#c2410c]"
                        >
                            Entrar
                        </button>

                        <div className="mt-6 flex flex-col items-center gap-1 text-center">
                            <span className="text-[13px] text-slate-500">
                                Ainda não tem uma conta?
                            </span>
                            <button
                                onClick={() => navigate("/cadastro")}
                                className="text-[13px] font-bold text-[#ea580c] hover:underline"
                            >
                                Criar conta grátis
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}