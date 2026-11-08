import { RecursosTab } from './RecursosTab';

export function TabMateriais({ disciplinaId }) {
    return (
        <RecursosTab
            disciplinaId={disciplinaId} tipo="material"
            titulo="Adicionar material (PDF)" campos={['aula', 'arquivo']}
        />
    );
}