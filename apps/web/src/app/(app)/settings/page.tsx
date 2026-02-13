import { Download, Moon, Sun, Shield } from 'lucide-react';
import UploadForm from '@/components/upload-form';

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
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        </div>
                        <div>
                            <h3 className="heading-4">Importar Dados</h3>
                            <p className="body-sm" style={{ color: 'var(--text-muted)' }}>
                                Importa transações via ficheiro CSV
                            </p>
                        </div>
                    </div>
                    <UploadForm />
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
