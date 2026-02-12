import { Upload, Download, Moon, Sun, Shield } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6 page-enter">
            <div>
                <h1 className="heading-1">Definições</h1>
                <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Preferências, exportações e upload</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-4">
                {/* Upload Section */}
                <div className="card-static">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--accent-subtle)',
                                color: 'var(--accent)',
                            }}
                        >
                            <Upload className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="heading-4">Importar Dados</h3>
                            <p className="body-sm" style={{ color: 'var(--text-muted)' }}>
                                Importa transações via ficheiro CSV
                            </p>
                        </div>
                    </div>
                    <div
                        className="flex items-center justify-center"
                        style={{
                            padding: 'var(--space-xl)',
                            border: '1px dashed var(--border-strong)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-muted)',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s ease',
                        }}
                    >
                        <div className="text-center">
                            <Upload className="w-5 h-5 mx-auto mb-2" style={{ opacity: 0.5 }} />
                            <p>Arrasta o ficheiro CSV ou clica para selecionar</p>
                        </div>
                    </div>
                </div>

                {/* Export Section */}
                <div className="card-static">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-elevated)',
                                color: 'var(--text-muted)',
                            }}
                        >
                            <Download className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="heading-4">Exportar Dados</h3>
                            <p className="body-sm" style={{ color: 'var(--text-muted)' }}>
                                Exporta os teus dados em formato CSV
                            </p>
                        </div>
                    </div>
                    <button className="btn btn-outlined">
                        <Download className="w-4 h-4" />
                        Exportar CSV
                    </button>
                </div>

                {/* Appearance Section */}
                <div className="card-static">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-elevated)',
                                color: 'var(--text-muted)',
                            }}
                        >
                            <Moon className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="heading-4">Aparência</h3>
                            <p className="body-sm" style={{ color: 'var(--text-muted)' }}>
                                Tema visual da aplicação
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn btn-sm btn-ghost" style={{ color: 'var(--accent)' }}>
                            <Moon className="w-3.5 h-3.5" />
                            Escuro
                        </button>
                        <button className="btn btn-sm btn-ghost">
                            <Sun className="w-3.5 h-3.5" />
                            Claro
                        </button>
                    </div>
                </div>

                {/* Account Section */}
                <div className="card-static">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-elevated)',
                                color: 'var(--text-muted)',
                            }}
                        >
                            <Shield className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="heading-4">Conta</h3>
                            <p className="body-sm" style={{ color: 'var(--text-muted)' }}>
                                Gestão da tua conta e dados
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn btn-sm btn-ghost">
                            Alterar Password
                        </button>
                        <button
                            className="btn btn-sm btn-ghost"
                            style={{ color: 'var(--negative)' }}
                        >
                            Eliminar Conta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
