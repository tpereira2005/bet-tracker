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
        <div className="min-h-dvh" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <span
                        className="text-xl"
                        style={{ fontFamily: 'var(--font-heading), Instrument Serif, serif' }}
                    >
                        BetTracker
                    </span>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/auth/login"
                            className="body-sm hover:opacity-70 transition-opacity"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Entrar
                        </Link>
                        <Link href="/auth/register" className="btn btn-primary btn-sm">
                            Começar
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section
                className="pt-40 pb-24 px-6"
                style={{ paddingBottom: 'var(--space-4xl)', paddingTop: '160px' }}
            >
                <div className="max-w-4xl mx-auto">
                    <p className="label mb-6" style={{ color: 'var(--accent)' }}>
                        Análise Profissional de Apostas
                    </p>

                    <h1 className="heading-hero mb-8">
                        Controla as tuas apostas como um profissional.
                    </h1>

                    <p
                        className="body-lg max-w-xl mb-12"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Analisa depósitos, levantamentos, ROI e tendências. Insights automáticos e
                        gráficos que te ajudam a tomar melhores decisões.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <Link
                            href="/auth/register"
                            className="btn btn-primary btn-lg group"
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
            <section
                className="px-6"
                style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}
            >
                <div className="max-w-5xl mx-auto">
                    <div className="divider mb-12" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
                        <StatBlock number="9" label="KPIs em tempo real" />
                        <StatBlock number="5" label="Tipos de gráficos" />
                        <StatBlock number="∞" label="Transações por perfil" />
                    </div>
                    <div className="divider mt-12" />
                </div>
            </section>

            {/* Features */}
            <section
                className="px-6"
                style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-4xl)' }}
            >
                <div className="max-w-5xl mx-auto">
                    <p className="label mb-4">Funcionalidades</p>
                    <h2 className="heading-1 mb-16">
                        Tudo o que precisas,<br />num só lugar.
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: 'var(--border)' }}>
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
            <section
                className="px-6"
                style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-4xl)' }}
            >
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="heading-1 mb-4">Pronto para começar?</h2>
                    <p className="body-lg mb-10" style={{ color: 'var(--text-secondary)' }}>
                        Cria a tua conta gratuita e começa a analisar as tuas apostas em segundos.
                    </p>
                    <Link href="/auth/register" className="btn btn-primary btn-lg">
                        Começar Agora
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer
                className="px-6"
                style={{
                    paddingTop: 'var(--space-lg)',
                    paddingBottom: 'var(--space-lg)',
                    borderTop: '1px solid var(--border)',
                }}
            >
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <span className="body-sm" style={{ color: 'var(--text-muted)' }}>
                        BetTracker © {new Date().getFullYear()}
                    </span>
                    <span className="body-sm" style={{ color: 'var(--text-muted)' }}>
                        Feito com dedicação 🇵🇹
                    </span>
                </div>
            </footer>
        </div>
    );
}

/* ── Sub-components ── */

function StatBlock({ number, label }: { number: string; label: string }) {
    return (
        <div className="text-center sm:text-left">
            <div className="number-hero mb-2" style={{ color: 'var(--text-primary)' }}>
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
        <div className="feature-card p-8 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-4">
                <div style={{ color: 'var(--text-muted)' }}>{icon}</div>
                <h3 className="heading-4">{title}</h3>
            </div>
            <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>
                {description}
            </p>
        </div>
    );
}
