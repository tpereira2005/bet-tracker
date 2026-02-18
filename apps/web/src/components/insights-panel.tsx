'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Info, Lightbulb, BarChart3, Search } from 'lucide-react';
import type { RichInsight, InsightCategory } from '@bettracker/core';

interface InsightsPanelProps {
    insights: RichInsight[];
}

const CATEGORY_CONFIG: Record<InsightCategory, { label: string; icon: React.ReactNode }> = {
    performance: { label: 'Performance', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    patterns: { label: 'Padrões', icon: <Search className="w-3.5 h-3.5" /> },
    recommendations: { label: 'Recomendações', icon: <Lightbulb className="w-3.5 h-3.5" /> },
};

const TYPE_STYLES: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
    success: { bg: 'var(--positive-subtle)', color: 'var(--positive)', icon: <TrendingUp className="w-4 h-4" /> },
    warning: { bg: 'var(--warning-subtle)', color: 'var(--warning)', icon: <AlertTriangle className="w-4 h-4" /> },
    danger: { bg: 'var(--negative-subtle)', color: 'var(--negative)', icon: <TrendingDown className="w-4 h-4" /> },
    info: { bg: 'var(--accent-subtle)', color: 'var(--accent)', icon: <Info className="w-4 h-4" /> },
};

export default function InsightsPanel({ insights }: InsightsPanelProps) {
    const [activeCategory, setActiveCategory] = useState<InsightCategory | 'all'>('all');

    if (insights.length === 0) return null;

    const categories: Array<InsightCategory | 'all'> = ['all', 'performance', 'patterns', 'recommendations'];
    const filtered = activeCategory === 'all' ? insights : insights.filter((i) => i.category === activeCategory);

    return (
        <div className="space-y-4">
            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => {
                    const count = cat === 'all' ? insights.length : insights.filter((i) => i.category === cat).length;
                    if (cat !== 'all' && count === 0) return null;
                    const isActive = activeCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className="flex items-center gap-1.5 transition-all"
                            style={{
                                padding: '6px 14px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.8125rem',
                                fontWeight: isActive ? 600 : 400,
                                background: isActive ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                            }}
                        >
                            {cat !== 'all' && CATEGORY_CONFIG[cat].icon}
                            {cat === 'all' ? 'Todos' : CATEGORY_CONFIG[cat].label}
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.6875rem',
                                opacity: 0.7,
                            }}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Insights grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filtered.map((insight) => {
                    const style = TYPE_STYLES[insight.type] ?? TYPE_STYLES.info!;
                    return (
                        <div
                            key={insight.id}
                            className="flex gap-3 transition-all"
                            style={{
                                padding: 'var(--space-md)',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                            }}
                        >
                            <div
                                className="flex-shrink-0 flex items-center justify-center"
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 'var(--radius-sm)',
                                    background: style.bg,
                                    color: style.color,
                                }}
                            >
                                {style.icon}
                            </div>
                            <div className="min-w-0">
                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                                    {insight.icon} {insight.title}
                                </p>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                                    {insight.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
