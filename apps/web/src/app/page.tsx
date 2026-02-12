import Link from 'next/link';
import {
    BarChart3,
    TrendingUp,
    Shield,
    Smartphone,
    ArrowRight,
    Zap,
    ChartPie,
    Upload,
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-dvh bg-[var(--color-bg-primary)]">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg gradient-brand-bg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-brand">BetTracker</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/auth/login"
                            className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/auth/register"
                            className="px-5 py-2.5 rounded-lg gradient-brand-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            Começar Grátis
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-accent-violet-subtle)] text-[var(--color-accent-violet)] text-sm font-medium mb-8">
                        <Zap className="w-4 h-4" />
                        Plataforma de Análise Profissional
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                        Controla as tuas{' '}
                        <span className="gradient-brand">apostas</span>{' '}
                        como um profissional
                    </h1>

                    <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
                        Analisa depósitos, levantamentos, ROI e tendências. Insights automáticos,
                        gráficos interativos e relatórios que te ajudam a tomar melhores decisões.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/auth/register"
                            className="group flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-brand-bg text-white font-semibold text-base hover:opacity-90 transition-all hover:shadow-[var(--shadow-glow-violet)]"
                        >
                            Criar Conta Grátis
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <Link
                            href="/auth/login"
                            className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold text-base hover:bg-[var(--color-bg-card)] transition-colors"
                        >
                            Já tenho conta
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Tudo o que precisas, num só lugar
                        </h2>
                        <p className="text-[var(--color-text-secondary)] text-lg max-w-xl mx-auto">
                            Ferramentas profissionais para analisar e otimizar o teu desempenho.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<TrendingUp className="w-6 h-6" />}
                            title="Dashboard Completo"
                            description="9 KPIs essenciais: resultado líquido, ROI, win rate, tendências e muito mais."
                            color="violet"
                        />
                        <FeatureCard
                            icon={<BarChart3 className="w-6 h-6" />}
                            title="5 Tipos de Gráficos"
                            description="Balanço cumulativo, resultados mensais, distribuição, histograma e variação MoM."
                            color="emerald"
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Insights Automáticos"
                            description="Análise inteligente que identifica padrões, performance e gera recomendações."
                            color="amber"
                        />
                        <FeatureCard
                            icon={<Upload className="w-6 h-6" />}
                            title="Upload Simples"
                            description="Importa o teu CSV e vê os dados instantaneamente. Suporte para múltiplos formatos."
                            color="sky"
                        />
                        <FeatureCard
                            icon={<ChartPie className="w-6 h-6" />}
                            title="Múltiplos Perfis"
                            description="Gere várias contas, compara perfis lado a lado e vê dados combinados."
                            color="rose"
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6" />}
                            title="Seguro e Privado"
                            description="Dados encriptados, autenticação segura e controlo total sobre a tua informação."
                            color="violet"
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="p-12 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-[var(--shadow-elevated)]">
                        <Smartphone className="w-12 h-12 mx-auto mb-6 text-[var(--color-accent-violet)]" />
                        <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
                        <p className="text-[var(--color-text-secondary)] mb-8 text-lg">
                            Cria a tua conta gratuita e começa a analisar as tuas apostas em segundos.
                        </p>
                        <Link
                            href="/auth/register"
                            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl gradient-brand-bg text-white font-semibold text-lg hover:opacity-90 transition-all hover:shadow-[var(--shadow-glow-violet)]"
                        >
                            Começar Agora
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-sm">
                        <BarChart3 className="w-4 h-4" />
                        <span>BetTracker © {new Date().getFullYear()}</span>
                    </div>
                    <p className="text-[var(--color-text-tertiary)] text-sm">
                        Feito com dedicação 🇵🇹
                    </p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
    color,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: 'violet' | 'emerald' | 'amber' | 'sky' | 'rose';
}) {
    const colorClasses = {
        violet: 'bg-[var(--color-accent-violet-subtle)] text-[var(--color-accent-violet)]',
        emerald: 'bg-[var(--color-accent-emerald-subtle)] text-[var(--color-accent-emerald)]',
        amber: 'bg-[var(--color-accent-amber-subtle)] text-[var(--color-accent-amber)]',
        sky: 'bg-[var(--color-accent-sky-subtle)] text-[var(--color-accent-sky)]',
        rose: 'bg-[var(--color-accent-rose-subtle)] text-[var(--color-accent-rose)]',
    };

    return (
        <div className="group p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
            <div
                className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4`}
            >
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{description}</p>
        </div>
    );
}
