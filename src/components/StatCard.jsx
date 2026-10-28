import { Icon } from "./Icon";

export function StatCard({
                             icon,
                             label,
                             value,
                         }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-orange-700">
                    <Icon name={icon} size={19} />
                </span>
                <div>
                    <p className="text-2xl font-extrabold tracking-[-0.03em] text-slate-950">
                        {value}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">{label}</p>
                </div>
            </div>
        </div>
    )
}