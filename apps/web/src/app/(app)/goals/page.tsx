import { Target } from 'lucide-react';

export default function GoalsPage() {
    return (
        <div className="space-y-6 page-enter">
            <div>
                <h1 className="heading-1">Objetivos</h1>
                <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Define e acompanha os teus objetivos</p>
            </div>

            <div className="empty-state">
                <div className="empty-state-icon">
                    <Target className="w-6 h-6" />
                </div>
                <p className="empty-state-title">Sem objetivos definidos</p>
                <p className="empty-state-description">
                    Define os teus objetivos financeiros e acompanha o progresso ao longo do tempo.
                </p>
                <div className="empty-state-action">
                    <button className="btn btn-outlined">
                        Criar Objetivo
                    </button>
                </div>
            </div>
        </div>
    );
}
