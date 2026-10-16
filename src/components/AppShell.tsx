import { NavLink, Outlet } from "react-router";
import { Icon } from "./Icon";
import { StudyProvider } from "./StudyProvider";

export function AppShell() {
    return (
        <StudyProvider>
            <div className="min-h-screen bg-[#f7f8fb] text-[#17202f]">
                <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
                    <div className="mx-auto flex h-[74px] max-w-[1280px] items-center justify-between px-5 lg:px-8">
                        <NavLink className="flex items-center gap-3" to="/">
              <span className="grid size-10 place-items-center rounded-xl bg-orange-600 text-white shadow-sm shadow-orange-200">
                <Icon name="book" size={21} />
              </span>
                            <span className="text-[21px] font-extrabold tracking-[-0.04em]">
                Exercita
              </span>
                        </NavLink>
                        <nav className="flex h-full items-center gap-4 text-sm font-semibold text-slate-500 sm:gap-7">
                            {[
                                { to: "/", label: "Buscar", end: true },
                                { to: "/materias", label: "Matérias" },
                                { to: "/meu-curso", label: "Meu curso" },
                                { to: "/recentes", label: "Recentes" },
                            ].map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `relative flex h-full items-center transition-colors ${
                                            isActive ? "text-orange-600" : "hover:text-slate-900"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span className="hidden sm:inline">{item.label}</span>
                                            <span className="sm:hidden">
                        <Icon
                            name={
                                item.to === "/"
                                    ? "search"
                                    : item.to === "/materias"
                                        ? "book"
                                        : item.to === "/meu-curso"
                                            ? "trend"
                                            : "calendar"
                            }
                            size={19}
                        />
                      </span>
                                            {isActive && (
                                                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-orange-600" />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </nav>
                        <button
                            className="hidden size-10 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 sm:grid"
                            aria-label="Abrir perfil"
                        >
                            <Icon name="user" size={19} />
                        </button>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
                <footer className="border-t border-slate-200 bg-white px-5 py-6 text-center text-xs text-slate-400">
                    Exercita · Seu repositório de exercícios e soluções
                </footer>
            </div>
        </StudyProvider>
    )
}