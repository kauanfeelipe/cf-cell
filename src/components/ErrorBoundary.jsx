import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Error Boundary para capturar erros em nível de aplicação
 * Seguindo as melhores práticas do React
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Atualiza o state para exibir a UI de erro
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log do erro para monitoramento
        console.error('ErrorBoundary capturou um erro:', error, errorInfo);
        
        this.setState({
            error,
            errorInfo,
        });

        // Em produção, enviar para serviço de monitoramento
        // if (import.meta.env.PROD) {
        //     Sentry.captureException(error, {
        //         contexts: {
        //             react: {
        //                 componentStack: errorInfo.componentStack,
        //             },
        //         },
        //     });
        // }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-dark flex items-center justify-center p-4">
                    <div className="bg-dark-surface border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
                        <AlertTriangle className="mx-auto text-red-400 mb-4" size={48} />
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Algo deu errado
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Ocorreu um erro inesperado. Por favor, recarregue a página.
                        </p>
                        {import.meta.env.DEV && this.state.error && (
                            <details className="text-left mb-6 p-4 bg-dark rounded-lg overflow-auto max-h-48">
                                <summary className="text-red-400 cursor-pointer mb-2">
                                    Detalhes do erro (apenas em desenvolvimento)
                                </summary>
                                <pre className="text-xs text-gray-400">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-4 py-2 bg-primary hover:bg-primary-light text-dark font-medium rounded-lg transition-colors"
                            >
                                Tentar Novamente
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                            >
                                Recarregar Página
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

