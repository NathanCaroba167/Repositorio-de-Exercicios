import { useNavigate } from "react-router";
import { PageSection } from "../components/PageSection";

export function NotFoundPage() {
    const navigate = useNavigate()
    return (
        <PageSection
            eyebrow="Erro 404"
            title="Página não encontrada"
            description="O endereço que você tentou acessar não existe."
        >
            <button
                onClick={() => navigate("/")}
                className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white"
            >
                Voltar para a busca
            </button>
        </PageSection>
    )
}