import Link from 'next/link';
import { TrendingUp, Upload } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="space-y-6 page-enter">
            <div>
                <h1 className="heading-1">Análise</h1>
                <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Gráficos detalhados e insights</p>
            </div>

            {/* Empty State */}
            <div className="empty-state">
                <div className="empty-state-icon">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <p className="empty-state-title">Sem dados para analisar</p>
                <p className="empty-state-description">
                    Importa as tuas transações para ver gráficos detalhados, tendências e insights sobre o teu desempenho.
                </p>
                <div className="empty-state-action">
                    <Link href="/settings" className="btn btn-accent">
                        <Upload className="w-4 h-4" />
                        Importar Dados
                    </Link>
                </div>
            </div>
        </div>
    );
}
