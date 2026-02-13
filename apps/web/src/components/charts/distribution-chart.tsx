'use client';

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import type { Statistics } from '@bettracker/core';

interface DistributionChartProps {
    stats: Statistics;
}

export default function DistributionChart({ stats }: DistributionChartProps) {
    if (stats.depositCount === 0 && stats.withdrawalCount === 0) return null;

    const data = [
        { name: 'Depósitos', value: stats.totalDeposits, count: stats.depositCount, color: 'var(--negative)' },
        { name: 'Levantamentos', value: stats.totalWithdrawals, count: stats.withdrawalCount, color: 'var(--positive)' },
    ];

    const total = stats.depositCount + stats.withdrawalCount;

    return (
        <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={index} fill={entry.color} fillOpacity={0.85} />
                        ))}
                    </Pie>
                    <Tooltip
                        content={({ active, payload }) => {
                            if (!active || !payload?.[0]) return null;
                            const d = payload[0].payload as (typeof data)[0];
                            return (
                                <div style={{
                                    backgroundColor: 'var(--bg-elevated)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '10px 14px',
                                    fontSize: '0.8125rem',
                                    color: 'var(--text-primary)',
                                }}>
                                    <p style={{ fontWeight: 600, color: d.color }}>{d.name}</p>
                                    <p>€{d.value.toFixed(2)}</p>
                                    <p style={{ color: 'var(--text-muted)' }}>{d.count} transações</p>
                                </div>
                            );
                        }}
                    />
                    {/* Center label */}
                    <text
                        x="50%"
                        y="47%"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontSize: '1.5rem', fontWeight: 700, fill: 'var(--text-primary)' }}
                    >
                        {total}
                    </text>
                    <text
                        x="50%"
                        y="60%"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontSize: '0.6875rem', fill: 'var(--text-muted)' }}
                    >
                        transações
                    </text>
                </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="space-y-4 flex-1">
                {data.map((d) => (
                    <div key={d.name}>
                        <div className="flex items-center gap-2 mb-1">
                            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: d.color, opacity: 0.85 }} />
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{d.name}</span>
                        </div>
                        <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                            €{d.value.toFixed(2)}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {d.count}× · média €{(d.value / (d.count || 1)).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
