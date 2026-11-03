import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthLayout } from "../components/AuthLayout";
import { useAuth } from "../components/AuthProvider";
import { cadastrar } from "../services/api";

const campo =
    "h-12 w-full rounded-xl border border-orange-200 bg-orange-50 px-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100";

export function RegisterPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [nome, setNome] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);
    const navigate = useNavigate();
    const { entrar } = useAuth();

    const handleNextStep = (e) => {
        e.preventDefault();
        setErro("");
        setStep(2);
    };

    async function handleRegister(e) {
        e.preventDefault();
        setErro("");
        setEnviando(true);
        try {
            const dados = await cadastrar(nome, email, senha);
            entrar(dados);
            navigate("/materias");
        } catch (err) {
            setErro(err.message);
            // erro de e-mail ou senha: volta para a etapa onde se corrige
            if (/e-mail|senha/i.test(err.message)) setStep(1);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <AuthLayout>
            <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-orange-600">
                Cadastro · Etapa {step} de 2
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-slate-950">
                {step === 1 ? "Crie sua conta" : "Como devemos chamar você?"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
                {step === 1
                    ? "Comece com seu e-mail e uma senha segura."
                    : "Esse nome aparece nas dúvidas que você enviar aos professores."}
            </p>

            <div className="mt-6 flex gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-orange-600"></div>
                <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step === 2 ? "bg-orange-600" : "bg-slate-100"}`}></div>
            </div>

            {erro && (
                <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {erro}
                </p>
            )}

            {step === 1 ? (
                <form onSubmit={handleNextStep} className="mt-8 space-y-5">
                    <div>
                        <label className="mb-1.5 block text-sm font-bold text-slate-700">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="voce@exemplo.com"
                            required
                            className={campo}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-bold text-slate-700">Senha</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Mínimo de 8 caracteres"
                            minLength={8}
                            required
                            className={campo}
                        />
                    </div>
                    <button type="submit" className="mt-2 w-full rounded-xl bg-orange-600 py-3.5 text-sm font-bold text-white transition hover:bg-orange-700">
                        Continuar &rarr;
                    </button>
                </form>
            ) : (
                <form onSubmit={handleRegister} className="mt-8 space-y-5">
                    <div>
                        <label className="mb-1.5 block text-sm font-bold text-slate-700">Nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Seu nome"
                            required
                            className={campo}
                        />
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-1/3 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                            Voltar
                        </button>
                        <button
                            type="submit"
                            disabled={enviando}
                            className="flex-1 rounded-xl bg-orange-600 py-3.5 text-sm font-bold text-white transition hover:bg-orange-700 disabled:opacity-60"
                        >
                            {enviando ? "Criando..." : "Criar minha conta"}
                        </button>
                    </div>
                </form>
            )}

            <p className="mt-8 text-center text-sm font-medium text-slate-500">
                Já possui uma conta? <Link to="/login" className="font-bold text-orange-600 hover:underline">Entrar</Link>
            </p>
        </AuthLayout>
    );
}