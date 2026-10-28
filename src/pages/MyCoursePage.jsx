import { Link } from "react-router";
import { useStudy } from "../components/UseStudy";
import { exercises, subjects, colorClasses } from "../data/exercises";
import { PageSection } from "../components/PageSection";
import { StatCard } from "../components/StatCard";
import { Icon } from "../components/Icon";
import { toSlug } from "../components/ToSlug";

export function MyCoursePage() {
    const { enrolled, completed, toggleEnrolled } = useStudy();
    const enrolledExercises = exercises.filter((exercise) =>
        enrolled.includes(exercise.subject)
    );
    const concluded = enrolledExercises.filter((exercise) =>
        completed.includes(exercise.id)
    ).length;
    const progress = enrolledExercises.length
        ? Math.round((concluded / enrolledExercises.length) * 100)
        : 0;

    return (
        <PageSection
            eyebrow="Área do estudante"
            title="Meu curso"
            description="Selecione as disciplinas que está cursando e acompanhe seu avanço nos exercícios."
        >
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <StatCard
                    icon="book"
                    label="Matérias atuais"
                    value={String(enrolled.length)}
                />
                <StatCard
                    icon="check"
                    label="Exercícios concluídos"
                    value={`${concluded}/${enrolledExercises.length}`}
                />
                <StatCard icon="trend" label="Progresso geral" value={`${progress}%`} />
            </div>

            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                        Escolha suas matérias
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        As escolhas ficam salvas neste navegador.
                    </p>
                </div>
                {enrolled.length > 0 && (
                    <p className="text-sm font-bold text-orange-600">
                        {enrolled.length} de {subjects.length} selecionadas
                    </p>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {subjects.map((subject) => {
                    const selected = enrolled.includes(subject);
                    const subjectExercises = exercises.filter(
                        (exercise) => exercise.subject === subject
                    );
                    const subjectConcluded = subjectExercises.filter((exercise) =>
                        completed.includes(exercise.id)
                    ).length;
                    const sample = subjectExercises[0];

                    return (
                        <article
                            key={subject}
                            className={`rounded-2xl border bg-white p-5 transition ${
                                selected
                                    ? "border-orange-300 shadow-[0_8px_24px_rgba(234,88,12,0.08)]"
                                    : "border-slate-200"
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <span
                                    className={`grid size-11 shrink-0 place-items-center rounded-xl border ${colorClasses[sample.color]}`}
                                >
                                    <Icon name="book" size={20} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="font-extrabold text-slate-900">{subject}</p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {sample.code} · Prof. {sample.professor}
                                    </p>
                                </div>
                                <button
                                    onClick={() => toggleEnrolled(subject)}
                                    role="checkbox"
                                    aria-checked={selected}
                                    aria-label={`${
                                        selected ? "Remover" : "Adicionar"
                                    } ${subject} do meu curso`}
                                    className={`grid size-7 shrink-0 place-items-center rounded-lg border transition ${
                                        selected
                                            ? "border-orange-600 bg-orange-600 text-white"
                                            : "border-slate-300 bg-white text-transparent hover:border-orange-400"
                                    }`}
                                >
                                    <Icon name="check" size={16} />
                                </button>
                            </div>
                            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                <span className="text-xs font-semibold text-slate-500">
                                    {subjectConcluded} de {subjectExercises.length} concluídos
                                </span>
                                <Link
                                    to={`/materias/${toSlug(subject)}`}
                                    className="text-xs font-extrabold text-orange-600 hover:text-orange-700"
                                >
                                    Ver matéria
                                </Link>
                            </div>
                        </article>
                    );
                })}
            </div>
        </PageSection>
    );
}