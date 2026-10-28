import { Link } from "react-router";
import { Icon } from "./Icon";
import { colorClasses } from "../data/exercises";
import { useStudy } from "./UseStudy";

export function ExerciseGrid({ exercises: items, onSelect }) {
    const { completed } = useStudy();

    if (!items.length) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400">
                    <Icon name="search" />
                </span>
                <h2 className="mt-4 font-bold text-slate-800">
                    Nenhum exercício encontrado
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Tente ajustar sua busca ou remover os filtros.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((exercise) => (
                <Link
                    key={exercise.id}
                    to={`/exercicios/${exercise.id}`}
                    className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_14px_35px_rgba(234,88,12,0.09)]"
                >
                    <div className="flex items-start justify-between gap-3">
                        <span className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] ${colorClasses[exercise.color]}`}>
                            {exercise.subject}
                        </span>
                        {completed.includes(exercise.id) && (
                            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                                <Icon name="check" size={13} />
                            </span>
                        )}
                    </div>

                    <h2 className="mt-4 text-base font-extrabold tracking-[-0.02em] text-slate-900">
                        {exercise.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {exercise.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 mt-5">
                        <div className="flex flex-col gap-1 text-xs text-slate-400">
                            <span>Prof. {exercise.professor}</span>
                            <span>{exercise.lesson} · {exercise.difficulty}</span>
                        </div>
                        <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-600">
                            <Icon name="arrow" size={18} />
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}