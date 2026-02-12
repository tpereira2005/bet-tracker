// ──────────────────────────────────────────────
// Currency, date, and number formatters
// Locale-aware for PT and EN
// ──────────────────────────────────────────────

import type { Locale } from '../types';

const LOCALE_MAP: Record<Locale, string> = {
    pt: 'pt-PT',
    en: 'en-GB',
};

/**
 * Format a number as currency (EUR).
 * @example formatCurrency(1234.56, 'pt') → "1.234,56 €"
 */
export function formatCurrency(value: number, locale: Locale = 'pt'): string {
    return new Intl.NumberFormat(LOCALE_MAP[locale], {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

/**
 * Format a number as a percentage.
 * @example formatPercentage(0.1567, 'pt') → "15,67%"
 */
export function formatPercentage(value: number, locale: Locale = 'pt'): string {
    return new Intl.NumberFormat(LOCALE_MAP[locale], {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(value);
}

/**
 * Format a number with locale-specific separators.
 * @example formatNumber(1234.5, 'pt') → "1.234,5"
 */
export function formatNumber(
    value: number,
    locale: Locale = 'pt',
    decimals: number = 2,
): string {
    return new Intl.NumberFormat(LOCALE_MAP[locale], {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/**
 * Format a Date for display.
 * @example formatDate(new Date('2025-01-15'), 'pt') → "15/01/2025"
 */
export function formatDate(date: Date, locale: Locale = 'pt'): string {
    return new Intl.DateTimeFormat(LOCALE_MAP[locale], {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
}

/**
 * Format a Date for HTML date input (ISO).
 * @example formatDateForInput(new Date('2025-01-15')) → "2025-01-15"
 */
export function formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Format a month key to a human-readable label.
 * @example formatMonthLabel('2025-01', 'pt') → "Jan 2025"
 */
export function formatMonthLabel(monthKey: string, locale: Locale = 'pt'): string {
    const [yearStr, monthStr] = monthKey.split('-');
    const year = parseInt(yearStr ?? '0', 10);
    const month = parseInt(monthStr ?? '0', 10);
    const date = new Date(year, month - 1, 1);
    return new Intl.DateTimeFormat(LOCALE_MAP[locale], {
        month: 'short',
        year: 'numeric',
    }).format(date);
}

/**
 * Format a signed value with + or - prefix and EUR.
 * @example formatSignedCurrency(150.5, 'pt') → "+150,50 €"
 * @example formatSignedCurrency(-50, 'pt') → "-50,00 €"
 */
export function formatSignedCurrency(value: number, locale: Locale = 'pt'): string {
    const formatted = formatCurrency(Math.abs(value), locale);
    return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

/**
 * Format a compact number (K, M).
 * @example formatCompact(1500) → "1.5K"
 */
export function formatCompact(value: number): string {
    if (Math.abs(value) >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toFixed(0);
}
