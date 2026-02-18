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
export { sanitizeValue, normalizeType, parseDate, detectDelimiter, normalizeHeader } from './parsers/types';
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
