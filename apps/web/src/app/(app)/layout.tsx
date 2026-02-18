'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { useTheme } from '@/components/providers/theme-provider';
import {
    LayoutDashboard,
    Receipt,
    TrendingUp,
    Users,
    GitCompareArrows,
    Target,
    Settings,
    LogOut,
    Sun,
    Moon,
} from 'lucide-react';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/transactions', label: 'Transações', icon: Receipt },
    { href: '/analytics', label: 'Análise', icon: TrendingUp },
    { href: '/profiles', label: 'Perfis', icon: Users },
    { href: '/compare', label: 'Comparar', icon: GitCompareArrows },
    { href: '/goals', label: 'Objetivos', icon: Target },
    { href: '/settings', label: 'Definições', icon: Settings },
];

/* Show core items in mobile bottom bar (5 max for ergonomics) */
const MOBILE_TABS = [
    NAV_ITEMS[0]!, // Dashboard
    NAV_ITEMS[1]!, // Transações
    NAV_ITEMS[2]!, // Análise
    NAV_ITEMS[3]!, // Perfis
    NAV_ITEMS[6]!, // Definições
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-dvh" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* ── Top Nav (all screens) ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5"
                        style={{
                            fontFamily: 'var(--font-heading), Instrument Serif, serif',
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            fontSize: '1.125rem',
                        }}
                    >
                        <Image src="/logo.png" alt="BetTracker" width={26} height={26} />
                        <span style={{ transform: 'translateY(1px)' }}>BetTracker</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors"
                                    style={{
                                        borderRadius: 'var(--radius-sm)',
                                        color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                                        backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                                    }}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 transition-colors"
                            style={{
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--text-muted)',
                            }}
                            title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => { void signOut(); }}
                            className="p-2 transition-colors"
                            style={{
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--text-muted)',
                            }}
                            title="Sair"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Main Content ── */}
            <main className="pt-14 pb-20 md:pb-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
                    {children}
                </div>
            </main>

            {/* ── Mobile Bottom Tab Bar ── */}
            <div
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass"
                style={{ borderTop: '1px solid var(--border)' }}
            >
                <div className="flex items-center justify-around h-16 px-2">
                    {MOBILE_TABS.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors"
                                style={{
                                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                                    textDecoration: 'none',
                                }}
                            >
                                <item.icon className="w-5 h-5" />
                                <span style={{ fontSize: '0.625rem', fontWeight: 500 }}>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
