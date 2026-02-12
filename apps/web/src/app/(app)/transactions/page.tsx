import Link from 'next/link';
import { Receipt, Upload } from 'lucide-react';

export default function TransactionsPage() {
    return (
        <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="heading-1">Transações</h1>
                    <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Todas as tuas transações num só lugar</p>
                </div>
            </div>

            {/* Table Header */}
            <div className="card-static" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-header">
                    <span style={{ flex: 2 }}>Data</span>
                    <span style={{ flex: 3 }}>Descrição</span>
                    <span style={{ flex: 1, textAlign: 'right' }}>Montante</span>
                    <span style={{ flex: 1, textAlign: 'right' }}>Tipo</span>
                </div>

                {/* Empty State inside table */}
                <div className="empty-state" style={{ border: 'none', borderRadius: 0 }}>
                    <div className="empty-state-icon">
                        <Receipt className="w-6 h-6" />
                    </div>
                    <p className="empty-state-title">Nenhuma transação</p>
                    <p className="empty-state-description">
                        As tuas transações aparecerão aqui depois de importares o teu ficheiro CSV.
                    </p>
                    <div className="empty-state-action">
                        <Link href="/settings" className="btn btn-accent">
                            <Upload className="w-4 h-4" />
                            Importar CSV
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
