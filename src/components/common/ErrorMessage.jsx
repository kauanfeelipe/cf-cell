import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Componente reutilizável de mensagem de erro
 * @param {Object} props
 * @param {string|Object} props.error - Mensagem de erro ou objeto de erro
 * @param {string} props.title - Título opcional do erro
 * @param {Function} props.onRetry - Função opcional para tentar novamente
 * @param {string} props.className - Classes CSS adicionais
 */
const ErrorMessage = ({ error, title = 'Erro ao carregar', onRetry = null, className = '' }) => {
    const errorMessage = typeof error === 'string' ? error : error?.message || 'Ocorreu um erro inesperado';

    return (
        <div className={`bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center ${className}`}>
            <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
            <p className="text-red-400 text-lg mb-2 font-medium">{title}</p>
            <p className="text-gray-400 text-sm mb-4">{errorMessage}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors font-medium"
                >
                    Tentar Novamente
                </button>
            )}
        </div>
    );
};

export default React.memo(ErrorMessage);

