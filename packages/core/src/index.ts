// ──────────────────────────────────────────────
// @bettracker/core — Barrel Export
// ──────────────────────────────────────────────

// Types
export * from './types';

// Validators
export * from './validators';

// Formatters
export * from './formatters';

// Parsers
export { parseCSV, registerParser, getAvailableParsers } from './parsers';
export type { CSVParser } from './parsers';

// Calculations
export {
    processTransactions,
    calculateStatistics,
    calculateMonthlyData,
    calculateMoMChanges,
    calculateHistogram,
    calculateStreaks,
} from './calculations';

export { generateInsights } from './calculations';
