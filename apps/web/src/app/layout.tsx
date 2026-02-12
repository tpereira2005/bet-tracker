import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { QueryProvider } from '@/components/providers/query-provider';

export const metadata: Metadata = {
    title: 'BetTracker — Análise Inteligente de Apostas',
    description:
        'Plataforma profissional de análise de transações de apostas desportivas. Acompanha depósitos, levantamentos, ROI e tendências.',
    keywords: ['apostas', 'tracking', 'análise', 'ROI', 'depósitos', 'levantamentos'],
    authors: [{ name: 'BetTracker' }],
    openGraph: {
        title: 'BetTracker — Análise Inteligente de Apostas',
        description: 'Acompanha e analisa as tuas apostas desportivas como um profissional.',
        type: 'website',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt" data-theme="dark" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased">
                <ThemeProvider>
                    <AuthProvider>
                        <QueryProvider>{children}</QueryProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
