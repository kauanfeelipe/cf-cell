import React from 'react';
import { Package } from 'lucide-react';

/**
 * Componente reutilizável de estado vazio
 * @param {Object} props
 * @param {string} props.message - Mensagem principal
 * @param {string} props.description - Descrição opcional
 * @param {React.ReactNode} props.icon - Ícone customizado opcional
 * @param {React.ReactNode} props.action - Ação opcional (botão, etc)
 */
const EmptyState = ({ message, description = null, icon = null, action = null }) => {
    return (
        <div className="text-center py-12">
            <div className="flex justify-center mb-4">
                {icon || <Package className="text-gray-600" size={48} />}
            </div>
            <p className="text-gray-400 text-lg mb-2">{message}</p>
            {description && (
                <p className="text-gray-600 text-sm mt-2">{description}</p>
            )}
            {action && (
                <div className="mt-6">
                    {action}
                </div>
            )}
        </div>
    );
};

export default React.memo(EmptyState);

