import { useState } from "react";
import { useParams, Link } from "react-router";
import { useStudy } from "../components/UseStudy";
import { exercises } from "../data/exercises";
import { PageSection } from "../components/PageSection";
import { toSlug } from "../components/ToSlug";
import { Icon } from "../components/Icon";
import { NotFoundPage } from "./NotFoundPage";

export function ExercisePage() {
    const { exerciseId } = useParams()
    const { completed, liked, toggleCompleted, toggleLiked } = useStudy()
    const exercise = exercises.find((item) => item.id === Number(exerciseId))
    const [showSolution, setShowSolution] = useState(false)

    if (!exercise) return <NotFoundPage />

    return (
        <PageSection
            eyebrow={exercise.content}
            title={exercise.title}
            description={`${exercise.subject} · ${exercise.code}`}
        >
            <div className="mx-auto max-w-4xl">
                <Link
                    to={`/materias/${toSlug(exercise.subject)}`}
                    className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-orange-600"
                >
                    <span className="rotate-180">
                        <Icon name="arrow" size={16} />
                    </span>
                    Voltar para {exercise.subject}
                </Link>
                <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(18,32,64,0.06)]">
                    <div className="border-b border-slate-100 px-6 py-6 sm:px-9">
                        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500">
                            <span className="flex items-center gap-2">
                                <Icon name="user" size={15} /> Prof. {exercise.professor}
                            </span>
                            <span className="flex items-center gap-2">
                                <Icon name="bookmark" size={15} /> {exercise.difficulty}
                            </span>
                            <span className="flex items-center gap-2">
                                <Icon name="grid" size={15} /> {exercise.lesson}
                            </span>
                            <span className="flex items-center gap-2">
                                <Icon name="clock" size={15} /> {exercise.time}
                            </span>
                        </div>
                    </div>
                    <div className="px-6 py-7 sm:px-9 sm:py-9">
                        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                            Enunciado
                        </p>
                        <p className="mt-4 text-base leading-8 text-slate-700">
                            {exercise.description}
                        </p>
                        <div className="mt-9 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50">
                            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                                <div className="flex items-center gap-3 text-orange-700">
                                    <span className="grid size-9 place-items-center rounded-lg bg-white shadow-sm">
                                        <Icon name="spark" size={17} />
                                    </span>
                                    <div>
                                        <p className="text-xs font-extrabold uppercase tracking-[0.12em]">
                                            Resposta comentada
                                        </p>
                                        <p className="mt-0.5 text-xs font-medium text-orange-700/70">
                                            {showSolution
                                                ? "A resposta está visível"
                                                : "Tente resolver antes de conferir"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowSolution((current) => !current)}
                                    aria-expanded={showSolution}
                                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-xs font-bold text-orange-700 shadow-sm transition hover:bg-orange-100"
                                >
                                    <Icon name={showSolution ? "eyeOff" : "eye"} size={17} />
                                    <span className="hidden sm:inline">
                                        {showSolution ? "Ocultar resposta" : "Mostrar resposta"}
                                    </span>
                                </button>
                            </div>
                            {showSolution && (
                                <div className="border-t border-orange-100 bg-white/55 px-5 py-5 sm:px-6">
                                    <p className="text-[15px] leading-7 text-slate-700">
                                        {exercise.solution}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-extrabold text-slate-900">
                                    Registre seu progresso
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {exercise.engagement + (liked.includes(exercise.id) ? 1 : 0)}{" "}
                                    estudantes consideraram este exercício útil.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => toggleLiked(exercise.id)}
                                    aria-pressed={liked.includes(exercise.id)}
                                    className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition ${
                                        liked.includes(exercise.id)
                                            ? "border-orange-200 bg-orange-50 text-orange-700"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-orange-200"
                                    }`}
                                >
                                    <Icon name="thumb" size={16} />
                                    {liked.includes(exercise.id)
                                        ? "Foi útil"
                                        : "Marcar como útil"}
                                </button>
                                <button
                                    onClick={() => toggleCompleted(exercise.id)}
                                    aria-pressed={completed.includes(exercise.id)}
                                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                                        completed.includes(exercise.id)
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-orange-600 text-white hover:bg-orange-700"
                                    }`}
                                >
                                    <Icon name="check" size={16} />
                                    {completed.includes(exercise.id)
                                        ? "Exercício concluído"
                                        : "Marcar como concluído"}
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </PageSection>
    )
}