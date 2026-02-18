'use client';

import { useState, useCallback, useRef, useEffect, type DragEvent, type ChangeEvent } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader2, ChevronDown, Plus, RefreshCw } from 'lucide-react';
import { parseCSV, sanitizeValue, normalizeType } from '@bettracker/core';
import {
    getDefaultProfile,
    getProfiles,
    insertTransactions,
    diffTransactions,
    type DBProfile,
    type ParsedRow,
    type DiffResult,
} from '@/lib/queries';

type UploadStep = 'idle' | 'analyzing' | 'preview' | 'uploading' | 'success' | 'error';

export default function UploadForm() {
    const [step, setStep] = useState<UploadStep>('idle');
    const [fileName, setFileName] = useState('');
    const [allParsedRows, setAllParsedRows] = useState<ParsedRow[]>([]);
    const [diff, setDiff] = useState<DiffResult | null>(null);
    const [parseErrors, setParseErrors] = useState<string[]>([]);
    const [parseWarnings, setParseWarnings] = useState<string[]>([]);
    const [detectedFormat, setDetectedFormat] = useState('');
    const [uploadResult, setUploadResult] = useState<{ inserted: number; existing: number } | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile selection
    const [profiles, setProfiles] = useState<DBProfile[]>([]);
    const [selectedProfileId, setSelectedProfileId] = useState<string>('');
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    // Load profiles on mount
    useEffect(() => {
        async function loadProfiles() {
            const defaultProfile = await getDefaultProfile();
            const allProfiles = await getProfiles();
            setProfiles(allProfiles);
            if (defaultProfile) {
                setSelectedProfileId(defaultProfile.id);
            } else if (allProfiles.length > 0) {
                setSelectedProfileId(allProfiles[0]!.id);
            }
        }
        loadProfiles();
    }, []);

    const selectedProfile = profiles.find((p) => p.id === selectedProfileId);

    const MAX_FILE_SIZE_MB = 10;

    const handleFile = useCallback(async (file: File) => {
        if (!file.name.endsWith('.csv')) {
            setErrorMessage('Apenas ficheiros CSV são suportados.');
            setStep('error');
            return;
        }

        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setErrorMessage(`O ficheiro é demasiado grande. Tamanho máximo: ${MAX_FILE_SIZE_MB}MB.`);
            setStep('error');
            return;
        }

        if (!selectedProfileId) {
            setErrorMessage('Nenhum perfil selecionado.');
            setStep('error');
            return;
        }

        setFileName(file.name);
        setStep('analyzing');

        const text = await file.text();
        if (!text) {
            setErrorMessage('Ficheiro vazio.');
            setStep('error');
            return;
        }

        const result = parseCSV(text);
        setDetectedFormat(result.detectedFormat);
        setParseWarnings(result.warnings);
        setParseErrors(result.errors.map((err) => `Linha ${err.row}: ${err.message}`));

        if (result.transactions.length === 0) {
            setErrorMessage('Nenhuma transação válida encontrada no ficheiro.');
            setStep('error');
            return;
        }

        // Convert to ParsedRows
        const rows: ParsedRow[] = result.transactions.map((t) => ({
            date: t.date,
            type: normalizeType(t.type)!,
            amount: sanitizeValue(t.value),
            rawLine: `${t.date};${t.type};${t.value}`,
        }));

        setAllParsedRows(rows);

        // Compute diff against existing DB data
        const diffResult = await diffTransactions(selectedProfileId, rows);
        setDiff(diffResult);
        setStep('preview');
    }, [selectedProfileId]);

    const handleDrop = useCallback(
        (e: DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile],
    );

    const handleInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
        },
        [handleFile],
    );

    const handleUpload = useCallback(async () => {
        if (!diff || diff.newRows.length === 0) return;

        setStep('uploading');

        const batchId = `import-${Date.now()}`;
        const result = await insertTransactions(selectedProfileId, diff.newRows, batchId);

        if (result.error) {
            setErrorMessage(result.error);
            setStep('error');
            return;
        }

        setUploadResult({ inserted: result.inserted, existing: diff.existingCount });
        setStep('success');
    }, [diff, selectedProfileId]);

    const reset = useCallback(() => {
        setStep('idle');
        setFileName('');
        setAllParsedRows([]);
        setDiff(null);
        setParseErrors([]);
        setParseWarnings([]);
        setDetectedFormat('');
        setUploadResult(null);
        setErrorMessage('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, []);

    // ── Profile selector ──
    const ProfileSelector = () => (
        <div style={{ position: 'relative', marginBottom: 'var(--space-md)' }}>
            <label className="label" style={{ marginBottom: '6px', display: 'block' }}>Perfil de destino</label>
            <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center justify-between w-full"
                style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                }}
            >
                <span>{selectedProfile?.name ?? 'Selecionar perfil...'}</span>
                <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>
            {showProfileDropdown && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        zIndex: 10,
                        overflow: 'hidden',
                    }}
                >
                    {profiles.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => { setSelectedProfileId(p.id); setShowProfileDropdown(false); }}
                            className="w-full text-left"
                            style={{
                                padding: '8px 12px',
                                fontSize: '0.875rem',
                                color: p.id === selectedProfileId ? 'var(--accent)' : 'var(--text-primary)',
                                background: p.id === selectedProfileId ? 'var(--accent-subtle)' : 'transparent',
                                borderBottom: '1px solid var(--border)',
                            }}
                        >
                            {p.name} {p.is_default && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(padrão)</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    // ── Idle: drop zone ──
    if (step === 'idle') {
        return (
            <div>
                <ProfileSelector />
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center cursor-pointer transition-all"
                    style={{
                        padding: 'var(--space-xl)',
                        border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border-strong)'}`,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isDragging ? 'var(--accent-subtle)' : 'transparent',
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem',
                    }}
                >
                    <div className="text-center">
                        <Upload className="w-6 h-6 mx-auto mb-3" style={{ opacity: 0.5, color: isDragging ? 'var(--accent)' : undefined }} />
                        <p style={{ color: isDragging ? 'var(--accent)' : 'var(--text-secondary)' }}>
                            Arrasta o ficheiro CSV ou <span style={{ color: 'var(--accent)', fontWeight: 500 }}>clica para selecionar</span>
                        </p>
                        <p className="mt-1" style={{ fontSize: '0.75rem' }}>Suporta formato Betano (Date;Tipe;Vaule)</p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleInputChange}
                        className="hidden"
                    />
                </div>
            </div>
        );
    }

    // ── Analyzing: computing diff ──
    if (step === 'analyzing') {
        return (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent)' }} />
                <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>
                    A analisar ficheiro e comparar com dados existentes...
                </p>
            </div>
        );
    }

    // ── Preview: show diff ──
    if (step === 'preview' && diff) {
        const rowsToImport = diff.newRows;
        const deposits = rowsToImport.filter((r) => r.type === 'Deposit');
        const withdrawals = rowsToImport.filter((r) => r.type === 'Withdrawal');
        const totalDeposits = deposits.reduce((sum, r) => sum + r.amount, 0);
        const totalWithdrawals = withdrawals.reduce((sum, r) => sum + r.amount, 0);

        const isReimport = diff.totalInDB > 0;
        const hasNewRows = diff.newRows.length > 0;
        const allExist = diff.existingCount === diff.totalInCSV;

        return (
            <div className="space-y-4">
                {/* File info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                        <span className="body-sm" style={{ fontWeight: 500 }}>{fileName}</span>
                        <span className="body-sm" style={{ color: 'var(--text-muted)' }}>
                            — {detectedFormat} · {allParsedRows.length} transações no ficheiro
                        </span>
                    </div>
                    <button onClick={reset} className="p-1" style={{ color: 'var(--text-muted)' }}>
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* ── Diff summary (only shown on re-import) ── */}
                {isReimport && (
                    <div style={{
                        padding: 'var(--space-md)',
                        borderRadius: 'var(--radius-sm)',
                        background: hasNewRows ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                        border: `1px solid ${hasNewRows ? 'var(--accent)' : 'var(--border)'}`,
                    }}>
                        <div className="flex items-center gap-2 mb-2">
                            <RefreshCw className="w-4 h-4" style={{ color: hasNewRows ? 'var(--accent)' : 'var(--text-muted)' }} />
                            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: hasNewRows ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                {allExist
                                    ? 'Ficheiro já importado'
                                    : `${diff.newRows.length} novas transações encontradas`
                                }
                            </span>
                        </div>
                        <div className="flex gap-4" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                            <span>📁 No ficheiro: <strong>{diff.totalInCSV}</strong></span>
                            <span>💾 Na base de dados: <strong>{diff.totalInDB}</strong></span>
                            <span>✅ Já existentes: <strong>{diff.existingCount}</strong></span>
                            <span style={{ color: hasNewRows ? 'var(--accent)' : 'var(--text-muted)' }}>
                                {hasNewRows ? <><Plus className="w-3 h-3 inline" /> Novas: <strong>{diff.newRows.length}</strong></> : 'Nenhuma nova'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Already fully imported — early return */}
                {allExist && isReimport && (
                    <div className="flex flex-col items-center py-4 gap-2 text-center">
                        <CheckCircle className="w-6 h-6" style={{ color: 'var(--positive)' }} />
                        <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                            Todas as {diff.totalInCSV} transações deste ficheiro já existem na base de dados.
                        </p>
                        <p className="body-sm" style={{ color: 'var(--text-muted)' }}>
                            Nada a importar. Se o ficheiro tiver novas transações, serão detectadas automaticamente.
                        </p>
                        <button onClick={reset} className="btn btn-ghost btn-sm mt-2">
                            Selecionar outro ficheiro
                        </button>
                    </div>
                )}

                {/* New rows to import */}
                {hasNewRows && (
                    <>
                        {/* Summary of new rows */}
                        <div className="grid grid-cols-3 gap-3">
                            <div style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-elevated)' }}>
                                <p className="body-sm" style={{ color: 'var(--text-muted)' }}>
                                    {isReimport ? 'Novos Depósitos' : 'Depósitos'}
                                </p>
                                <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--negative)' }}>
                                    {deposits.length}× · €{totalDeposits.toFixed(2)}
                                </p>
                            </div>
                            <div style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-elevated)' }}>
                                <p className="body-sm" style={{ color: 'var(--text-muted)' }}>
                                    {isReimport ? 'Novos Levantamentos' : 'Levantamentos'}
                                </p>
                                <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--positive)' }}>
                                    {withdrawals.length}× · €{totalWithdrawals.toFixed(2)}
                                </p>
                            </div>
                            <div style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-elevated)' }}>
                                <p className="body-sm" style={{ color: 'var(--text-muted)' }}>Resultado</p>
                                <p style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: 600,
                                    color: totalWithdrawals - totalDeposits >= 0 ? 'var(--positive)' : 'var(--negative)',
                                }}>
                                    €{(totalWithdrawals - totalDeposits).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Warnings */}
                        {parseWarnings.length > 0 && (
                            <div style={{ padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-sm)', background: 'var(--warning-subtle)', color: 'var(--warning)', fontSize: '0.8125rem' }}>
                                {parseWarnings.map((w, i) => <p key={i}>⚠️ {w}</p>)}
                            </div>
                        )}

                        {/* Errors */}
                        {parseErrors.length > 0 && (
                            <details style={{ fontSize: '0.8125rem' }}>
                                <summary style={{ color: 'var(--negative)', cursor: 'pointer' }}>
                                    {parseErrors.length} erro(s) de parsing
                                </summary>
                                <div className="mt-2 space-y-1" style={{ color: 'var(--text-muted)' }}>
                                    {parseErrors.slice(0, 10).map((e, i) => <p key={i}>{e}</p>)}
                                    {parseErrors.length > 10 && <p>... e mais {parseErrors.length - 10}</p>}
                                </div>
                            </details>
                        )}

                        {/* Preview table (only new rows) */}
                        <div>
                            <p className="body-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                                {isReimport ? `Pré-visualização das ${diff.newRows.length} novas transações:` : `Pré-visualização (primeiras 50 de ${rowsToImport.length}):`}
                            </p>
                            <div style={{ maxHeight: '240px', overflow: 'auto', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-elevated)' }}>
                                            <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>Data</th>
                                            <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>Tipo</th>
                                            <th style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 500 }}>Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rowsToImport.slice(0, 50).map((row, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '6px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{row.date}</td>
                                                <td style={{ padding: '6px 12px' }}>
                                                    <span style={{
                                                        fontSize: '0.6875rem',
                                                        fontWeight: 600,
                                                        padding: '2px 8px',
                                                        borderRadius: 'var(--radius-full)',
                                                        background: row.type === 'Deposit' ? 'var(--negative-subtle)' : 'var(--positive-subtle)',
                                                        color: row.type === 'Deposit' ? 'var(--negative)' : 'var(--positive)',
                                                    }}>
                                                        {row.type === 'Deposit' ? 'Depósito' : 'Levantamento'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '6px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                                                    €{row.amount.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {rowsToImport.length > 50 && (
                                    <p className="text-center py-2 body-sm" style={{ color: 'var(--text-muted)' }}>
                                        ... e mais {rowsToImport.length - 50} transações
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button onClick={reset} className="btn btn-ghost">
                                Cancelar
                            </button>
                            <button onClick={handleUpload} className="btn btn-accent flex-1">
                                <Upload className="w-4 h-4" />
                                {isReimport
                                    ? `Adicionar ${diff.newRows.length} Novas Transações`
                                    : `Importar ${rowsToImport.length} Transações`
                                }
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    }

    // ── Uploading ──
    if (step === 'uploading') {
        return (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent)' }} />
                <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>
                    A importar {diff?.newRows.length ?? 0} transações...
                </p>
            </div>
        );
    }

    // ── Success ──
    if (step === 'success' && uploadResult) {
        return (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                <CheckCircle className="w-8 h-8" style={{ color: 'var(--positive)' }} />
                <div>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Importação concluída!</p>
                    <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {uploadResult.inserted} transações adicionadas
                        {uploadResult.existing > 0 && ` · ${uploadResult.existing} já existiam na base de dados`}
                    </p>
                </div>
                <div className="flex gap-2 mt-2">
                    <button onClick={reset} className="btn btn-ghost btn-sm">
                        Importar Mais
                    </button>
                    <a href="/dashboard" className="btn btn-accent btn-sm">
                        Ver Dashboard
                    </a>
                </div>
            </div>
        );
    }

    // ── Error ──
    return (
        <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <AlertCircle className="w-8 h-8" style={{ color: 'var(--negative)' }} />
            <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Erro na importação</p>
                <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{errorMessage}</p>
            </div>
            <button onClick={reset} className="btn btn-ghost btn-sm mt-2">
                Tentar Novamente
            </button>
        </div>
    );
}
