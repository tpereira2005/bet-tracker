import Link from 'next/link';
import {
    BarChart3,
    TrendingUp,
    Shield,
    ArrowRight,
    Zap,
    ChartPie,
    Upload,
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-dvh relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Decorative glow orbs */}
            <div
                className="glow-orb"
                style={{
                    width: '600px',
                    height: '600px',
                    top: '-200px',
                    right: '10%',
                    background: 'var(--accent)',
                    opacity: 0.05,
                }}
            />
            <div
                className="glow-orb"
                style={{
                    width: '400px',
                    height: '400px',
                    top: '50%',
                    left: '-100px',
                    background: '#38BDF8',
                    opacity: 0.03,
                }}
            />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="text-lg tracking-tight"
                        style={{
                            fontFamily: 'var(--font-heading), Instrument Serif, serif',
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                        }}
                    >
                        BetTracker
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/auth/login"
                            className="btn btn-ghost btn-sm"
                        >
                            Entrar
                        </Link>
                        <Link href="/auth/register" className="btn btn-primary btn-sm">
                            Começar Grátis
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-36 sm:pt-44 px-6" style={{ paddingBottom: 'var(--space-4xl)' }}>
                <div className="max-w-5xl mx-auto text-center">
                    {/* Pill tag */}
                    <div className="pill mb-8 mx-auto" style={{ width: 'fit-content' }}>
                        Plataforma de Análise Profissional
                    </div>

                    <h1 className="heading-hero mb-6 mx-auto" style={{ maxWidth: '780px' }}>
                        Controla as tuas apostas como um profissional.
                    </h1>

                    <p
                        className="body-lg mx-auto mb-10"
                        style={{ color: 'var(--text-secondary)', maxWidth: '520px' }}
                    >
                        Analisa depósitos, levantamentos, ROI e tendências.
                        Insights automáticos e gráficos que te ajudam a tomar melhores decisões.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/auth/register"
                            className="btn btn-accent btn-lg group"
                        >
                            Criar Conta Grátis
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <Link href="/auth/login" className="btn btn-outlined btn-lg">
                            Já tenho conta
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Row */}
            <section className="relative px-6" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-3 gap-0">
                        <StatBlock number="9" label="KPIs em tempo real" />
                        <StatBlock number="5" label="Gráficos interativos" />
                        <StatBlock number="∞" label="Transações por perfil" />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="relative px-6" style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-4xl)' }}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="label mb-4" style={{ color: 'var(--accent)' }}>Funcionalidades</p>
                        <h2 className="heading-1">
                            Tudo o que precisas,<br />num só lugar.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FeatureCard
                            icon={<TrendingUp className="w-5 h-5" />}
                            title="Dashboard Completo"
                            description="9 KPIs essenciais: resultado líquido, ROI, win rate, tendências e muito mais."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="w-5 h-5" />}
                            title="5 Tipos de Gráficos"
                            description="Balanço cumulativo, resultados mensais, distribuição, histograma e variação MoM."
                        />
                        <FeatureCard
                            icon={<Zap className="w-5 h-5" />}
                            title="Insights Automáticos"
                            description="Análise inteligente que identifica padrões, performance e gera recomendações."
                        />
                        <FeatureCard
                            icon={<Upload className="w-5 h-5" />}
                            title="Upload Simples"
                            description="Importa o teu CSV e vê os dados instantaneamente. Suporte para múltiplos formatos."
                        />
                        <FeatureCard
                            icon={<ChartPie className="w-5 h-5" />}
                            title="Múltiplos Perfis"
                            description="Gere várias contas, compara perfis lado a lado e vê dados combinados."
                        />
                        <FeatureCard
                            icon={<Shield className="w-5 h-5" />}
                            title="Seguro e Privado"
                            description="Dados encriptados, autenticação segura e controlo total sobre a tua informação."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative px-6" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)' }}>
                <div className="max-w-3xl mx-auto">
                    <div className="cta-card text-center" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(24px, 4vw, 56px)' }}>
                        <h2 className="heading-1 mb-4" style={{ position: 'relative' }}>
                            Pronto para começar?
                        </h2>
                        <p className="body-lg mb-10" style={{ color: 'var(--text-secondary)', position: 'relative' }}>
                            Cria a tua conta gratuita e começa a analisar as tuas apostas em segundos.
                        </p>
                        <div style={{ position: 'relative' }}>
                            <Link href="/auth/register" className="btn btn-accent btn-lg">
                                Começar Agora
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer
                className="relative px-6"
                style={{
                    paddingTop: 'var(--space-lg)',
                    paddingBottom: 'var(--space-lg)',
                    borderTop: '1px solid var(--border)',
                }}
            >
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <span
                        className="text-sm"
                        style={{
                            fontFamily: 'var(--font-heading), Instrument Serif, serif',
                            color: 'var(--text-muted)',
                        }}
                    >
                        BetTracker
                    </span>
                    <span className="body-sm" style={{ color: 'var(--text-muted)' }}>
                        © {new Date().getFullYear()} · Feito com dedicação em Portugal
                    </span>
                </div>
            </footer>
        </div>
    );
}

/* ── Sub-components ── */

function StatBlock({ number, label }: { number: string; label: string }) {
    return (
        <div className="stat-block" style={{ padding: 'var(--space-lg) var(--space-md)' }}>
            <div className="number-hero mb-3" style={{ color: 'var(--text-primary)' }}>
                {number}
            </div>
            <p className="label">{label}</p>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div
            className="feature-card"
            style={{ padding: 'var(--space-lg)' }}
        >
            <div
                className="flex items-center justify-center mb-5"
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-subtle)',
                    color: 'var(--accent)',
                }}
            >
                {icon}
            </div>
            <h3 className="heading-4 mb-2">{title}</h3>
            <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>
                {description}
            </p>
        </div>
    );
}
