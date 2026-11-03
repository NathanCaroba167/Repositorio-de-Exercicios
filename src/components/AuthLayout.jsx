import { Link } from "react-router";
import { Icon } from "./Icon";

export function AuthLayout({ children }) {
    return (
        <div className="flex min-h-screen w-full bg-white">
            <div className="hidden w-full max-w-lg flex-col justify-between bg-orange-600 p-10 text-white lg:flex">
                <div>
                    <Link to="/" className="flex size-12 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-md">
                        <Icon name="book" size={26} />
                    </Link>
                    <p className="mt-10 text-xs font-extrabold uppercase tracking-[0.15em] text-orange-200">
                        Exercita
                    </p>
                    <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-[-0.04em]">
                        Estudar fica mais<br />
                        simples quando seu<br />
                        caminho está<br />
                        organizado.
                    </h1>
                </div>
                <div className="rounded-2xl bg-orange-500/40 p-6 backdrop-blur">
                    <h3 className="font-bold text-white">Uma conta, todo o seu progresso.</h3>
                    <p className="mt-2 text-sm leading-6 text-orange-100">
                        Continue de onde parou e mantenha sua rotina de exercícios em dia.
                    </p>
                </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-[400px]">
                    <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-orange-600">
                        <Icon name="arrow" size={16} className="rotate-180" />
                        Voltar para o Exercita
                    </Link>
                    {children}
                </div>
            </div>
        </div>
    );
}