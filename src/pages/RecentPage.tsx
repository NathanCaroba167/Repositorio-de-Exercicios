import { Link } from "react-router";
import { exercises } from "../data/exercises";
import { PageSection } from "../components/PageSection";
import { Icon } from "../components/Icon";

export function RecentPage() {
    return (
        <PageSection
            eyebrow="Continue estudando"
            title="Vistos recentemente"
            description="Retome rapidamente os exercícios que você acessou por último."
        >
            <div className="grid gap-4">
                {exercises.slice(0, 8).map((exercise, index) => (
                    <Link
                        key={exercise.id}
                        to={`/exercicios/${exercise.id}`}
                        className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg hover:shadow-slate-200/60 sm:p-5"
                    >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-orange-50 font-extrabold text-orange-700">
              {String(index + 1).padStart(2, "0")}
            </span>
                        <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-extrabold text-slate-900 sm:text-base">
                {exercise.title}
              </span>
              <span className="mt-1 block text-xs text-slate-400">
                {exercise.subject} · {exercise.professor}
              </span>
            </span>
                        <span className="hidden text-xs font-semibold text-slate-400 sm:block">
              {exercise.time}
            </span>
                        <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-600">
              <Icon name="chevron" size={18} />
            </span>
                    </Link>
                ))}
            </div>
        </PageSection>
    )
}