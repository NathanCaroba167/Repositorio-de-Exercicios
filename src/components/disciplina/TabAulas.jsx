import { RecursosTab } from './RecursosTab';

export function TabAulas({ disciplinaId }) {
    return (
        <RecursosTab
            disciplinaId={disciplinaId} tipo="aula"
            titulo="Adicionar aula" campos={['aula', 'formato', 'url']}
        />
    );
}