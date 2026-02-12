'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Check, X } from 'lucide-react';

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
        <div
            className="min-h-dvh flex items-center justify-center px-4 py-12 relative overflow-hidden"
            style={{ backgroundColor: 'var(--bg-primary)' }}
        >
            {/* Decorative glow */}
            <div
                className="glow-orb"
                style={{
                    width: '500px',
                    height: '500px',
                    top: '-100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--accent)',
                    opacity: 0.04,
                }}
            />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2.5 mb-6">
                        <Image src="/logo.png" alt="BetTracker" width={36} height={36} />
                        <span
                            style={{
                                fontFamily: 'var(--font-heading), Instrument Serif, serif',
                                fontSize: '1.5rem',
                                color: 'var(--text-primary)',
                                transform: 'translateY(1px)',
                                display: 'inline-block',
                            }}
                        >
                            BetTracker
                        </span>
                    </div>
                    <h1 className="heading-2">
                        {mode === 'login' && 'Bem-vindo de volta'}
                        {mode === 'register' && 'Cria a tua conta'}
                        {mode === 'reset' && 'Recuperar password'}
                    </h1>
                    <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {mode === 'login' && 'Entra na tua conta para continuar'}
                        {mode === 'register' && 'Começa a analisar as tuas apostas'}
                        {mode === 'reset' && 'Vamos enviar-te um link de recuperação'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="card" style={{ padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)' }}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="label block mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                                    style={{ color: 'var(--text-muted)' }}
                                />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="o-teu@email.com"
                                    className="input"
                                    style={{ paddingLeft: '44px' }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        {mode !== 'reset' && (
                            <div>
                                <label htmlFor="password" className="label block mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                                        style={{ color: 'var(--text-muted)' }}
                                    />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="input"
                                        style={{ paddingLeft: '44px', paddingRight: '48px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                                        style={{ color: 'var(--text-muted)' }}
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
                                                    className="h-1 flex-1 transition-colors"
                                                    style={{
                                                        borderRadius: 'var(--radius-full)',
                                                        backgroundColor:
                                                            step <= passwordStrength.score
                                                                ? passwordStrength.color
                                                                : 'var(--bg-elevated)',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <p
                                            className="text-xs"
                                            style={{ color: passwordStrength.textColor }}
                                        >
                                            {passwordStrength.label}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Confirm Password */}
                        {mode === 'register' && (
                            <div>
                                <label htmlFor="confirmPassword" className="label block mb-2">
                                    Confirmar Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                                        style={{ color: 'var(--text-muted)' }}
                                    />
                                    <input
                                        id="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="input"
                                        style={{ paddingLeft: '44px', paddingRight: '48px' }}
                                    />
                                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                                        {passwordsMatch && <Check className="w-4 h-4" style={{ color: 'var(--positive)' }} />}
                                        {passwordsMismatch && <X className="w-4 h-4" style={{ color: 'var(--negative)' }} />}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div
                                className="flex items-start gap-2 p-3.5 text-sm"
                                style={{
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'var(--negative-subtle)',
                                    color: 'var(--negative)',
                                }}
                            >
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div
                                className="flex items-start gap-2 p-3.5 text-sm"
                                style={{
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'var(--positive-subtle)',
                                    color: 'var(--positive)',
                                }}
                            >
                                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-accent w-full"
                            style={{ padding: '14px' }}
                        >
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <span
                                        className="w-4 h-4 border-2 rounded-full animate-spin"
                                        style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                                    />
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
                    <div className="mt-6 pt-6 text-center text-sm" style={{ borderTop: '1px solid var(--border)' }}>
                        {mode === 'login' && (
                            <>
                                <button
                                    onClick={() => { setMode('reset'); setError(''); setSuccess(''); }}
                                    style={{ color: 'var(--accent)' }}
                                    className="hover:underline"
                                >
                                    Esqueci a password
                                </button>
                                <p className="mt-3" style={{ color: 'var(--text-secondary)' }}>
                                    Não tens conta?{' '}
                                    <button
                                        onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                                        style={{ color: 'var(--accent)' }}
                                        className="hover:underline font-medium"
                                    >
                                        Regista-te
                                    </button>
                                </p>
                            </>
                        )}
                        {mode === 'register' && (
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Já tens conta?{' '}
                                <button
                                    onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                                    style={{ color: 'var(--accent)' }}
                                    className="hover:underline font-medium"
                                >
                                    Entrar
                                </button>
                            </p>
                        )}
                        {mode === 'reset' && (
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Lembras-te da password?{' '}
                                <button
                                    onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                                    style={{ color: 'var(--accent)' }}
                                    className="hover:underline font-medium"
                                >
                                    Voltar ao login
                                </button>
                            </p>
                        )}
                    </div>
                </div>

                {/* Privacy notice */}
                <div className="mt-6 text-center">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
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
        return { level: 'weak', score: 1, label: 'Fraca', color: 'var(--negative)', textColor: 'var(--negative)' };
    if (score <= 3)
        return { level: 'medium', score: 2, label: 'Média', color: 'var(--warning)', textColor: 'var(--warning)' };
    return { level: 'strong', score: 3, label: 'Forte', color: 'var(--positive)', textColor: 'var(--positive)' };
}
