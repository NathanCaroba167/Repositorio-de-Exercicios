import { Icon } from "@/components/Icon"
import { Exercise, colorClasses } from "@/data/exercises"

export function ExerciseGrid({
                                 exercises: items,
                                 onSelect,
                             }: {
    exercises: Exercise[]
    onSelect: (exercise: Exercise) => void
}) {
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
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((exercise) => (
                <article
                    key={exercise.id}
                    className="group flex min-h-[280px] flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_2px_4px_rgba(18,32,64,0.02)] transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_14px_35px_rgba(234,88,12,0.09)]"
                >
                    <div className="flex items-center justify-between gap-3">
            <span
                className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] ${colorClasses[exercise.color]}`}
            >
              {exercise.subject}
            </span>
                        <span className="text-xs font-semibold text-slate-400">
              {exercise.code}
            </span>
                    </div>
                    <h2 className="mt-5 text-[18px] font-extrabold tracking-[-0.02em] text-slate-900">
                        {exercise.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {exercise.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
                        <div>
                            <p className="text-xs font-bold text-slate-700">
                                {exercise.professor}
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                                <Icon name="clock" size={13} /> {exercise.time}
                            </p>
                        </div>
                        <button
                            onClick={() => onSelect(exercise)}
                            className="flex size-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition group-hover:bg-orange-600 group-hover:text-white"
                            aria-label={`Ver solução de ${exercise.title}`}
                        >
                            <Icon name="arrow" size={18} />
                        </button>
                    </div>
                </article>
            ))}
        </div>
    )
}
