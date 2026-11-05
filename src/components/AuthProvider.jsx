import { createContext, useContext, useState } from "react";
import { lerSessao, salvarSessao, limparSessao } from "../services/api"; // Usa as funções da sua API

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // Inicia a sessão lendo do localStorage/API através da função lerSessao()
    const [sessao, setSessao] = useState(() => lerSessao());

    function entrar(dadosDaApi) {
        // Garantindo que todo usuário tem a propriedade 'tipo' para a nova tela.
        // NOTA: Se no futuro a sua API já enviar "tipo: 'professor'", remova esse "|| 'professor'"
        const dadosDoUsuarioComTipo = {
            ...dadosDaApi, // Mantém o token e os dados originais da API
            usuario: {
                ...dadosDaApi.usuario,
                tipo: dadosDaApi.usuario?.tipo || "professor", // Define 'professor' para testes da nova aba
            }
        };

        salvarSessao(dadosDoUsuarioComTipo);
        setSessao(dadosDoUsuarioComTipo);
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