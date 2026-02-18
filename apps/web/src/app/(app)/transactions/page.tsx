'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Filter,
    Upload,
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@bettracker/core';
import { getDefaultProfile, getTransactions, type DBTransaction } from '@/lib/queries';

type SortField = 'transaction_date' | 'amount' | 'transaction_type';
type SortDir = 'asc' | 'desc';
type TypeFilter = 'all' | 'Deposit' | 'Withdrawal';

const PAGE_SIZE = 25;

export default function TransactionsPage() {
    const [rows, setRows] = useState<DBTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState<SortField>('transaction_date');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const profile = await getDefaultProfile();
                // If profile is null, fetch ALL transactions (All Accounts mode)
                const data = await getTransactions(profile ? profile.id : undefined);
                setRows(data);
            } catch (err) {
                console.error('Error loading transactions:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Filter
    const filtered = useMemo(() => {
        if (typeFilter === 'all') return rows;
        return rows.filter((r) => r.transaction_type === typeFilter);
    }, [rows, typeFilter]);

    // Sort
    const sorted = useMemo(() => {
        const copy = [...filtered];
        copy.sort((a, b) => {
            let cmp = 0;
            if (sortField === 'transaction_date') {
                cmp = a.transaction_date.localeCompare(b.transaction_date);
            } else if (sortField === 'amount') {
                cmp = Number(a.amount) - Number(b.amount);
            } else if (sortField === 'transaction_type') {
                cmp = a.transaction_type.localeCompare(b.transaction_type);
            }
            return sortDir === 'asc' ? cmp : -cmp;
        });
        return copy;
    }, [filtered, sortField, sortDir]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    const paginated = useMemo(
        () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        [sorted, page],
    );

    // Reset page when filter changes
    useEffect(() => { setPage(1); }, [typeFilter, sortField, sortDir]);

    const toggleSort = useCallback((field: SortField) => {
        if (sortField === field) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    }, [sortField]);

    const deposits = rows.filter((r) => r.transaction_type === 'Deposit');
    const withdrawals = rows.filter((r) => r.transaction_type === 'Withdrawal');

    // ── Loading ──
    if (loading) {
        return (
            <div className="space-y-6 page-enter">
                <div>
                    <h1 className="heading-1">Transações</h1>
                    <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Histórico de todas as transações
                    </p>
                </div>
                <div className="card skeleton-shimmer" style={{ height: '400px' }} />
            </div>
        );
    }

    // ── Empty ──
    if (rows.length === 0) {
        return (
            <div className="space-y-6 page-enter">
                <div>
                    <h1 className="heading-1">Transações</h1>
                    <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Histórico de todas as transações
                    </p>
                </div>
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <Upload className="w-6 h-6" />
                    </div>
                    <h3 className="empty-state-title">Sem transações</h3>
                    <p className="empty-state-description">
                        Importa um ficheiro CSV para começar a ver o teu histórico.
                    </p>
                    <Link href="/settings" className="btn btn-accent btn-sm mt-2">
                        Importar CSV
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    // ── Data ──
    return (
        <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="heading-1">Transações</h1>
                    <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {rows.length} transações · {deposits.length} depósitos · {withdrawals.length} levantamentos
                    </p>
                </div>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                {(['all', 'Deposit', 'Withdrawal'] as TypeFilter[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setTypeFilter(f)}
                        className="btn btn-sm"
                        style={{
                            background: typeFilter === f ? 'var(--accent-subtle)' : 'transparent',
                            color: typeFilter === f ? 'var(--accent)' : 'var(--text-secondary)',
                            border: `1px solid ${typeFilter === f ? 'var(--accent)' : 'var(--border)'}`,
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            padding: '4px 12px',
                        }}
                    >
                        {f === 'all' ? 'Todas' : f === 'Deposit' ? 'Depósitos' : 'Levantamentos'}
                    </button>
                ))}
                <span className="body-sm" style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <SortHeader label="Data" field="transaction_date" current={sortField} dir={sortDir} onSort={toggleSort} />
                            <SortHeader label="Tipo" field="transaction_type" current={sortField} dir={sortDir} onSort={toggleSort} />
                            <SortHeader label="Valor" field="amount" current={sortField} dir={sortDir} onSort={toggleSort} align="right" />
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((row) => (
                            <tr
                                key={row.id}
                                className="table-row-hover"
                                style={{ borderBottom: '1px solid var(--border)' }}
                            >
                                <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                    {formatDate(new Date(row.transaction_date))}
                                </td>
                                <td style={{ padding: '10px 16px' }}>
                                    <span style={{
                                        fontSize: '0.6875rem',
                                        fontWeight: 600,
                                        padding: '2px 10px',
                                        borderRadius: 'var(--radius-full)',
                                        background: row.transaction_type === 'Deposit' ? 'var(--negative-subtle)' : 'var(--positive-subtle)',
                                        color: row.transaction_type === 'Deposit' ? 'var(--negative)' : 'var(--positive)',
                                    }}>
                                        {row.transaction_type === 'Deposit' ? 'Depósito' : 'Levantamento'}
                                    </span>
                                </td>
                                <td style={{
                                    padding: '10px 16px',
                                    textAlign: 'right',
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: 500,
                                    color: row.transaction_type === 'Deposit' ? 'var(--negative)' : 'var(--positive)',
                                }}>
                                    {row.transaction_type === 'Deposit' ? '-' : '+'}{formatCurrency(Number(row.amount))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="body-sm" style={{ color: 'var(--text-muted)' }}>
                        Página {page} de {totalPages}
                    </p>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="btn btn-ghost btn-sm"
                            style={{ opacity: page === 1 ? 0.3 : 1 }}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="btn btn-ghost btn-sm"
                            style={{ opacity: page === totalPages ? 0.3 : 1 }}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Sort Header ── */
function SortHeader({
    label,
    field,
    current,
    dir,
    onSort,
    align = 'left',
}: {
    label: string;
    field: SortField;
    current: SortField;
    dir: SortDir;
    onSort: (f: SortField) => void;
    align?: 'left' | 'right';
}) {
    const isActive = current === field;
    return (
        <th
            onClick={() => onSort(field)}
            style={{
                padding: '10px 16px',
                textAlign: align,
                fontWeight: 500,
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                cursor: 'pointer',
                userSelect: 'none',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
            }}
        >
            <span className="inline-flex items-center gap-1">
                {label}
                {isActive ? (
                    dir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                ) : (
                    <ArrowUpDown className="w-3 h-3" style={{ opacity: 0.4 }} />
                )}
            </span>
        </th>
    );
}
