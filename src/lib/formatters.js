const DEFAULT_CURRENCY = 'BRL';
const DEFAULT_LOCALE = 'pt-BR';

const currencyFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'currency',
    currency: DEFAULT_CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') {
        return currencyFormatter.format(0);
    }
    
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
        return currencyFormatter.format(0);
    }
    
    return currencyFormatter.format(numValue);
};

export const formatWhatsAppUrl = (number, message = '') => {
    if (!number || typeof number !== 'string') {
        return '#';
    }
    
    const sanitizedNumber = number.replace(/\D/g, '');
    
    if (sanitizedNumber.length < 10) {
        return '#';
    }
    
    const sanitizedMessage = typeof message === 'string' ? message.slice(0, 1000) : '';
    const encodedMessage = encodeURIComponent(sanitizedMessage);
    
    return `https://wa.me/${sanitizedNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};

const DEFAULT_IMAGE = '/imagens/phone-1.jpg';

export const formatProductForDisplay = (product) => {
    if (!product || typeof product !== 'object') {
        return null;
    }

    const specs = [
        product.marca,
        product.armazenamento,
        product.memoria_ram,
        product.camera,
        product.bateria,
        product.cor,
        product.condicao,
    ].filter(Boolean);

    return {
        ...product,
        image: product.imagem_url || DEFAULT_IMAGE,
        title: product.nome || 'Produto sem nome',
        price: formatCurrency(product.valor),
        specs,
        badge: product.situacao && product.situacao !== 'Normal' ? product.situacao : null,
    };
};
