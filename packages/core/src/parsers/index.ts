// ──────────────────────────────────────────────
// Parser Factory
// Auto-detects CSV format and delegates to the right parser
// ──────────────────────────────────────────────

import type { ParseResult } from '../types';
import type { CSVParser } from './types';
import { detectDelimiter } from './types';
import { BetanoParser } from './betano-parser';

/** Registry of all available parsers, in priority order */
const PARSER_REGISTRY: CSVParser[] = [new BetanoParser()];

/**
 * Register a new parser at runtime.
 * Parsers added later have higher priority.
 */
export function registerParser(parser: CSVParser): void {
    PARSER_REGISTRY.unshift(parser);
}

/**
 * Auto-detect the correct parser for the given CSV content
 * and parse it.
 *
 * Detection flow:
 * 1. Extract headers and sample rows
 * 2. Try each registered parser's detect() method
 * 3. First match wins
 * 4. If none match, try BetanoParser as fallback (it's the most flexible)
 */
export function parseCSV(rawCSV: string): ParseResult {
    const delimiter = detectDelimiter(rawCSV);
    const lines = rawCSV
        .split('\n')
        .map((l) => l.replace(/\r$/, '').trim())
        .filter((l) => l.length > 0);

    if (lines.length === 0) {
        return {
            success: false,
            transactions: [],
            errors: [{ row: 0, field: '', message: 'File is empty', rawValue: '' }],
            warnings: [],
            detectedFormat: 'unknown',
        };
    }

    const headers = (lines[0] ?? '').split(delimiter).map((h) => h.trim());
    const sampleRows = lines.slice(1, 6).map((l) => l.split(delimiter).map((f) => f.trim()));

    // Try each registered parser
    for (const parser of PARSER_REGISTRY) {
        if (parser.detect(headers, sampleRows)) {
            return parser.parse(rawCSV);
        }
    }

    // Fallback: try BetanoParser anyway (it has the most flexible parsing)
    const fallback = new BetanoParser();
    const result = fallback.parse(rawCSV);
    if (result.transactions.length > 0) {
        result.warnings.push('Format auto-detected as Betano (fallback)');
        return result;
    }

    return {
        success: false,
        transactions: [],
        errors: [
            {
                row: 0,
                field: 'format',
                message: 'Could not detect CSV format. Expected headers: Date, Type/Tipe, Value/Vaule',
                rawValue: headers.join(', '),
            },
        ],
        warnings: [],
        detectedFormat: 'unknown',
    };
}

/** Get list of all registered parser names */
export function getAvailableParsers(): string[] {
    return PARSER_REGISTRY.map((p) => p.name);
}

export { type CSVParser } from './types';
export { BetanoParser } from './betano-parser';
