// ──────────────────────────────────────────────
// Automated Insights Engine
// Strategy pattern — each generator produces insights for its category
// ──────────────────────────────────────────────

import type { Statistics, RichInsight, InsightCategory } from '../types';

/** Interface for insight generators */
interface InsightGenerator {
    category: InsightCategory;
    generate(stats: Statistics): RichInsight[];
}

/**
 * Generate all insights from statistics.
 */
export function generateInsights(stats: Statistics): RichInsight[] {
    const generators: InsightGenerator[] = [
        new PerformanceGenerator(),
        new PatternGenerator(),
        new RecommendationGenerator(),
    ];

    return generators
        .flatMap((gen) => gen.generate(stats))
        .sort((a, b) => b.priority - a.priority);
}

// ── Performance Generator ──

class PerformanceGenerator implements InsightGenerator {
    readonly category: InsightCategory = 'performance';

    generate(stats: Statistics): RichInsight[] {
        const insights: RichInsight[] = [];

        // Net result assessment
        if (stats.netResult > 0) {
            insights.push({
                id: 'perf-net-positive',
                category: this.category,
                type: 'success',
                icon: 'trending-up',
                title: 'Resultado Positivo',
                description: `O teu resultado líquido é positivo. Levantaste mais do que depositaste, com um retorno de ${stats.roi.toFixed(1)}%.`,
                priority: 10,
                trend: 'up',
            });
        } else if (stats.netResult < 0) {
            insights.push({
                id: 'perf-net-negative',
                category: this.category,
                type: 'danger',
                icon: 'trending-down',
                title: 'Resultado Negativo',
                description: `O teu resultado líquido é negativo. Depositaste mais do que levantaste, com uma perda de ${Math.abs(stats.roi).toFixed(1)}%.`,
                priority: 10,
                trend: 'down',
            });
        }

        // Win rate
        if (stats.winRate >= 60) {
            insights.push({
                id: 'perf-winrate-high',
                category: this.category,
                type: 'success',
                icon: 'trophy',
                title: 'Win Rate Elevado',
                description: `${stats.winRate.toFixed(0)}% dos teus meses são positivos. Consistência acima da média.`,
                priority: 8,
                trend: 'up',
            });
        } else if (stats.winRate < 40) {
            insights.push({
                id: 'perf-winrate-low',
                category: this.category,
                type: 'warning',
                icon: 'alert-triangle',
                title: 'Win Rate Baixo',
                description: `Apenas ${stats.winRate.toFixed(0)}% dos teus meses são positivos. Considera rever a tua estratégia.`,
                priority: 8,
                trend: 'down',
            });
        }

        // ROI gauge
        if (stats.roi > 20) {
            insights.push({
                id: 'perf-roi-excellent',
                category: this.category,
                type: 'success',
                icon: 'zap',
                title: 'ROI Excelente',
                description: `ROI de ${stats.roi.toFixed(1)}% — retorno muito acima do capital investido.`,
                priority: 7,
            });
        }

        return insights;
    }
}

// ── Pattern Generator ──

class PatternGenerator implements InsightGenerator {
    readonly category: InsightCategory = 'patterns';

