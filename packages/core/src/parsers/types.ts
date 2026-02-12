// ──────────────────────────────────────────────
// CSV Parser Types
// ──────────────────────────────────────────────

import type { ParseResult } from '../types';

/** Interface for platform-specific CSV parsers */
export interface CSVParser {
    /** Parser name (e.g., "Betano", "Betclic") */
    readonly name: string;

    /**
     * Detect if this parser can handle the given CSV data.
     * @param headers - First row headers
     * @param sampleRows - First few data rows
     * @returns true if this parser recognizes the format
     */
    detect(headers: string[], sampleRows: string[][]): boolean;

    /**
     * Parse raw CSV text into structured transactions.
     * @param rawCSV - Raw CSV file content
     * @returns ParseResult with transactions or errors
     */
    parse(rawCSV: string): ParseResult;
}

/** Common header name mappings (typo-tolerant) */
export const HEADER_ALIASES: Record<string, string[]> = {
    date: ['date', 'data', 'dt', 'transaction_date', 'transactiondate'],
    type: ['type', 'tipe', 'tipo', 'transaction_type', 'transactiontype', 'kind'],
    value: [
        'value',
        'vaule',
        'valor',
        'amount',
        'montante',
        'transaction_value',
        'transactionvalue',
    ],
};

/**
 * Normalize a header name to its canonical form.
 * Case-insensitive, tolerant to typos.
 */
export function normalizeHeader(header: string): string | null {
    const trimmed = header.trim().toLowerCase().replace(/[^a-z_]/g, '');
    for (const [canonical, aliases] of Object.entries(HEADER_ALIASES)) {
        if (aliases.includes(trimmed)) {
            return canonical;
        }
    }
    return null;
}

/**
 * Sanitize a value string to a valid number.
 * Handles: euro sign, spaces, comma decimals, thousand separators.
 * @example sanitizeValue("1.234,56 €") → 1234.56
 * @example sanitizeValue("20,00") → 20
 * @example sanitizeValue("20") → 20
 */
export function sanitizeValue(raw: string): number {
    let cleaned = raw.replace(/€/g, '').replace(/\s/g, '').trim();

    // Detect European format: x.xxx,xx or x,xx
    if (cleaned.includes(',')) {
        // If both . and , exist → dots are thousands, comma is decimal
        if (cleaned.includes('.')) {
            cleaned = cleaned.replace(/\./g, '').replace(',', '.');
        } else {
            // Only comma → it's a decimal separator
            cleaned = cleaned.replace(',', '.');
        }
    }

    const value = parseFloat(cleaned);
    if (isNaN(value)) {
        throw new Error(`Cannot parse value: "${raw}"`);
    }
    return Math.round(value * 100) / 100; // Avoid floating point issues
}

/**
 * Normalize a transaction type string.
 * Case-insensitive, handles common variations.
 */
export function normalizeType(raw: string): 'Deposit' | 'Withdrawal' | null {
    const lower = raw.trim().toLowerCase();
    if (['deposit', 'depósito', 'deposito', 'dep'].includes(lower)) return 'Deposit';
    if (['withdrawal', 'with drawal', 'levantamento', 'withdraw', 'wit'].includes(lower))
        return 'Withdrawal';
    return null;
}

/**
 * Parse a date string in multiple formats.
 * Supported: YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
 */
export function parseDate(raw: string): Date | null {
    const trimmed = raw.trim();

    // YYYY-MM-DD
    const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (isoMatch) {
        const year = parseInt(isoMatch[1]!, 10);
        const month = parseInt(isoMatch[2]!, 10);
        const day = parseInt(isoMatch[3]!, 10);
        const date = new Date(year, month - 1, day);
        if (isValidDate(date, year, month, day)) return date;
    }

    // DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
    const euMatch = trimmed.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
    if (euMatch) {
        const day = parseInt(euMatch[1]!, 10);
        const month = parseInt(euMatch[2]!, 10);
        const year = parseInt(euMatch[3]!, 10);
        const date = new Date(year, month - 1, day);
        if (isValidDate(date, year, month, day)) return date;
    }

    return null;
}

function isValidDate(date: Date, year: number, month: number, day: number): boolean {
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

/**
 * Auto-detect the delimiter of a CSV string.
 * Tests `;`, `,`, `\t` — returns whichever produces the most consistent column count.
 */
export function detectDelimiter(rawCSV: string): string {
    const lines = rawCSV.split('\n').slice(0, 5).filter((l) => l.trim());
    const delimiters = [';', ',', '\t'];
    let bestDelimiter = ';';
    let bestScore = -1;

    for (const delim of delimiters) {
        const counts = lines.map((line) => line.split(delim).length);
        const allSame = counts.every((c) => c === counts[0]);
        const score = allSame ? (counts[0] ?? 0) : 0;
        if (score > bestScore) {
            bestScore = score;
            bestDelimiter = delim;
        }
    }

    return bestDelimiter;
}
