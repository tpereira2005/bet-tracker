'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import type { HistogramBucket } from '@bettracker/core';

interface HistogramChartProps {
    data: HistogramBucket[];
}

export default function HistogramChart({ data }: HistogramChartProps) {
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
                    dataKey="range"
                    tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border)' }}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={50}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8125rem',
                        color: 'var(--text-primary)',
                    }}
                    content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0]?.payload as HistogramBucket;
                        return (
                            <div style={{
                                backgroundColor: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '10px 14px',
                                fontSize: '0.8125rem',
                            }}>
                                <p style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>{label}</p>
                                <p style={{ color: 'var(--negative)' }}>Depósitos: {d.deposits}</p>
                                <p style={{ color: 'var(--positive)' }}>Levantamentos: {d.withdrawals}</p>
                                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Total: {d.total}</p>
                            </div>
                        );
                    }}
                />
                <Legend
                    wrapperStyle={{ fontSize: '0.75rem' }}
                    formatter={(value: string) => (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{value}</span>
                    )}
                />
                <Bar
                    dataKey="deposits"
                    name="Depósitos"
                    stackId="a"
                    fill="var(--negative)"
                    fillOpacity={0.75}
                    radius={[0, 0, 0, 0]}
                />
                <Bar
                    dataKey="withdrawals"
                    name="Levantamentos"
                    stackId="a"
                    fill="var(--positive)"
                    fillOpacity={0.75}
                    radius={[3, 3, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
