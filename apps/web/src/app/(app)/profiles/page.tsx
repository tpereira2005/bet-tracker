import { Users, Plus } from 'lucide-react';

export default function ProfilesPage() {
    return (
        <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="heading-1">Perfis</h1>
                    <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Gere as tuas contas de apostas</p>
                </div>
                <button className="btn btn-accent">
                    <Plus className="w-4 h-4" />
                    Novo Perfil
                </button>
            </div>

            <div className="empty-state">
                <div className="empty-state-icon">
                    <Users className="w-6 h-6" />
                </div>
                <p className="empty-state-title">Sem perfis criados</p>
                <p className="empty-state-description">
                    Cria perfis para organizar as tuas apostas por casa ou estratégia.
                </p>
            </div>
        </div>
    );
}
