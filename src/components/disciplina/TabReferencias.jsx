import { RecursosTab } from './RecursosTab';

export function TabReferencias({ disciplinaId }) {
    return (
        <RecursosTab
            disciplinaId={disciplinaId} tipo="referencia"
            titulo="Adicionar referência" campos={['url', 'descricao']}
        />
    );
}