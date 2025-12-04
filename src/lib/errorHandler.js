const ERROR_MESSAGES = {
    'PGRST116': 'Nenhum resultado encontrado',
    '23505': 'Este item já existe',
    '23503': 'Não é possível excluir este item',
    '42501': 'Você não tem permissão para esta ação',
    '42P01': 'Recurso não encontrado',
    '22P02': 'Dados inválidos fornecidos',
    'NETWORK_ERROR': 'Erro de conexão. Verifique sua internet.',
    'TIMEOUT': 'A operação demorou muito. Tente novamente.',
    'DEFAULT': 'Ocorreu um erro. Tente novamente mais tarde.',
};

const sanitizeErrorMessage = (message) => {
    if (!message || typeof message !== 'string') {
        return ERROR_MESSAGES.DEFAULT;
    }
    
    const sensitivePatterns = [
        /password/gi,
        /token/gi,
        /secret/gi,
        /key/gi,
        /credential/gi,
        /authorization/gi,
        /api[-_]?key/gi,
    ];
    
    let sanitized = message;
    sensitivePatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '[REDACTED]');
    });
    
    return sanitized.slice(0, 200);
};

export const getUserFriendlyMessage = (error) => {
    if (!error) {
        return ERROR_MESSAGES.DEFAULT;
    }
    
    if (error?.code && ERROR_MESSAGES[error.code]) {
        return ERROR_MESSAGES[error.code];
    }
    
    if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    if (error?.name === 'AbortError') {
        return ERROR_MESSAGES.TIMEOUT;
    }
    
    if (error?.message) {
        return sanitizeErrorMessage(error.message);
    }
    
    return ERROR_MESSAGES.DEFAULT;
};

export const handleSupabaseError = (error, context) => {
    const errorInfo = {
        message: getUserFriendlyMessage(error),
        code: error?.code || 'UNKNOWN',
        context,
        timestamp: new Date().toISOString(),
    };

    if (import.meta.env.DEV) {
        console.error(`[${context}]`, {
            ...errorInfo,
            details: error?.details,
            hint: error?.hint,
            stack: error?.stack,
        });
    }

    return errorInfo;
};

export const isNetworkError = (error) => {
    return (
        error?.name === 'TypeError' ||
        error?.message?.includes('fetch') ||
        error?.message?.includes('network') ||
        error?.code === 'NETWORK_ERROR'
    );
};

export const isAuthError = (error) => {
    return (
        error?.code === '42501' ||
        error?.status === 401 ||
        error?.status === 403 ||
        error?.message?.toLowerCase().includes('unauthorized')
    );
};

