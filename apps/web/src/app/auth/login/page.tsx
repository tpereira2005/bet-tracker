'use client';

import { useState, type FormEvent } from 'react';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, BarChart3, Mail, Lock, AlertCircle, Check, X } from 'lucide-react';

// Error translations (PT)
const ERROR_TRANSLATIONS: Record<string, string> = {
    'Invalid login credentials': 'Email ou password incorretos',
    'Email not confirmed': 'Confirma o teu email antes de entrar',
    'User already registered': 'Este email já está registado',
    'Password should be at least 6 characters':
        'A password deve ter pelo menos 6 caracteres',
    'Signup requires a valid password': 'Introduz uma password válida',
    'Email rate limit exceeded': 'Demasiadas tentativas. Tenta novamente mais tarde.',
    'For security purposes, you can only request this once every 60 seconds':
        'Podes pedir novamente em 60 segundos',
};

function translateError(msg: string): string {
    return ERROR_TRANSLATIONS[msg] ?? msg;
}

type AuthMode = 'login' | 'register' | 'reset';

export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const passwordStrength = getPasswordStrength(password);
    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const supabase = createClient();

        try {
            if (mode === 'login') {
                const { error: err } = await supabase.auth.signInWithPassword({ email, password });
                if (err) throw err;
                router.push('/dashboard');
            } else if (mode === 'register') {
                if (password !== confirmPassword) {
                    setError('As passwords não coincidem');
                    setLoading(false);
                    return;
                }
                if (passwordStrength.level === 'weak') {
                    setError('A password é demasiado fraca. Usa pelo menos 8 caracteres com letras e números.');
                    setLoading(false);
                    return;
                }
                const { error: err } = await supabase.auth.signUp({ email, password });
                if (err) throw err;
                setSuccess('Conta criada! Verifica o teu email para confirmar o registo.');
            } else if (mode === 'reset') {
                const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/reset-password`,
                });
                if (err) throw err;
                setSuccess('Email de recuperação enviado! Verifica a tua caixa de entrada.');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Ocorreu um erro inesperado';
            setError(translateError(message));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-dvh flex items-center justify-center bg-[var(--color-bg-primary)] px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-11 h-11 rounded-xl gradient-brand-bg flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold gradient-brand">BetTracker</span>
                    </div>
                    <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
                        {mode === 'login' && 'Bem-vindo de volta'}
                        {mode === 'register' && 'Cria a tua conta'}
                        {mode === 'reset' && 'Recuperar password'}
                    </h1>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        {mode === 'login' && 'Entra na tua conta para continuar'}
                        {mode === 'register' && 'Começa a analisar as tuas apostas'}
                        {mode === 'reset' && 'Vamos enviar-te um link de recuperação'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="p-8 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-[var(--shadow-elevated)]">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="o-teu@email.com"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-border-focus)] focus:outline-none transition-colors text-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        {mode !== 'reset' && (
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-12 py-3 rounded-xl bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-border-focus)] focus:outline-none transition-colors text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
                                        aria-label={showPassword ? 'Esconder password' : 'Mostrar password'}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                {/* Password strength (register only) */}
                                {mode === 'register' && password.length > 0 && (
                                    <div className="mt-2">
                                        <div className="flex gap-1.5 mb-1">
                                            {[1, 2, 3].map((step) => (
                                                <div
                                                    key={step}
                                                    className={`h-1 flex-1 rounded-full transition-colors ${step <= passwordStrength.score
                                                        ? passwordStrength.color
                                                        : 'bg-[var(--color-bg-elevated)]'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className={`text-xs ${passwordStrength.textColor}`}>
                                            {passwordStrength.label}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Confirm Password */}
                        {mode === 'register' && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                                    Confirmar Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                                    <input
                                        id="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-12 py-3 rounded-xl bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-border-focus)] focus:outline-none transition-colors text-sm"
                                    />
                                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                                        {passwordsMatch && <Check className="w-4 h-4 text-[var(--color-accent-emerald)]" />}
                                        {passwordsMismatch && <X className="w-4 h-4 text-[var(--color-accent-rose)]" />}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--color-accent-rose-subtle)] text-[var(--color-accent-rose)] text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--color-accent-emerald-subtle)] text-[var(--color-accent-emerald)] text-sm">
                                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl gradient-brand-bg text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    A processar...
                                </span>
                            ) : (
                                <>
                                    {mode === 'login' && 'Entrar'}
                                    {mode === 'register' && 'Criar Conta'}
                                    {mode === 'reset' && 'Enviar Link'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Mode switches */}
                    <div className="mt-6 pt-6 border-t border-[var(--color-border)] text-center text-sm">
                        {mode === 'login' && (
                            <>
                                <button
                                    onClick={() => { setMode('reset'); setError(''); setSuccess(''); }}
                                    className="text-[var(--color-accent-violet)] hover:underline"
                                >
                                    Esqueci a password
                                </button>
                                <p className="mt-3 text-[var(--color-text-secondary)]">
                                    Não tens conta?{' '}
                                    <button
                                        onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                                        className="text-[var(--color-accent-violet)] hover:underline font-medium"
                                    >
                                        Regista-te
                                    </button>
                                </p>
                            </>
                        )}
                        {mode === 'register' && (
                            <p className="text-[var(--color-text-secondary)]">
                                Já tens conta?{' '}
                                <button
                                    onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                                    className="text-[var(--color-accent-violet)] hover:underline font-medium"
                                >
                                    Entrar
                                </button>
                            </p>
                        )}
                        {mode === 'reset' && (
                            <p className="text-[var(--color-text-secondary)]">
                                Lembras-te da password?{' '}
                                <button
                                    onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                                    className="text-[var(--color-accent-violet)] hover:underline font-medium"
                                >
                                    Voltar ao login
                                </button>
                            </p>
                        )}
                    </div>
                </div>

                {/* Privacy notice */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                        🔒 Os teus dados estão seguros e encriptados. Nunca partilhamos informação com terceiros.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ── Password Strength ──

interface PasswordStrengthResult {
    level: 'weak' | 'medium' | 'strong';
    score: number;
    label: string;
    color: string;
    textColor: string;
}

function getPasswordStrength(password: string): PasswordStrengthResult {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2)
        return { level: 'weak', score: 1, label: 'Fraca', color: 'bg-[var(--color-accent-rose)]', textColor: 'text-[var(--color-accent-rose)]' };
    if (score <= 3)
        return { level: 'medium', score: 2, label: 'Média', color: 'bg-[var(--color-accent-amber)]', textColor: 'text-[var(--color-accent-amber)]' };
    return { level: 'strong', score: 3, label: 'Forte', color: 'bg-[var(--color-accent-emerald)]', textColor: 'text-[var(--color-accent-emerald)]' };
}
