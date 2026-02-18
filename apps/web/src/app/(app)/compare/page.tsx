import { GitCompareArrows } from 'lucide-react';

export default function ComparePage() {
    return (
        <div className="space-y-6 page-enter">
            <div>
                <h1 className="heading-1">Comparar Perfis</h1>
                <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Compara o desempenho entre perfis</p>
            </div>

            <div className="empty-state">
                <div className="empty-state-icon">
                    <GitCompareArrows className="w-6 h-6" />
                </div>
                <p className="empty-state-title">Sem perfis para comparar</p>
                <p className="empty-state-description">
                    Cria pelo menos dois perfis de apostas para poderes comparar o desempenho entre eles.
                </p>
            </div>
        </div>
    );
}
