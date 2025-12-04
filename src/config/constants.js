const getEnvVar = (key, defaultValue) => {
    const value = import.meta.env[key];
    return value || defaultValue;
};

export const CONFIG = Object.freeze({
    WHATSAPP: Object.freeze({
        NUMBER: getEnvVar('VITE_WHATSAPP_NUMBER', '5511999999999'),
        MESSAGE_TEMPLATES: Object.freeze({
            QUOTE_TECHNICAL: 'Olá! Gostaria de um orçamento para assistência técnica',
            QUOTE_PURCHASE: 'Olá! Gostaria de um orçamento para compra de celular',
            QUOTE_OTHER: 'Olá! Gostaria de um orçamento',
            PRODUCT_INTEREST: (productName) => 
                `Olá! Tenho interesse no ${productName}`,
        }),
    }),
    
    INSTAGRAM: Object.freeze({
        URL: 'https://www.instagram.com/cf_assistenciatecnica_/',
    }),
    
    SUPABASE: Object.freeze({
        TABLES: Object.freeze({
            PRODUCTS: 'celulares_venda',
        }),
        STORAGE: Object.freeze({
            BUCKETS: Object.freeze({
                PHONES: 'phones',
            }),
        }),
    }),
    
    PAGINATION: Object.freeze({
        DEFAULT_LIMIT: 20,
        MAX_LIMIT: 100,
    }),
    
    IMAGES: Object.freeze({
        MAX_SIZE: 2 * 1024 * 1024,
        ALLOWED_TYPES: Object.freeze(['image/jpeg', 'image/png', 'image/webp']),
    }),
});
