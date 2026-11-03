import { Link, useNavigate } from "react-router";
import { AuthLayout } from "../components/AuthLayout";

export function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate("/materias");
    };

    return (
        <AuthLayout>
            <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-orange-600">Bem-vindo de volta</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-slate-950">Entre na sua conta</h2>
            <p className="mt-2 text-sm text-slate-500">Use seu e-mail e senha para continuar seus estudos.</p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
                <div>
                    <label className="mb-1.5 block text-sm font-bold text-slate-700">E-mail</label>
                    <input
                        type="email"
                        placeholder="voce@exemplo.com"
                        required
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-bold text-slate-700">Senha</label>
                    <input
                        type="password"
                        placeholder="Sua senha"
                        required
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />
                </div>
                <button type="submit" className="mt-2 w-full rounded-xl bg-orange-600 py-3.5 text-sm font-bold text-white transition hover:bg-orange-700">
                    Entrar
                </button>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-slate-500">
                Ainda não tem uma conta? <Link to="/cadastro" className="font-bold text-orange-600 hover:underline">Cadastre-se</Link>
            </p>
        </AuthLayout>
    );
}