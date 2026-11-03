import { createContext, useContext, useState } from "react";
import { lerSessao, salvarSessao, limparSessao } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [sessao, setSessao] = useState(() => lerSessao());

    function entrar(dados) { // dados = { usuario, token }, direto da API
        salvarSessao(dados);
        setSessao(dados);
    }

    function sair() {
        limparSessao();
        setSessao(null);
    }

    return (
        <AuthContext.Provider
            value={{
                usuario: sessao?.usuario ?? null,
                token: sessao?.token ?? null,
                entrar,
                sair,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const contexto = useContext(AuthContext);
    if (!contexto) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }
    return contexto;
}