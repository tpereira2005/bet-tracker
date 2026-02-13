'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine,
} from 'recharts';
import type { MonthlyData } from '@bettracker/core';

interface MonthlyChartProps {
    data: MonthlyData[];
}

export default function MonthlyChart({ data }: MonthlyChartProps) {
    if (data.length === 0) return null;

    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                />
                <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border)' }}
                    interval="preserveStartEnd"
                />
                <YAxis
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val: number) => `€${val}`}
                />
                <ReferenceLine y={0} stroke="var(--text-muted)" strokeOpacity={0.3} strokeDasharray="6 3" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8125rem',
                        color: 'var(--text-primary)',
                    }}
                    content={({ active, payload, label }) => {
                        if (!active || !payload?.[0]) return null;
                        const d = payload[0].payload as MonthlyData;
                        return (
                            <div style={{
                                backgroundColor: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '10px 14px',
                                fontSize: '0.8125rem',
                            }}>
                                <p style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>{label}</p>
                                <p style={{ color: 'var(--negative)' }}>Depósitos: €{d.deposits.toFixed(2)}</p>
                                <p style={{ color: 'var(--positive)' }}>Levantamentos: €{d.withdrawals.toFixed(2)}</p>
                                <p style={{
                                    fontWeight: 600,
                                    marginTop: '4px',
                                    paddingTop: '4px',
                                    borderTop: '1px solid var(--border)',
                                    color: d.net >= 0 ? 'var(--positive)' : 'var(--negative)',
                                }}>
                                    Resultado: €{d.net.toFixed(2)}
                                </p>
                            </div>
                        );
                    }}
                />
                <Bar dataKey="net" radius={[3, 3, 0, 0]} maxBarSize={40}>
                    {data.map((entry, index) => (
                        <Cell
                            key={index}
                            fill={entry.net >= 0 ? 'var(--positive)' : 'var(--negative)'}
                            fillOpacity={0.85}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
