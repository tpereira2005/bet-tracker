'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import type { Transaction } from '@bettracker/core';

interface CumulativeChartProps {
    transactions: Transaction[];
}

export default function CumulativeChart({ transactions }: CumulativeChartProps) {
    if (transactions.length === 0) return null;

    const data = transactions.map((t) => ({
        date: t.rawDate,
        cumulative: t.cumulative,
    }));

    const minValue = Math.min(...data.map((d) => d.cumulative));
    const maxValue = Math.max(...data.map((d) => d.cumulative));

    return (
        <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border)' }}
                    interval="preserveStartEnd"
                    tickFormatter={(val: string) => {
                        const parts = val.split('-');
                        if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
                        return val;
                    }}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val: number) => `€${val}`}
                    domain={[Math.floor(minValue * 1.1), Math.ceil(maxValue * 1.1)]}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8125rem',
                        color: 'var(--text-primary)',
                    }}
                    formatter={(value: number) => [`€${value.toFixed(2)}`, 'Saldo']}
                    labelFormatter={(label: string) => {
                        const parts = label.split('-');
                        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                        return label;
                    }}
                />
                {/* Zero line */}
                {minValue < 0 && maxValue > 0 && (
                    <CartesianGrid
                        y={0}
                        strokeDasharray="6 3"
                        stroke="var(--text-muted)"
                        strokeOpacity={0.3}
                    />
                )}
                <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    fill="url(#balanceGradient)"
                    dot={false}
                    activeDot={{
                        r: 4,
                        stroke: 'var(--accent)',
                        fill: 'var(--bg-primary)',
                        strokeWidth: 2,
                    }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
