// ──────────────────────────────────────────────
// Betano CSV Parser
// Handles the "Date;Tipe;Vaule" format
// ──────────────────────────────────────────────

import type { ParseResult, RawTransaction, ParseError } from '../types';
import {
    type CSVParser,
    normalizeHeader,
    sanitizeValue,
    normalizeType,
    parseDate,
    detectDelimiter,
} from './types';

export class BetanoParser implements CSVParser {
    readonly name = 'Betano';

    detect(headers: string[]): boolean {
        const normalized = headers.map((h) => normalizeHeader(h));
        // Must have at least date, type, and value columns
        return (
            normalized.includes('date') &&
            normalized.includes('type') &&
            normalized.includes('value')
        );
    }

    parse(rawCSV: string): ParseResult {
        const errors: ParseError[] = [];
        const warnings: string[] = [];
        const transactions: RawTransaction[] = [];

        // Detect delimiter
        const delimiter = detectDelimiter(rawCSV);

        // Split into lines and remove empty
        const lines = rawCSV
            .split('\n')
            .map((l) => l.replace(/\r$/, '').trim())
            .filter((l) => l.length > 0);

        if (lines.length < 2) {
            return {
                success: false,
                transactions: [],
                errors: [{ row: 0, field: '', message: 'File is empty or has no data rows', rawValue: '' }],
                warnings: [],
                detectedFormat: this.name,
            };
        }

        // Parse headers
        const headerLine = lines[0]!;
        const rawHeaders = headerLine.split(delimiter).map((h) => h.trim());
        const headerMap = new Map<string, number>();

        for (let i = 0; i < rawHeaders.length; i++) {
            const normalized = normalizeHeader(rawHeaders[i]!);
            if (normalized) {
                headerMap.set(normalized, i);
            }
        }

        const dateIdx = headerMap.get('date');
        const typeIdx = headerMap.get('type');
        const valueIdx = headerMap.get('value');

        if (dateIdx === undefined || typeIdx === undefined || valueIdx === undefined) {
            return {
                success: false,
                transactions: [],
                errors: [
                    {
                        row: 0,
                        field: 'headers',
                        message: `Missing required columns. Found: ${rawHeaders.join(', ')}`,
                        rawValue: headerLine,
                    },
                ],
                warnings: [],
                detectedFormat: this.name,
            };
        }

        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i]!;
            const fields = line.split(delimiter);

            // Validate date
            const rawDate = fields[dateIdx]?.trim() ?? '';
            const date = parseDate(rawDate);
            if (!date) {
                errors.push({
                    row: i + 1,
                    field: 'date',
                    message: `Invalid date format: "${rawDate}"`,
                    rawValue: rawDate,
                });
                continue;
            }

            // Validate type
            const rawType = fields[typeIdx]?.trim() ?? '';
            const type = normalizeType(rawType);
            if (!type) {
                errors.push({
                    row: i + 1,
                    field: 'type',
                    message: `Unknown transaction type: "${rawType}"`,
                    rawValue: rawType,
                });
                continue;
            }

            // Validate value
            const rawValue = fields[valueIdx]?.trim() ?? '';
            let amount: number;
            try {
                amount = sanitizeValue(rawValue);
            } catch {
                errors.push({
                    row: i + 1,
                    field: 'value',
                    message: `Invalid numeric value: "${rawValue}"`,
                    rawValue: rawValue,
                });
                continue;
            }

            if (amount <= 0) {
                errors.push({
                    row: i + 1,
                    field: 'value',
                    message: `Value must be positive: ${amount}`,
                    rawValue: rawValue,
                });
                continue;
            }

            transactions.push({
                date: rawDate,
                type: type,
                value: rawValue,
            });
        }

        if (errors.length > 0) {
            warnings.push(`${errors.length} row(s) had validation errors and were skipped`);
        }

        return {
            success: errors.length === 0 || transactions.length > 0,
            transactions,
            errors,
            warnings,
            detectedFormat: this.name,
        };
    }
}
