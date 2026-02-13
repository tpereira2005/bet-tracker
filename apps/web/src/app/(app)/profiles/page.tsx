'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
    Users,
    Plus,
    Trash2,
    Pencil,
    Check,
    X,
    Loader2,
    Hash,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CircleCheck,
    Circle,
} from 'lucide-react';
import { formatCurrency } from '@bettracker/core';
import {
    getProfiles,
    getProfileStats,
    createProfile,
    updateProfile,
    deleteProfile,
    setDefaultProfile,
    clearAllDefaults,
    type DBProfile,
} from '@/lib/queries';

interface ProfileWithStats extends DBProfile {
    transactionCount: number;
    netResult: number;
}

export default function ProfilesPage() {
    const [loading, setLoading] = useState(true);
    const [profiles, setProfiles] = useState<ProfileWithStats[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [createName, setCreateName] = useState('');
    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [justActivated, setJustActivated] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null);
    const [justRenamed, setJustRenamed] = useState<string | null>(null);
    const [allActive, setAllActive] = useState(false);
    const createInputRef = useRef<HTMLInputElement>(null);

    const loadProfiles = useCallback(async () => {
        const all = await getProfiles();
        const withStats = await Promise.all(
            all.map(async (p) => {
                const stats = await getProfileStats(p.id);
                return { ...p, transactionCount: stats.count, netResult: stats.net };
            }),
        );
        setProfiles(withStats);
        setLoading(false);
    }, []);

    useEffect(() => { loadProfiles(); }, [loadProfiles]);

    // Combined "Todas as Contas" virtual profile
    const showCombined = profiles.length > 1;
    const combinedStats = profiles.reduce(
        (acc, p) => ({ count: acc.count + p.transactionCount, net: acc.net + p.netResult }),
        { count: 0, net: 0 },
    );
    // "Todas" is active if allActive flag is set OR no individual profile is default
    const isCombinedActive = allActive || (showCombined && !profiles.some((p) => p.is_default));

    const handleCreate = async () => {
        if (!createName.trim()) return;
        setCreating(true);
        const result = await createProfile(createName.trim());
        if (result) {
            setCreateName('');
            setShowCreate(false);
            setNewlyCreatedId(result.id);
            await loadProfiles();
            setTimeout(() => setNewlyCreatedId(null), 500);
        }
        setCreating(false);
    };

    const handleRename = async (id: string) => {
        if (!editName.trim()) return;
        setActionLoading(id);
        await updateProfile(id, editName.trim());
        setEditingId(null);
        setJustRenamed(id);
        await loadProfiles();
        setActionLoading(null);
        setTimeout(() => setJustRenamed(null), 600);
    };

    const handleDelete = async (id: string) => {
        setRemovingId(id);
        await new Promise((r) => setTimeout(r, 250));
        setActionLoading(id);
        await deleteProfile(id);
        setDeletingId(null);
        setRemovingId(null);
        await loadProfiles();
        setActionLoading(null);
    };

    const handleSetDefault = async (id: string) => {
        if (actionLoading) return;
        setAllActive(false);
        setActionLoading(id);
        await setDefaultProfile(id);
        setJustActivated(id);
        await loadProfiles();
        setActionLoading(null);
        setTimeout(() => setJustActivated(null), 700);
    };

    const handleSelectAll = async () => {
        if (actionLoading || isCombinedActive) return;
        setAllActive(true);
        setJustActivated('__all__');
        await clearAllDefaults();
        await loadProfiles();
        setTimeout(() => setJustActivated(null), 700);
    };

    // Shared styles for action icon buttons
    const actionBtnStyle = (hoverColor: string, hoverBg: string) => ({
        base: {
            color: 'var(--text-muted)',
            borderRadius: 'var(--radius-sm)',
            transition: 'color 0.2s ease, background 0.2s ease, transform 0.15s ease',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            width: 32,
            height: 32,
        },
        onEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.color = hoverColor;
            e.currentTarget.style.background = hoverBg;
            e.currentTarget.style.transform = 'scale(1.15)';
        },
        onLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
        },
    });

    const editBtnHover = actionBtnStyle('var(--accent)', 'var(--accent-subtle)');
    const deleteBtnHover = actionBtnStyle('var(--negative)', 'var(--negative-subtle)');
    const confirmBtnHover = actionBtnStyle('var(--positive)', 'rgba(34, 197, 94, 0.1)');
    const cancelBtnHover = actionBtnStyle('var(--negative)', 'rgba(239, 68, 68, 0.1)');

    // ── Loading ──
    if (loading) {
        return (
            <div className="space-y-6 page-enter">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="heading-1">Perfis</h1>
                        <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Gere as tuas contas de apostas</p>
                    </div>
                </div>
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="skeleton-block" style={{ height: 88, borderRadius: 'var(--radius-lg)' }} />
                    ))}
                </div>
            </div>
        );
    }

    // ── Card wrapper style builder ──
    const cardStyle = (isActive: boolean): React.CSSProperties => ({
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-card)',
        border: `2px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
        cursor: isActive ? 'default' : 'pointer',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease',
        overflow: 'hidden',
    });

    return (
        <div className="space-y-6 page-enter">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="heading-1">Perfis</h1>
                    <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {profiles.length} perfil{profiles.length !== 1 ? 's' : ''} · Clica num perfil para o ativar
                    </p>
                </div>
                <button
                    onClick={() => { setShowCreate(true); setTimeout(() => createInputRef.current?.focus(), 50); }}
                    className="btn btn-accent"
                >
                    <Plus className="w-4 h-4" />
                    Novo Perfil
                </button>
            </div>

            {/* Create form */}
            {showCreate && (
                <div className="anim-slide-down" style={{
                    padding: 'var(--space-lg)',
                    borderRadius: 'var(--radius-lg)',
                    border: '2px solid var(--accent)',
                    background: 'var(--bg-elevated)',
                }}>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', fontSize: '0.9375rem' }}>
                        Criar novo perfil
                    </p>
                    <div className="flex gap-2">
                        <input
                            ref={createInputRef}
                            type="text"
                            value={createName}
                            onChange={(e) => setCreateName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreate();
                                if (e.key === 'Escape') { setShowCreate(false); setCreateName(''); }
                            }}
                            placeholder="Nome do perfil (ex: Betano, Bet365...)"
                            autoFocus
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)',
                                background: 'var(--bg-input)',
                                color: 'var(--text-primary)',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        />
                        <button
                            onClick={handleCreate}
                            disabled={creating || !createName.trim()}
                            className="btn btn-accent"
                            style={{ opacity: creating || !createName.trim() ? 0.5 : 1, transition: 'opacity 0.2s' }}
                        >
                            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Criar
                        </button>
                        <button
                            onClick={() => { setShowCreate(false); setCreateName(''); }}
                            className="btn btn-ghost"
                            style={{ padding: '8px' }}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Profile list */}
            <div className="space-y-3 stagger-children">

                {/* ── Virtual "Todas as Contas" combined profile ── */}
                {showCombined && (
                    <div
                        className={justActivated === '__all__' ? 'anim-pulse' : ''}
                        style={{
                            ...cardStyle(isCombinedActive),
                            background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.06), rgba(99, 102, 241, 0.06))',
                            border: `2px solid ${isCombinedActive ? 'var(--accent)' : 'rgba(45, 212, 191, 0.2)'}`,
                        }}
                        onClick={handleSelectAll}
                        onMouseEnter={(e) => {
                            if (!isCombinedActive) {
                                e.currentTarget.style.borderColor = 'var(--accent)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isCombinedActive) {
                                e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.2)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }
                        }}
                    >
                        <div className="flex items-center justify-between" style={{ padding: 'var(--space-lg)' }}>
                            <div className="flex items-center gap-3">
                                {/* Radio indicator */}
                                <div className="flex items-center justify-center flex-shrink-0"
                                    style={{ color: isCombinedActive ? 'var(--accent)' : 'var(--text-muted)', transition: 'color 0.3s ease' }}
                                >
                                    {isCombinedActive
                                        ? <CircleCheck className="w-5 h-5" />
                                        : <Circle className="w-5 h-5" />
                                    }
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>
                                            Todas as Contas
                                        </p>
                                        {isCombinedActive && (
                                            <span style={{
                                                fontSize: '0.6875rem',
                                                fontWeight: 600,
                                                padding: '1px 8px',
                                                borderRadius: 'var(--radius-full)',
                                                background: 'var(--accent-subtle)',
                                                color: 'var(--accent)',
                                                transition: 'opacity 0.3s',
                                            }}>
                                                Ativo
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 mt-1" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                        <span className="flex items-center gap-1">
                                            <Hash className="w-3 h-3" />
                                            {combinedStats.count} transações
                                        </span>
                                        <span className="flex items-center gap-1" style={{
                                            color: combinedStats.net >= 0 ? 'var(--positive)' : 'var(--negative)',
                                        }}>
                                            {combinedStats.net >= 0
                                                ? <TrendingUp className="w-3 h-3" />
                                                : <TrendingDown className="w-3 h-3" />
                                            }
                                            {formatCurrency(combinedStats.net)}
                                        </span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                            {profiles.length} perfis combinados
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Profile cards ── */}
                {profiles.map((profile) => {
                    const isEditing = editingId === profile.id;
                    const isDeleting = deletingId === profile.id;
                    const isLoading = actionLoading === profile.id;
                    const isActive = profile.is_default && !allActive;
                    const wasJustActivated = justActivated === profile.id;
                    const isRemoving = removingId === profile.id;
                    const isNew = newlyCreatedId === profile.id;
                    const wasJustRenamed = justRenamed === profile.id;

                    return (
                        <div
                            key={profile.id}
                            className={`${isRemoving ? 'anim-fade-out' : ''} ${isNew ? 'anim-scale-in' : ''} ${wasJustActivated ? 'anim-pulse' : ''}`}
                            style={cardStyle(isActive)}
                            onClick={() => {
                                if (!isActive && !isEditing && !isDeleting && !isLoading) {
                                    handleSetDefault(profile.id);
                                }
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.borderColor = 'var(--accent)';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            {/* Delete confirmation overlay */}
                            {isDeleting && (
                                <div
                                    className="anim-slide-down flex items-center justify-between"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        padding: 'var(--space-md) var(--space-lg)',
                                        background: 'var(--negative-subtle)',
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--negative)' }} />
                                        <span style={{ fontSize: '0.8125rem', color: 'var(--negative)' }}>
                                            Eliminar <strong>{profile.name}</strong>? {profile.transactionCount > 0 ? `${profile.transactionCount} transações serão apagadas.` : ''}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(profile.id); }}
                                            disabled={isLoading}
                                            style={{
                                                background: 'var(--negative)',
                                                color: '#fff',
                                                fontSize: '0.8125rem',
                                                padding: '5px 14px',
                                                borderRadius: 'var(--radius-sm)',
                                                fontWeight: 500,
                                                border: 'none',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                transition: 'opacity 0.2s, transform 0.15s',
                                            }}
                                        >
                                            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Eliminar'}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setDeletingId(null); }}
                                            style={{
                                                background: 'transparent',
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.8125rem',
                                                padding: '5px 14px',
                                                borderRadius: 'var(--radius-sm)',
                                                border: '1px solid var(--border)',
                                                cursor: 'pointer',
                                                transition: 'opacity 0.2s, border-color 0.2s',
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between" style={{ padding: 'var(--space-lg)' }}>
                                <div className="flex items-center gap-3">
                                    {/* Radio indicator */}
                                    <div
                                        className="flex items-center justify-center flex-shrink-0"
                                        style={{
                                            color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                                            transition: 'color 0.3s ease, transform 0.2s ease',
                                            transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                        }}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--accent)' }} />
                                        ) : isActive ? (
                                            <CircleCheck className="w-5 h-5" />
                                        ) : (
                                            <Circle className="w-5 h-5" />
                                        )}
                                    </div>

                                    {/* Profile info */}
                                    <div style={{ minWidth: 0 }}>
                                        {isEditing ? (
                                            <div
                                                className="flex items-center gap-2 anim-scale-in"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleRename(profile.id);
                                                        if (e.key === 'Escape') setEditingId(null);
                                                    }}
                                                    autoFocus
                                                    style={{
                                                        padding: '4px 10px',
                                                        borderRadius: 'var(--radius-sm)',
                                                        border: '1px solid var(--accent)',
                                                        background: 'var(--bg-input)',
                                                        color: 'var(--text-primary)',
                                                        fontSize: '0.9375rem',
                                                        outline: 'none',
                                                        width: '200px',
                                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                                        boxShadow: '0 0 0 2px rgba(45, 212, 191, 0.15)',
                                                    }}
                                                />
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleRename(profile.id); }}
                                                    style={confirmBtnHover.base}
                                                    onMouseEnter={confirmBtnHover.onEnter}
                                                    onMouseLeave={confirmBtnHover.onLeave}
                                                    title="Confirmar"
                                                >
                                                    {isLoading
                                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                                        : <Check className="w-4 h-4" />
                                                    }
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                                                    style={cancelBtnHover.base}
                                                    onMouseEnter={cancelBtnHover.onEnter}
                                                    onMouseLeave={cancelBtnHover.onLeave}
                                                    title="Cancelar"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <p
                                                    style={{
                                                        fontWeight: 600,
                                                        color: 'var(--text-primary)',
                                                        fontSize: '1rem',
                                                        transition: 'color 0.3s',
                                                    }}
                                                >
                                                    {profile.name}
                                                </p>
                                                {isActive && (
                                                    <span style={{
                                                        fontSize: '0.6875rem',
                                                        fontWeight: 600,
                                                        padding: '1px 8px',
                                                        borderRadius: 'var(--radius-full)',
                                                        background: 'var(--accent-subtle)',
                                                        color: 'var(--accent)',
                                                        transition: 'opacity 0.3s',
                                                    }}>
                                                        Ativo
                                                    </span>
                                                )}
                                                {wasJustRenamed && (
                                                    <span style={{
                                                        fontSize: '0.6875rem',
                                                        fontWeight: 600,
                                                        padding: '1px 8px',
                                                        borderRadius: 'var(--radius-full)',
                                                        background: 'rgba(34, 197, 94, 0.1)',
                                                        color: 'var(--positive)',
                                                        animation: 'fadeInUp 0.3s ease-out',
                                                    }}>
                                                        ✓ Renomeado
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4 mt-1" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                            <span className="flex items-center gap-1">
                                                <Hash className="w-3 h-3" />
                                                {profile.transactionCount} transações
                                            </span>
                                            <span className="flex items-center gap-1" style={{
                                                color: profile.netResult >= 0 ? 'var(--positive)' : 'var(--negative)',
                                            }}>
                                                {profile.netResult >= 0
                                                    ? <TrendingUp className="w-3 h-3" />
                                                    : <TrendingDown className="w-3 h-3" />
                                                }
                                                {formatCurrency(profile.netResult)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                {!isEditing && (
                                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => { setEditingId(profile.id); setEditName(profile.name); }}
                                            title="Renomear"
                                            style={editBtnHover.base}
                                            onMouseEnter={editBtnHover.onEnter}
                                            onMouseLeave={editBtnHover.onLeave}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        {!isActive && (
                                            <button
                                                onClick={() => setDeletingId(profile.id)}
                                                title="Eliminar"
                                                style={deleteBtnHover.base}
                                                onMouseEnter={deleteBtnHover.onEnter}
                                                onMouseLeave={deleteBtnHover.onLeave}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty state */}
            {profiles.length === 0 && (
                <div className="empty-state anim-fade-in">
                    <div className="empty-state-icon">
                        <Users className="w-6 h-6" />
                    </div>
                    <p className="empty-state-title">Sem perfis criados</p>
                    <p className="empty-state-description">
                        Cria perfis para organizar as tuas apostas por casa ou estratégia.
                    </p>
                </div>
            )}
        </div>
    );
}
