export default function TransactionsPage() {
    return (
        <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-text-primary)]">Transações</h1>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">Todas as tuas transações num só lugar</p>
            </div>
            <div className="p-12 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] text-center">
                <p className="text-[var(--color-text-secondary)]">Tabela de transações — em desenvolvimento</p>
            </div>
        </div>
    );
}
