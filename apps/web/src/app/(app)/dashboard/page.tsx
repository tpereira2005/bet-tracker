import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    return (
        <div className="space-y-8 animate-[fade-in_0.3s_ease-out]">
            {/* Page Header */}
            <div>
                <h1 className="heading-1">Dashboard</h1>
                <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Visão geral do teu desempenho
                </p>
            </div>

            {/* Hero KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Resultado Líquido', 'Total Depositado', 'Total Levantado'].map((title) => (
                    <div
                        key={title}
                        className="card"
                    >
                        <p className="label mb-3">{title}</p>
                        <div className="h-8 w-32 rounded-lg skeleton-shimmer" />
                    </div>
                ))}
            </div>

            {/* Secondary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="card"
                        style={{ padding: 'var(--space-md)' }}
                    >
                        <div className="h-3 w-16 rounded skeleton-shimmer mb-2" />
                        <div className="h-6 w-20 rounded skeleton-shimmer" />
                    </div>
                ))}
            </div>

            {/* Chart Placeholder */}
            <div className="card">
                <div className="h-4 w-40 rounded skeleton-shimmer mb-6" />
                <div className="h-64 rounded-lg skeleton-shimmer" />
            </div>

            {/* Info Message */}
            <div
                className="card text-center"
                style={{
                    backgroundColor: 'var(--accent-subtle)',
                    borderColor: 'var(--accent)',
                }}
            >
                <p className="heading-4" style={{ color: 'var(--accent)' }}>
                    🚀 Faz upload do teu ficheiro CSV para começar a ver os teus dados
                </p>
                <p className="body-sm mt-1">
                    Vai a Definições → Upload para importar as tuas transações
                </p>
            </div>
        </div>
    );
}
