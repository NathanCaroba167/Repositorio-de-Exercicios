import { Icon } from "./Icon";

export function EmptyState() {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400">
                <Icon name="search" />
            </span>
            <h2 className="mt-4 font-bold text-slate-800">
                Nenhum resultado encontrado
            </h2>
            <p className="mt-1 text-sm text-slate-500">
                Tente ajustar sua busca ou remover os filtros.
            </p>
        </div>
    )
}