    generate(stats: Statistics): RichInsight[] {
        const insights: RichInsight[] = [];

        // Trend
        if (stats.trend === 'positive') {
            insights.push({
                id: 'pat-trend-positive',
                category: this.category,
                type: 'success',
                icon: 'arrow-up-right',
                title: 'Tendência Positiva',
                description: 'Os últimos 3 meses mostram uma tendência maioritariamente positiva.',
                priority: 9,
                trend: 'up',
            });
        } else if (stats.trend === 'negative') {
            insights.push({
                id: 'pat-trend-negative',
                category: this.category,
                type: 'warning',
                icon: 'arrow-down-right',
                title: 'Tendência Negativa',
                description: 'Os últimos 3 meses mostram uma tendência maioritariamente negativa.',
                priority: 9,
                trend: 'down',
            });
        }

        // Peak and valley
        if (stats.peakMonth) {
            insights.push({
                id: 'pat-peak',
                category: this.category,
                type: 'info',
                icon: 'mountain',
                title: 'Melhor Mês',
                description: `O teu melhor mês foi ${stats.peakMonth.label} com um resultado líquido de ${stats.peakMonth.net >= 0 ? '+' : ''}${stats.peakMonth.net.toFixed(2)}€.`,
                priority: 6,
            });
        }

        if (stats.valleyMonth && stats.valleyMonth.net < 0) {
            insights.push({
                id: 'pat-valley',
                category: this.category,
                type: 'info',
                icon: 'mountain-snow',
                title: 'Pior Mês',
                description: `O teu pior mês foi ${stats.valleyMonth.label}. Analisa o que aconteceu para aprender.`,
                priority: 5,
            });
        }

        // Streaks
        if (stats.streaks.bestPositiveStreak.months >= 3) {
            insights.push({
                id: 'pat-streak-positive',
                category: this.category,
                type: 'success',
                icon: 'flame',
                title: 'Streak Positiva',
                description: `A tua melhor sequência foi de ${stats.streaks.bestPositiveStreak.months} meses consecutivos positivos.`,
                priority: 7,
            });
        }

        if (stats.streaks.currentStreak.type === 'positive' && stats.streaks.currentStreak.months >= 2) {
            insights.push({
                id: 'pat-streak-current',
                category: this.category,
                type: 'success',
                icon: 'zap',
                title: 'Em Sequência Positiva',
                description: `Estás numa sequência de ${stats.streaks.currentStreak.months} meses positivos consecutivos. Mantém o ritmo!`,
                priority: 8,
                trend: 'up',
            });
        }

        // Deposit frequency pattern
        if (stats.depositCount > stats.withdrawalCount * 3) {
            insights.push({
                id: 'pat-high-deposit-freq',
                category: this.category,
                type: 'warning',
                icon: 'repeat',
                title: 'Depósitos Frequentes',
                description: `Tens ${stats.depositCount} depósitos vs ${stats.withdrawalCount} levantamentos. Estás a depositar com muita frequência.`,
                priority: 6,
                trend: 'down',
            });
        }

        return insights;
    }
}

// ── Recommendation Generator ──

class RecommendationGenerator implements InsightGenerator {
    readonly category: InsightCategory = 'recommendations';

    generate(stats: Statistics): RichInsight[] {
        const insights: RichInsight[] = [];

        // Budget control
        if (stats.averageDeposit > stats.averageWithdrawal && stats.netResult < 0) {
            insights.push({
                id: 'rec-budget',
                category: this.category,
                type: 'warning',
                icon: 'wallet',
                title: 'Controla o Orçamento',
                description:
                    'O teu depósito médio é superior ao levantamento médio. Considera definir um limite fixo por mês.',
                priority: 8,
            });
        }

        // Set goals
        if (stats.monthlyData.length >= 3) {
            insights.push({
                id: 'rec-goals',
                category: this.category,
                type: 'info',
                icon: 'target',
                title: 'Define Objetivos',
                description:
                    'Com dados suficientes, podes definir metas mensais. Usa a funcionalidade de Goals para acompanhar o teu progresso.',
                priority: 5,
            });
        }

        // Diversification
        if (stats.monthlyData.length >= 6 && stats.winRate < 50) {
            insights.push({
                id: 'rec-diversify',
                category: this.category,
                type: 'info',
                icon: 'layers',
                title: 'Diversifica',
                description:
                    'Win rate abaixo de 50%. Pondera diversificar as tuas estratégias ou plataformas.',
                priority: 6,
            });
        }

        // Celebrate
        if (stats.roi > 10 && stats.winRate >= 50) {
            insights.push({
                id: 'rec-celebrate',
                category: this.category,
                type: 'success',
                icon: 'party-popper',
                title: 'Bom Trabalho!',
                description: 'Os teus números são sólidos. Mantém a disciplina e continua assim.',
                priority: 4,
                trend: 'up',
            });
        }

        return insights;
    }
}
