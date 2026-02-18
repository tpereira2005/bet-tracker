'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
    TrendingUp,
    Upload,
    BarChart3,
    PieChart as PieIcon,
    Activity,
    Lightbulb,
} from 'lucide-react';
import {
    processTransactions,
    calculateStatistics,
    calculateMonthlyData,
    calculateMoMChanges,
    calculateHistogram,
    generateInsights,
} from '@bettracker/core';
import type { Transaction, Statistics, MonthlyData, MoMChange, HistogramBucket, RichInsight } from '@bettracker/core';
import { getDefaultProfile, getTransactions } from '@/lib/queries';
import MonthlyChart from '@/components/charts/monthly-chart';
import DistributionChart from '@/components/charts/distribution-chart';
import HistogramChart from '@/components/charts/histogram-chart';
import MoMChart from '@/components/charts/mom-chart';
import InsightsPanel from '@/components/insights-panel';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        async function load() {
            const profile = await getDefaultProfile();
            // If profile is null, fetch ALL transactions (All Accounts mode)
            const dbTx = await getTransactions(profile ? profile.id : undefined);

            const processed = processTransactions(
                dbTx.map((t) => ({
                    date: t.transaction_date,
                    type: t.transaction_type,
                    amount: Number(t.amount),
                })),
                profile ? profile.id : 'all',
            );
            setTransactions(processed);
            setLoading(false);
        }
        load();
    }, []);

    const stats = useMemo<Statistics | null>(() => {
        if (transactions.length === 0) return null;
        return calculateStatistics(transactions);
    }, [transactions]);

    const monthlyData = useMemo<MonthlyData[]>(() => {
        if (transactions.length === 0) return [];
        return calculateMonthlyData(transactions);
    }, [transactions]);

    const momData = useMemo<MoMChange[]>(() => {
        if (monthlyData.length === 0) return [];
        return calculateMoMChanges(monthlyData);
    }, [monthlyData]);

    const histogramData = useMemo<HistogramBucket[]>(() => {
        if (transactions.length === 0) return [];
        return calculateHistogram(transactions, 20);
    }, [transactions]);

    const insights = useMemo<RichInsight[]>(() => {
        if (!stats) return [];
        return generateInsights(stats);
    }, [stats]);

    // ── Loading ──
    if (loading) {
        return (
            <div className="space-y-6 page-enter">
                <div>
                    <h1 className="heading-1">Análise</h1>
                    <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Gráficos detalhados e insights</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton-block" style={{ height: 340, borderRadius: 'var(--radius-lg)' }} />
                    ))}
                </div>
                <div className="skeleton-block" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} />
            </div>
        );
    }

    // ── Empty state ──
    if (transactions.length === 0 || !stats) {
        return (
            <div className="space-y-6 page-enter">
                <div>
                    <h1 className="heading-1">Análise</h1>
                    <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Gráficos detalhados e insights</p>
                </div>
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

    // ── Data state ──
    return (
        <div className="space-y-6 page-enter">
            <div>
                <h1 className="heading-1">Análise</h1>
                <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {transactions.length} transações · {monthlyData.length} meses
                </p>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Monthly Results */}
                <div className="card-static">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                        <div>
                            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Resultados Mensais</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Resultado líquido por mês</p>
                        </div>
                    </div>
                    <MonthlyChart data={monthlyData} />
                </div>

                {/* Distribution */}
                <div className="card-static">
                    <div className="flex items-center gap-2 mb-4">
                        <PieIcon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                        <div>
                            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Distribuição</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Depósitos vs Levantamentos</p>
                        </div>
                    </div>
                    <DistributionChart stats={stats} />
                </div>

                {/* Histogram */}
                <div className="card-static">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                        <div>
                            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Histograma de Valores</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Distribuição por intervalo de valor</p>
                        </div>
                    </div>
                    <HistogramChart data={histogramData} />
                </div>

                {/* MoM Changes */}
                <div className="card-static">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                        <div>
                            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Variação Mensal</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mudança % mês a mês (volume)</p>
                        </div>
                    </div>
                    <MoMChart data={momData} />
                </div>
            </div>

            {/* Insights Section */}
            {insights.length > 0 && (
                <div className="card-static">
                    <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-4 h-4" style={{ color: 'var(--warning)' }} />
                        <div>
                            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Insights</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Análise automática do teu desempenho</p>
                        </div>
                    </div>
                    <InsightsPanel insights={insights} />
                </div>
            )}
        </div>
    );
}
