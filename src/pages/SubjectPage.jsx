import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { useStudy } from "../components/UseStudy";
import { useAuth } from "../components/AuthProvider";
import { exercises as exerciciosEstaticos } from "../data/exercises";
import { Icon } from "../components/Icon";
import { PageSection } from "../components/PageSection";
import { toSlug } from "../components/ToSlug";
import { NotFoundPage } from "./NotFoundPage";
import { getExercicios, getDuvidasPublicas } from "../services/api";
import { RecursosAluno } from "../components/disciplina/RecursosAluno";
import { DuvidasAluno } from "../components/disciplina/DuvidasAluno";

const ABAS = [
    ["aulas", "Aulas"],
    ["materiais", "Materiais"],
    ["exercicios", "Exercícios"],
    ["duvidas", "Dúvidas"],
    ["referencias", "Referências"],
];

function normalizar(e) {
    return {
        id: e.id,
        disciplinaId: e.disciplina_id,
        subject: e.disciplina || e.subject,
        code: e.codigo || e.code,
        title: e.titulo || e.title,
        content: e.conteudo || e.content,
        description: e.descricao || e.description,
        professor: e.professor,
        difficulty: e.dificuldade || e.difficulty,
        lesson: e.aula || e.lesson,
        engagement: e.total_uteis ?? e.engagement ?? 0,
    };
}

function ExerciciosAluno({ items, subject, disciplinaId }) {
    const { completed, openDoubtModal } = useStudy();
    const { usuario } = useAuth();
    const [faq, setFaq] = useState([]);

    useEffect(() => {
        if (!usuario || !disciplinaId) return;
        let ativo = true;
        getDuvidasPublicas(disciplinaId)
            .then((dados) => { if (ativo) setFaq(dados); })
            .catch(() => {});
        return () => { ativo = false; };
    }, [usuario, disciplinaId]);

    const faqVisivel = usuario ? faq : [];

    return (
        <>
            <div className="sticky top-[74px] z-20 -mx-5 mb-8 border-y border-slate-200 bg-[#f7f8fb]/95 px-5 py-3 backdrop-blur lg:-mx-8 lg:px-8">
                <div className="mx-auto flex max-w-[1216px] gap-2 overflow-x-auto">
                    {items.map((exercise) => (
                        <a
                            key={exercise.id}
                            href={`#conteudo-${exercise.id}`}
                            className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-orange-300 hover:text-orange-700"
                        >
                            {exercise.lesson}. {exercise.content}
                        </a>
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-4xl space-y-5">
                {items.map((exercise) => {
                    const numeroDaAula = String(exercise.lesson).replace(/\D/g, "") || "0";
                    const duvidasDoExercicio = faqVisivel.filter((d) => d.exercicio_id === exercise.id);

                    return (
                        <article
                            id={`conteudo-${exercise.id}`}
                            key={exercise.id}
                            className="scroll-mt-36 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
                        >
                            <div className="flex gap-4 sm:gap-6">
                                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-sm font-extrabold text-orange-700">
                                    {numeroDaAula.padStart(2, "0")}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-orange-600">
                                        {exercise.content}
                                    </p>
                                    <h2 className="mt-2 text-xl font-extrabold tracking-[-0.025em] text-slate-900">
                                        {exercise.title}
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">{exercise.description}</p>

                                    {duvidasDoExercicio.length > 0 && (
                                        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                                            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                                Dúvidas frequentes deste exercício
                                            </span>
                                            {duvidasDoExercicio.map((d) => (
                                                <div key={d.id} className="space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700">
                                                    <p className="whitespace-pre-wrap font-semibold text-slate-900">P: {d.pergunta}</p>
                                                    <p className="whitespace-pre-wrap text-slate-600">
                                                        <strong className="text-orange-600">Resp:</strong> {d.resposta}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
                                            <span>{exercise.lesson}</span>
                                            <span>{exercise.professor}</span>
                                            <span>{exercise.difficulty}</span>
                                            <span>{exercise.engagement} estudantes acharam útil</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {usuario?.tipo !== "professor" && (
                                                <button
                                                    onClick={() => openDoubtModal(subject, exercise.title, exercise.id)}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-orange-200 hover:text-orange-700"
                                                >
                                                    <Icon name="doubt" size={16} /> Tirar dúvida
                                                </button>
                                            )}
                                            <Link
                                                to={`/exercicios/${exercise.id}`}
                                                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
                                            >
                                                {completed.includes(exercise.id) ? "Revisar exercício" : "Abrir exercício"}
                                                <Icon name="arrow" size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </>
    );
}

export function SubjectPage() {
    const { subjectSlug } = useParams();
    const { enrolled, toggleEnrolled } = useStudy();
    const { usuario } = useAuth();
    const [fonte, setFonte] = useState(null);
    const [aba, setAba] = useState("exercicios");

    useEffect(() => {
        getExercicios()
            .then((dados) => setFonte(dados.length ? dados : exerciciosEstaticos))
            .catch(() => setFonte(exerciciosEstaticos));
    }, []);

    if (fonte === null) {
        return (
            <PageSection eyebrow="Conteúdos da matéria" title="Carregando...">
                <p className="text-sm text-slate-500">Buscando conteúdos...</p>
            </PageSection>
        );
    }

    const todos = fonte.map(normalizar);
    const subject = [...new Set(todos.map((e) => e.subject))].find((s) => toSlug(s) === subjectSlug);
    const items = todos.filter((e) => e.subject === subject).sort((a, b) => a.id - b.id);

    if (!subject || !items.length) return <NotFoundPage />;

    const disciplinaId = items[0].disciplinaId; // undefined se vier do arquivo estático

    return (
        <PageSection
            eyebrow="Conteúdos da matéria"
            title={subject}
            description={`${items[0].code} · ${items.length} conteúdos organizados para você estudar em sequência.`}
            action={
                usuario?.tipo !== "professor" && (
                    <button
                        onClick={() => toggleEnrolled(subject)}
                        className={`hidden items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition sm:inline-flex ${
                            enrolled.includes(subject)
                                ? "border border-orange-200 bg-orange-50 text-orange-700"
                                : "bg-orange-600 text-white hover:bg-orange-700"
                        }`}
                    >
                        <Icon name={enrolled.includes(subject) ? "check" : "bookmark"} size={17} />
                        {enrolled.includes(subject) ? "Matéria em curso" : "Adicionar ao meu curso"}
                    </button>
                )
            }
        >
            <div className="mb-8 flex overflow-x-auto border-b border-gray-200">
                {ABAS.map(([chave, rotulo]) => (
                    <button
                        key={chave}
                        onClick={() => setAba(chave)}
                        className={`whitespace-nowrap px-6 py-4 text-sm font-medium transition-colors ${
                            aba === chave
                                ? "border-b-2 border-orange-600 font-bold text-orange-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {rotulo}
                    </button>
                ))}
            </div>

            {aba === "exercicios" && (
                <ExerciciosAluno items={items} subject={subject} disciplinaId={disciplinaId} />
            )}
            {aba === "aulas" && (
                <RecursosAluno disciplinaId={disciplinaId} tipo="aula" vazio="O professor ainda não publicou aulas." />
            )}
            {aba === "materiais" && (
                <RecursosAluno disciplinaId={disciplinaId} tipo="material" vazio="Nenhum material publicado ainda." />
            )}
            {aba === "referencias" && (
                <RecursosAluno disciplinaId={disciplinaId} tipo="referencia" vazio="Nenhuma referência publicada ainda." />
            )}
            {aba === "duvidas" && <DuvidasAluno disciplinaId={disciplinaId} subject={subject} />}
        </PageSection>
    );
}