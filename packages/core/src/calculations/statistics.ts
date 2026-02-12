// ──────────────────────────────────────────────
// Statistics & KPI Calculations
// Pure functions — no side effects
// ──────────────────────────────────────────────

import type {
    Transaction,
    TransactionType,
    MonthlyData,
    Statistics,
    MoMChange,
    HistogramBucket,
    StreakData,
} from '../types';
import { formatMonthLabel } from '../formatters';

/**
 * Process raw parsed data into Transaction objects with cumulative balance.
 */
export function processTransactions(
    rawRows: Array<{ date: string; type: TransactionType; amount: number }>,
    profileId: string,
): Transaction[] {
    // Sort by date
    const sorted = [...rawRows].sort((a, b) => a.date.localeCompare(b.date));

    let cumulative = 0;
    return sorted.map((row, index) => {
        const amount = row.amount;
        if (row.type === 'Withdrawal') {
            cumulative += amount;
        } else {
            cumulative -= amount;
        }

        return {
            id: `${profileId}-${index}`,
            profileId,
            date: new Date(row.date),
            rawDate: row.date,
            type: row.type,
            amount,
            cumulative: Math.round(cumulative * 100) / 100,
        };
    });
}

/**
 * Calculate comprehensive statistics from a list of transactions.
 */
export function calculateStatistics(transactions: Transaction[]): Statistics {
    if (transactions.length === 0) {
        return emptyStatistics();
    }

    const deposits = transactions.filter((t) => t.type === 'Deposit');
    const withdrawals = transactions.filter((t) => t.type === 'Withdrawal');

    const totalDeposits = sum(deposits.map((t) => t.amount));
    const totalWithdrawals = sum(withdrawals.map((t) => t.amount));
    const netResult = totalWithdrawals - totalDeposits;
    const roi = totalDeposits > 0 ? (netResult / totalDeposits) * 100 : 0;

    const monthlyData = calculateMonthlyData(transactions);
    const positiveMonths = monthlyData.filter((m) => m.net > 0).length;
    const winRate = monthlyData.length > 0 ? (positiveMonths / monthlyData.length) * 100 : 0;

    const peakMonth = monthlyData.reduce<MonthlyData | null>(
        (best, m) => (!best || m.net > best.net ? m : best),
        null,
    );
    const valleyMonth = monthlyData.reduce<MonthlyData | null>(
        (worst, m) => (!worst || m.net < worst.net ? m : worst),
        null,
    );

    // Trend: last 3 months
    const lastThree = monthlyData.slice(-3);
    const trend = calculateTrend(lastThree);

    const streaks = calculateStreaks(monthlyData);

    return {
        totalDeposits: round(totalDeposits),
        totalWithdrawals: round(totalWithdrawals),
        netResult: round(netResult),
        roi: round(roi),
        depositCount: deposits.length,
        withdrawalCount: withdrawals.length,
        averageDeposit: deposits.length > 0 ? round(totalDeposits / deposits.length) : 0,
        averageWithdrawal: withdrawals.length > 0 ? round(totalWithdrawals / withdrawals.length) : 0,
        winRate: round(winRate),
        monthlyData,
        peakMonth,
        valleyMonth,
        trend,
        streaks,
    };
}

/**
 * Aggregate transactions by month.
 */
