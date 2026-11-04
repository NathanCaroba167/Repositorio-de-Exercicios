import { useStudy } from "./UseStudy";
import { Icon } from "./Icon";

export function DoubtModal() {
    const { doubtContext, closeDoubtModal } = useStudy();

    if (!doubtContext.isOpen) return null;

    return (
        <div className="fixed bottom-0 right-16 z-[100] w-[450px] overflow-hidden rounded-t-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-slate-200">
            <div className="flex h-12 items-center justify-between bg-slate-50 px-4 border-b border-slate-200">
                <span className="text-[13px] font-bold text-slate-700">Nova dúvida</span>
                <div className="flex items-center gap-3">
                    <button className="text-slate-400 hover:text-slate-700 transition">
                        <Icon name="minus" size={16} />
                    </button>
                    <button className="text-slate-400 hover:text-slate-700 transition">
                        <Icon name="maximize" size={14} />
                    </button>
                    <button onClick={closeDoubtModal} className="text-slate-400 hover:text-slate-700 transition">
                        <Icon name="close" size={16} />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div className="flex items-center border-b border-slate-100 pb-2">
                    <span className="w-16 text-sm text-slate-500">Para:</span>
                    <span className="rounded bg-orange-100 px-2 py-0.5 text-[13px] font-semibold text-orange-800">
                        {doubtContext.subject}
                    </span>
                </div>

                {doubtContext.exercise && (
                    <div className="flex items-center border-b border-slate-100 pb-2">
                        <span className="w-16 text-sm text-slate-500">Ex:</span>
                        <span className="text-[13px] font-medium text-slate-700">
                            {doubtContext.exercise}
                        </span>
                    </div>
                )}

                <textarea
                    className="w-full resize-none bg-transparent pt-2 text-[15px] text-slate-800 outline-none placeholder:text-slate-400 min-h-[180px]"
                    placeholder="Descreva sua dúvida com o máximo de detalhes possível..."
                    autoFocus
                />
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-white p-4">
                <button className="rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white transition hover:bg-blue-700">
                    Enviar
                </button>
                <div className="flex gap-4 text-slate-400">
                    <button className="hover:text-slate-700" title="Anexar arquivo">
                        <Icon name="paperclip" size={18} />
                    </button>
                    <button className="hover:text-slate-700" title="Inserir imagem">
                        <Icon name="image" size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}