import React from 'react';
import { Loader } from 'lucide-react';

/**
 * Componente reutilizável de loading spinner
 * @param {Object} props
 * @param {string} props.size - Tamanho do spinner ('sm' | 'md' | 'lg')
 * @param {string} props.className - Classes CSS adicionais
 * @param {string} props.text - Texto opcional abaixo do spinner
 */
const LoadingSpinner = ({ size = 'md', className = '', text = null }) => {
    const sizeMap = {
        sm: 24,
        md: 48,
        lg: 64,
    };

    const spinnerSize = sizeMap[size] || sizeMap.md;

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <Loader className="animate-spin text-primary" size={spinnerSize} />
            {text && (
                <p className="mt-4 text-gray-400 text-sm">{text}</p>
            )}
        </div>
    );
};

export default React.memo(LoadingSpinner);

