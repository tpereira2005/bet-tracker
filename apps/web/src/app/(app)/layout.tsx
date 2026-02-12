'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { useTheme } from '@/components/providers/theme-provider';
import {
    BarChart3,
    LayoutDashboard,
    Receipt,
    TrendingUp,
    Users,
    GitCompare,
    Target,
    Settings,
    LogOut,
    Sun,
    Moon,
    Menu,
    X,
    ChevronLeft,
} from 'lucide-react';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/transactions', label: 'Transações', icon: Receipt },
    { href: '/analytics', label: 'Análise', icon: TrendingUp },
    { href: '/profiles', label: 'Perfis', icon: Users },
    { href: '/compare', label: 'Comparar', icon: GitCompare },
    { href: '/goals', label: 'Objetivos', icon: Target },
    { href: '/settings', label: 'Definições', icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-dvh bg-[var(--color-bg-primary)] flex">
            {/* Sidebar — Desktop */}
            <aside
                className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40 bg-[var(--color-bg-card)] border-r border-[var(--color-border)] transition-all duration-300 ${sidebarCollapsed ? 'w-[72px]' : 'w-[240px]'
                    }`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-5 border-b border-[var(--color-border)] gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-brand-bg flex items-center justify-center shrink-0">
                        <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    {!sidebarCollapsed && (
                        <span className="text-lg font-bold gradient-brand whitespace-nowrap">BetTracker</span>
                    )}
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-[var(--color-accent-violet-subtle)] text-[var(--color-accent-violet)]'
                                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-hover)] hover:text-[var(--color-text-primary)]'
                                    }`}
                                title={sidebarCollapsed ? item.label : undefined}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />
                                {!sidebarCollapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom actions */}
                <div className="p-3 border-t border-[var(--color-border)] space-y-1">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-hover)] hover:text-[var(--color-text-primary)] transition-all"
                        title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
                        {!sidebarCollapsed && <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>}
                    </button>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-accent-rose)] hover:bg-[var(--color-accent-rose-subtle)] transition-all"
                        title="Sair"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {!sidebarCollapsed && <span>Sair</span>}
                    </button>
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-card-hover)] hover:text-[var(--color-text-secondary)] transition-all"
                    >
                        <ChevronLeft className={`w-5 h-5 shrink-0 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
                        {!sidebarCollapsed && <span>Recolher</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg gradient-brand-bg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-bold gradient-brand">BetTracker</span>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-secondary)]"
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute top-14 left-0 right-0 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] p-4 space-y-1 animate-[slide-down_0.2s_ease-out]">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? 'bg-[var(--color-accent-violet-subtle)] text-[var(--color-accent-violet)]'
                                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-hover)]'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                        <div className="border-t border-[var(--color-border)] pt-2 mt-2 flex gap-2">
                            <button
                                onClick={toggleTheme}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-hover)]"
                            >
                                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                {theme === 'dark' ? 'Claro' : 'Escuro'}
                            </button>
                            <button
                                onClick={signOut}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm text-[var(--color-accent-rose)] hover:bg-[var(--color-accent-rose-subtle)]"
                            >
                                <LogOut className="w-4 h-4" />
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main
                className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[240px]'
                    } mt-14 lg:mt-0`}
            >
                <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">{children}</div>
            </main>
        </div>
    );
}