export function calculateMonthlyData(transactions: Transaction[]): MonthlyData[] {
    const monthMap = new Map<string, MonthlyData>();

    for (const t of transactions) {
        const key = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}`;
        let month = monthMap.get(key);
        if (!month) {
            month = {
                month: key,
                label: formatMonthLabel(key),
                deposits: 0,
                withdrawals: 0,
                net: 0,
                transactionCount: 0,
            };
            monthMap.set(key, month);
        }

        if (t.type === 'Deposit') {
            month.deposits += t.amount;
        } else {
            month.withdrawals += t.amount;
        }
        month.net = round(month.withdrawals - month.deposits);
        month.transactionCount++;
    }

    // Sort by month key
    return Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Calculate month-over-month percentage changes.
 */
export function calculateMoMChanges(monthlyData: MonthlyData[]): MoMChange[] {
    const changes: MoMChange[] = [];

    for (let i = 1; i < monthlyData.length; i++) {
        const prev = monthlyData[i - 1]!;
        const curr = monthlyData[i]!;
        const prevNet = prev.deposits + prev.withdrawals;
        const currNet = curr.deposits + curr.withdrawals;

        const changePercent = prevNet !== 0 ? ((currNet - prevNet) / Math.abs(prevNet)) * 100 : 0;

        changes.push({
            month: curr.month,
            label: curr.label,
            changePercent: round(changePercent),
            previousValue: round(prevNet),
            currentValue: round(currNet),
        });
    }

    return changes;
}

/**
 * Group transactions into value histogram buckets.
 */
export function calculateHistogram(
    transactions: Transaction[],
    bucketSize: number = 20,
): HistogramBucket[] {
    if (transactions.length === 0) return [];

    const maxAmount = Math.max(...transactions.map((t) => t.amount));
    const bucketCount = Math.ceil(maxAmount / bucketSize);
    const buckets: HistogramBucket[] = [];

    for (let i = 0; i < bucketCount; i++) {
        const min = i * bucketSize;
        const max = (i + 1) * bucketSize;
        const inBucket = transactions.filter((t) => t.amount >= min && t.amount < max);

        buckets.push({
            range: `€${min}–€${max}`,
            min,
            max,
            total: inBucket.length,
            deposits: inBucket.filter((t) => t.type === 'Deposit').length,
            withdrawals: inBucket.filter((t) => t.type === 'Withdrawal').length,
        });
    }

    return buckets.filter((b) => b.total > 0);
}

/**
 * Calculate streaks from monthly data.
 */
export function calculateStreaks(monthlyData: MonthlyData[]): StreakData {
    if (monthlyData.length === 0) {
        return {
            currentStreak: { months: 0, type: 'none' },
            bestPositiveStreak: { months: 0, startMonth: '', endMonth: '' },
            worstNegativeStreak: { months: 0, startMonth: '', endMonth: '' },
        };
    }

    // Current streak
    let currentType: 'positive' | 'negative' | 'none' = 'none';
    let currentCount = 0;
    for (let i = monthlyData.length - 1; i >= 0; i--) {
        const net = monthlyData[i]!.net;
        const type = net > 0 ? 'positive' : net < 0 ? 'negative' : 'none';

        if (i === monthlyData.length - 1) {
            currentType = type;
            currentCount = type === 'none' ? 0 : 1;
        } else if (type === currentType && type !== 'none') {
            currentCount++;
        } else {
            break;
        }
    }

    // Best positive / worst negative streaks
    let bestPos = { months: 0, startMonth: '', endMonth: '' };
    let worstNeg = { months: 0, startMonth: '', endMonth: '' };
    let streak = 0;
    let streakStart = '';

    // Positive streaks
    for (let i = 0; i < monthlyData.length; i++) {
        if (monthlyData[i]!.net > 0) {
            if (streak === 0) streakStart = monthlyData[i]!.month;
            streak++;
            if (streak > bestPos.months) {
                bestPos = { months: streak, startMonth: streakStart, endMonth: monthlyData[i]!.month };
            }
        } else {
            streak = 0;
        }
    }

    // Negative streaks
    streak = 0;
    for (let i = 0; i < monthlyData.length; i++) {
        if (monthlyData[i]!.net < 0) {
            if (streak === 0) streakStart = monthlyData[i]!.month;
            streak++;
            if (streak > worstNeg.months) {
                worstNeg = { months: streak, startMonth: streakStart, endMonth: monthlyData[i]!.month };
            }
        } else {
            streak = 0;
        }
    }

    return {
        currentStreak: { months: currentCount, type: currentType },
        bestPositiveStreak: bestPos,
        worstNegativeStreak: worstNeg,
    };
}

/**
 * Determine trend from last N months.
 */
function calculateTrend(
    lastMonths: MonthlyData[],
): 'positive' | 'negative' | 'neutral' {
    if (lastMonths.length < 2) return 'neutral';

    const positiveCount = lastMonths.filter((m) => m.net > 0).length;
    const negativeCount = lastMonths.filter((m) => m.net < 0).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
}

// ── Helpers ──

function sum(values: number[]): number {
    return values.reduce((acc, v) => acc + v, 0);
}

function round(value: number): number {
    return Math.round(value * 100) / 100;
}

function emptyStatistics(): Statistics {
    return {
        totalDeposits: 0,
        totalWithdrawals: 0,
        netResult: 0,
        roi: 0,
        depositCount: 0,
        withdrawalCount: 0,
        averageDeposit: 0,
        averageWithdrawal: 0,
        winRate: 0,
        monthlyData: [],
        peakMonth: null,
        valleyMonth: null,
        trend: 'neutral',
        streaks: {
            currentStreak: { months: 0, type: 'none' },
            bestPositiveStreak: { months: 0, startMonth: '', endMonth: '' },
            worstNegativeStreak: { months: 0, startMonth: '', endMonth: '' },
        },
    };
}
