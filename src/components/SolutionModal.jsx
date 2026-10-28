import { Icon } from "./Icon";
import { colorClasses } from "../data/exercises";

export function SolutionModal({
                                  selected,
                                  onClose,
                              }) {
    if (!selected) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
            onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="solution-title"
                className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            >
                <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur sm:px-8">
                    <div>
                        <span
                            className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] ${colorClasses[selected.color]}`}
                        >
                            {selected.subject}
                        </span>
                        <h2
                            id="solution-title"
                            className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-slate-950"
                        >
                            {selected.title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                        aria-label="Fechar solução"
                    >
                        <Icon name="close" size={19} />
                    </button>
                </div>
                <div className="px-6 py-6 sm:px-8 sm:py-8">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                        <span className="flex items-center gap-2">
                            <Icon name="user" size={15} /> Prof. {selected.professor}
                        </span>
                        <span className="flex items-center gap-2">
                            <Icon name="grid" size={15} /> {selected.code}
                        </span>
                        <span className="flex items-center gap-2">
                            <Icon name="bookmark" size={15} /> {selected.difficulty}
                        </span>
                    </div>
                    <div className="mt-7">
                        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                            Enunciado
                        </p>
                        <p className="mt-3 text-[15px] leading-7 text-slate-700">
                            {selected.description}
                        </p>
                    </div>
                    <div className="mt-7 rounded-2xl border border-orange-100 bg-orange-50 p-5 sm:p-6">
                        <div className="flex items-center gap-2 text-orange-700">
                            <span className="grid size-8 place-items-center rounded-lg bg-white shadow-sm">
                                <Icon name="spark" size={17} />
                            </span>
                            <p className="text-xs font-extrabold uppercase tracking-[0.12em]">
                                Solução comentada
                            </p>
                        </div>
                        <p className="mt-4 text-[15px] leading-7 text-slate-700">
                            {selected.solution}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-6 w-full rounded-xl bg-orange-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700"
                    >
                        Entendi a solução
                    </button>
                </div>
            </div>
        </div>
    )
}