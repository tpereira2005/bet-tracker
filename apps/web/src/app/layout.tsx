import type { Metadata } from 'next';
import './globals.css';
import { instrumentSerif, inter, jetbrainsMono } from '@/lib/fonts';
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
        <html
            lang="pt"
            data-theme="dark"
            suppressHydrationWarning
            className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
        >
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
