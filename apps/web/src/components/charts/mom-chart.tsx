'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import type { MoMChange } from '@bettracker/core';

interface MoMChartProps {
    data: MoMChange[];
}

export default function MoMChart({ data }: MoMChartProps) {
    if (data.length === 0) return null;

    return (
        <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                    <linearGradient id="momGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                </defs>
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
                    tickFormatter={(val: number) => `${val}%`}
                />
                <ReferenceLine y={0} stroke="var(--text-muted)" strokeOpacity={0.3} strokeDasharray="6 3" />
                <Tooltip
                    content={({ active, payload, label }) => {
                        if (!active || !payload?.[0]) return null;
                        const d = payload[0].payload as MoMChange;
                        return (
                            <div style={{
                                backgroundColor: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '10px 14px',
                                fontSize: '0.8125rem',
                            }}>
                                <p style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>{label}</p>
                                <p style={{
                                    fontWeight: 600,
                                    color: d.changePercent >= 0 ? 'var(--positive)' : 'var(--negative)',
                                }}>
                                    {d.changePercent >= 0 ? '+' : ''}{d.changePercent.toFixed(1)}%
                                </p>
                                <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.75rem' }}>
                                    Mês anterior: €{d.previousValue.toFixed(2)}
                                </p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                    Mês atual: €{d.currentValue.toFixed(2)}
                                </p>
                            </div>
                        );
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="changePercent"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: 'var(--bg-primary)', stroke: 'var(--accent)', strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: 'var(--accent)', stroke: 'var(--bg-primary)', strokeWidth: 2 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
