// ──────────────────────────────────────────────
// BetTracker Core Types
// Shared across web and mobile
// ──────────────────────────────────────────────

/** Raw CSV row before processing */
export interface RawTransaction {
    date: string;
    type: string;
    value: string;
}

/** Transaction type — normalized */
export type TransactionType = 'Deposit' | 'Withdrawal';

/** Processed transaction with computed fields */
export interface Transaction {
    id: string;
    profileId: string;
    platformId?: string;
    date: Date;
    rawDate: string;
    type: TransactionType;
    amount: number;
    cumulative: number;
    importBatchId?: string;
}

/** Monthly aggregation */
export interface MonthlyData {
    month: string; // "YYYY-MM"
    label: string; // "Jan 2024"
    deposits: number;
    withdrawals: number;
    net: number;
    transactionCount: number;
}

/** Month-over-month change */
export interface MoMChange {
    month: string;
    label: string;
    changePercent: number;
    previousValue: number;
    currentValue: number;
}

/** Value histogram bucket */
export interface HistogramBucket {
    range: string;
    min: number;
    max: number;
    total: number;
    deposits: number;
    withdrawals: number;
}

/** Streak data */
export interface StreakData {
    currentStreak: { months: number; type: 'positive' | 'negative' | 'none' };
    bestPositiveStreak: { months: number; startMonth: string; endMonth: string };
    worstNegativeStreak: { months: number; startMonth: string; endMonth: string };
}

/** Comprehensive statistics */
export interface Statistics {
    totalDeposits: number;
    totalWithdrawals: number;
    netResult: number;
    roi: number;
    depositCount: number;
    withdrawalCount: number;
    averageDeposit: number;
    averageWithdrawal: number;
    winRate: number;
    monthlyData: MonthlyData[];
    peakMonth: MonthlyData | null;
    valleyMonth: MonthlyData | null;
    trend: 'positive' | 'negative' | 'neutral';
    streaks: StreakData;
}

/** Insight severity */
export type InsightType = 'success' | 'warning' | 'danger' | 'info';

/** Insight category */
export type InsightCategory = 'performance' | 'patterns' | 'recommendations';

/** Rich insight for the insights panel */
export interface RichInsight {
    id: string;
    category: InsightCategory;
    type: InsightType;
    icon: string;
    title: string;
    description: string;
    priority: number;
    trend?: 'up' | 'down' | 'neutral';
}

/** User profile */
export interface Profile {
    id: string;
    userId: string;
    name: string;
    isDefault: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

/** Betting platform */
export interface Platform {
    id: string;
    name: string;
    slug: string;
    iconUrl?: string;
    parserConfig?: Record<string, unknown>;
}

/** Goal */
export interface Goal {
    id: string;
    profileId: string;
    title: string;
    goalType: 'net_result' | 'roi' | 'deposit_limit' | 'streak';
    targetValue: number;
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
    createdAt: Date;
}

/** Shared report */
export interface SharedReport {
    id: string;
    userId: string;
    profileId: string;
    slug: string;
    title: string;
    reportConfig: {
        showKPIs: boolean;
        showCharts: boolean;
        showInsights: boolean;
        dateFrom?: string;
        dateTo?: string;
    };
    isActive: boolean;
    expiresAt?: Date;
    createdAt: Date;
}

/** CSV parse result */
export interface ParseResult {
    success: boolean;
    transactions: RawTransaction[];
    errors: ParseError[];
    warnings: string[];
    detectedFormat: string;
}

/** Parse error */
export interface ParseError {
    row: number;
    field: string;
    message: string;
    rawValue: string;
}

/** Upload conflict */
export interface UploadConflict {
    date: string;
    type: TransactionType;
    existingAmount: number;
    newAmount: number;
}

/** Upload result */
export interface UploadResult {
    added: number;
    duplicates: number;
    conflicts: UploadConflict[];
}

/** Paginated result */
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

/** Sort configuration */
export interface SortConfig {
    field: string;
    direction: 'asc' | 'desc';
}

/** Transaction filter */
export interface TransactionFilter {
    type?: TransactionType;
    dateFrom?: Date;
    dateTo?: Date;
    platformId?: string;
}

/** Theme */
export type Theme = 'dark' | 'light';

/** Locale */
export type Locale = 'pt' | 'en';

/** User preferences */
export interface UserPreferences {
    theme: Theme;
    locale: Locale;
    itemsPerPage: number;
}
