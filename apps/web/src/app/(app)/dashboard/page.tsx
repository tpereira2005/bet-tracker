'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
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
import {
    processTransactions,
    calculateStatistics,
    formatCurrency,
} from '@bettracker/core';
import type { Transaction, Statistics } from '@bettracker/core';
import { useAuth } from '@/components/providers/auth-provider';
import { getDefaultProfile, getTransactions } from '@/lib/queries';
import CumulativeChart from '@/components/charts/cumulative-chart';

export default function DashboardPage() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const userName = user?.email?.split('@')[0] ?? 'Utilizador';

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const profile = await getDefaultProfile();
                // If profile is null, it means "All Accounts". Fetch all transactions.
                const dbRows = await getTransactions(profile ? profile.id : undefined);

                if (dbRows.length === 0) {
                    setTransactions([]);
                    return;
                }
                const processed = processTransactions(
                    dbRows.map((r) => ({
                        date: r.transaction_date,
                        type: r.transaction_type,
                        amount: Number(r.amount),
                    })),
                    profile ? profile.id : 'all',
                );
                setTransactions(processed);
            } catch (err) {
                console.error('Error loading dashboard data:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const stats: Statistics | null = useMemo(
        () => (transactions.length > 0 ? calculateStatistics(transactions) : null),
        [transactions],
    );

    const hasData = !loading && transactions.length > 0 && stats;

    return (
        <div className="space-y-8 page-enter">
            {/* Page Header */}
            <div>
                <h1 className="heading-1">Olá, {userName}</h1>
                <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Visão geral do teu desempenho
                </p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="card skeleton-shimmer" style={{ height: '128px' }} />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="card skeleton-shimmer" style={{ height: '80px' }} />
                        ))}
                    </div>
                </div>
            )}

            {/* Data State */}
            {hasData && (
                <>
                    {/* ── Hero KPI Cards ── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <HeroKPI
                            label="Resultado Líquido"
                            value={formatCurrency(stats.netResult)}
                            trend={null}
                            icon={<DollarSign className="w-4 h-4" />}
                            valueColor={stats.netResult >= 0 ? 'var(--positive)' : 'var(--negative)'}
                        />
                        <HeroKPI
                            label="Total Depositado"
                            value={formatCurrency(stats.totalDeposits)}
                            trend={null}
                            icon={<ArrowDownRight className="w-4 h-4" />}
                            valueColor="var(--text-primary)"
                        />
                        <HeroKPI
                            label="Total Levantado"
                            value={formatCurrency(stats.totalWithdrawals)}
                            trend={null}
                            icon={<ArrowUpRight className="w-4 h-4" />}
                            valueColor="var(--text-primary)"
                        />
                    </div>

                    {/* ── Secondary KPIs ── */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <SecondaryKPI
                            label="ROI"
                            value={`${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}%`}
                            icon={<Percent className="w-3.5 h-3.5" />}
                            color={stats.roi >= 0 ? 'var(--positive)' : 'var(--negative)'}
                        />
                        <SecondaryKPI
                            label="Win Rate"
                            value={`${stats.winRate.toFixed(0)}%`}
                            icon={<Target className="w-3.5 h-3.5" />}
                            color={stats.winRate >= 50 ? 'var(--positive)' : 'var(--warning)'}
                        />
                        <SecondaryKPI
                            label="Nº Transações"
                            value={String(stats.depositCount + stats.withdrawalCount)}
                            icon={<Hash className="w-3.5 h-3.5" />}
                        />
                        <SecondaryKPI
                            label="Depósitos"
                            value={String(stats.depositCount)}
                            icon={<TrendingDown className="w-3.5 h-3.5" />}
                        />
                        <SecondaryKPI
                            label="Levantamentos"
                            value={String(stats.withdrawalCount)}
                            icon={<TrendingUp className="w-3.5 h-3.5" />}
                        />
                        <SecondaryKPI
                            label="Streak"
                            value={
                                stats.streaks.currentStreak.months > 0
                                    ? `${stats.streaks.currentStreak.months}m ${stats.streaks.currentStreak.type === 'positive' ? '🟢' : '🔴'}`
                                    : '—'
                            }
                            icon={<Activity className="w-3.5 h-3.5" />}
                        />
                    </div>

                    {/* ── Cumulative Balance Chart ── */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="heading-4">Balanço Cumulativo</h2>
                                <p className="body-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                    Evolução do teu saldo ao longo do tempo
                                </p>
                            </div>
                        </div>
                        <CumulativeChart transactions={transactions} />
                    </div>
                </>
            )}

            {/* Empty State */}
            {!loading && !hasData && (
                <>
                    {/* Empty KPI cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <HeroKPI label="Resultado Líquido" value="€ 0,00" trend={null} icon={<DollarSign className="w-4 h-4" />} />
                        <HeroKPI label="Total Depositado" value="€ 0,00" trend={null} icon={<ArrowDownRight className="w-4 h-4" />} valueColor="var(--text-primary)" />
                        <HeroKPI label="Total Levantado" value="€ 0,00" trend={null} icon={<ArrowUpRight className="w-4 h-4" />} valueColor="var(--text-primary)" />
                    </div>

                    {/* Empty chart */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="heading-4">Balanço Cumulativo</h2>
                                <p className="body-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                    Evolução do teu saldo ao longo do tempo
                                </p>
                            </div>
                        </div>
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

                    {/* Upload CTA */}
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
                </>
            )}
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
    color,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
    color?: string;
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
                    color: color || 'var(--text-primary)',
                }}
            >
                {value}
            </p>
        </div>
    );
}
