import { useCallback } from 'react';
import { CONFIG } from '../config/constants';
import { formatWhatsAppUrl } from '../lib/formatters';

/**
 * Hook customizado para interação com WhatsApp
 * Centraliza a lógica de abertura de chat
 */
export const useWhatsApp = () => {
    const openChat = useCallback((message = '') => {
        const url = formatWhatsAppUrl(CONFIG.WHATSAPP.NUMBER, message);
        window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    const openDefaultChat = useCallback(() => {
        openChat(CONFIG.WHATSAPP.MESSAGE_TEMPLATES.QUOTE_OTHER);
    }, [openChat]);

    return {
        openChat,
        openDefaultChat,
        whatsappNumber: CONFIG.WHATSAPP.NUMBER,
        whatsappUrl: formatWhatsAppUrl(CONFIG.WHATSAPP.NUMBER, ''),
    };
};

