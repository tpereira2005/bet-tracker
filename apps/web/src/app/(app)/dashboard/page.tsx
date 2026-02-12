import Link from 'next/link';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/server';
import {
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Upload,
    BarChart3,
    Target,
    Percent,
    Hash,
    DollarSign,
    Activity,
} from 'lucide-react';

export default async function DashboardPage() {
    let userName = 'Utilizador';

    if (isSupabaseConfigured()) {
        try {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                userName = user.email.split('@')[0] ?? 'Utilizador';
            }
        } catch {
            // Supabase not available — continue with defaults
        }
    }

    return (
        <div className="space-y-8 page-enter">
            {/* Page Header */}
            <div>
                <h1 className="heading-1">
                    Olá, {userName}
                </h1>
                <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Visão geral do teu desempenho
                </p>
            </div>

            {/* ── Hero KPI Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <HeroKPI
                    label="Resultado Líquido"
                    value="€ 0,00"
                    trend={null}
                    icon={<DollarSign className="w-4 h-4" />}
                />
                <HeroKPI
                    label="Total Depositado"
                    value="€ 0,00"
                    trend={null}
                    icon={<ArrowDownRight className="w-4 h-4" />}
                    valueColor="var(--text-primary)"
                />
                <HeroKPI
                    label="Total Levantado"
                    value="€ 0,00"
                    trend={null}
                    icon={<ArrowUpRight className="w-4 h-4" />}
                    valueColor="var(--text-primary)"
                />
            </div>

            {/* ── Secondary KPIs ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <SecondaryKPI label="ROI" value="0%" icon={<Percent className="w-3.5 h-3.5" />} />
                <SecondaryKPI label="Win Rate" value="0%" icon={<Target className="w-3.5 h-3.5" />} />
                <SecondaryKPI label="Nº Transações" value="0" icon={<Hash className="w-3.5 h-3.5" />} />
                <SecondaryKPI label="Depósitos" value="0" icon={<TrendingDown className="w-3.5 h-3.5" />} />
                <SecondaryKPI label="Levantamentos" value="0" icon={<TrendingUp className="w-3.5 h-3.5" />} />
                <SecondaryKPI label="Streaks" value="—" icon={<Activity className="w-3.5 h-3.5" />} />
            </div>

            {/* ── Chart Area ── */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="heading-4">Balanço Cumulativo</h2>
                        <p className="body-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            Evolução do teu saldo ao longo do tempo
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn btn-sm btn-ghost" style={{ color: 'var(--accent)' }}>
                            30D
                        </button>
                        <button className="btn btn-sm btn-ghost">90D</button>
                        <button className="btn btn-sm btn-ghost">1A</button>
                        <button className="btn btn-sm btn-ghost">Tudo</button>
                    </div>
                </div>

                {/* Chart placeholder */}
                <div
                    className="flex items-center justify-center"
                    style={{
                        height: '280px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px dashed var(--border-strong)',
                        color: 'var(--text-muted)',
                    }}
                >
                    <div className="text-center">
                        <BarChart3 className="w-8 h-8 mx-auto mb-3" style={{ opacity: 0.4 }} />
                        <p className="body-sm">Faz upload de dados para ver o gráfico</p>
                    </div>
                </div>
            </div>

            {/* ── Upload CTA ── */}
            <div className="cta-card text-center" style={{ padding: 'var(--space-2xl) var(--space-lg)' }}>
                <div style={{ position: 'relative' }}>
                    <div
                        className="flex items-center justify-center mx-auto mb-4"
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--accent-subtle)',
                            color: 'var(--accent)',
                        }}
                    >
                        <Upload className="w-5 h-5" />
                    </div>
                    <h3 className="heading-3 mb-2">Importa as tuas transações</h3>
                    <p className="body-sm mb-6" style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 24px' }}>
                        Faz upload do teu ficheiro CSV e vê os dados instantaneamente no dashboard.
                    </p>
                    <Link href="/settings" className="btn btn-accent">
                        Upload CSV
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ── Sub-components ── */

function HeroKPI({
    label,
    value,
    trend,
    icon,
    valueColor,
}: {
    label: string;
    value: string;
    trend: number | null;
    icon: React.ReactNode;
    valueColor?: string;
}) {
    const trendColor = trend === null ? 'var(--text-muted)' : trend >= 0 ? 'var(--positive)' : 'var(--negative)';

    return (
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
            <div className="flex items-center justify-between mb-4">
                <p className="label">{label}</p>
                <div
                    className="flex items-center justify-center"
                    style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-elevated)',
                        color: 'var(--text-muted)',
                    }}
                >
                    {icon}
                </div>
            </div>
            <p
                className="number-lg"
                style={{
                    fontFamily: 'var(--font-heading), Instrument Serif, serif',
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: 400,
                    color: valueColor || trendColor,
                }}
            >
                {value}
            </p>
            {trend !== null && (
                <p className="body-sm mt-2 flex items-center gap-1" style={{ color: trendColor }}>
                    {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {trend >= 0 ? '+' : ''}{trend}% vs mês anterior
                </p>
            )}
        </div>
    );
}

function SecondaryKPI({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="card" style={{ padding: 'var(--space-md)' }}>
            <div className="flex items-center gap-1.5 mb-2">
                <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
                <p className="label" style={{ fontSize: '0.625rem' }}>{label}</p>
            </div>
            <p
                style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--text-primary)',
                }}
            >
                {value}
            </p>
        </div>
    );
}
