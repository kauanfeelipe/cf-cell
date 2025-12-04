import { describe, it, expect } from 'vitest';
import { formatCurrency, formatWhatsAppUrl, formatProductForDisplay } from '../../lib/formatters';

describe('formatters', () => {
    describe('formatCurrency', () => {
        it('deve formatar valor numérico corretamente', () => {
            const result = formatCurrency(1500);
            expect(result).toContain('1.500');
            expect(result).toContain('R$');
        });

        it('deve formatar valor com centavos', () => {
            const result = formatCurrency(1500.50);
            expect(result).toContain('1.500,50');
        });

        it('deve formatar valor zero', () => {
            const result = formatCurrency(0);
            expect(result).toContain('0,00');
        });

        it('deve retornar valor formatado para null', () => {
            const result = formatCurrency(null);
            expect(result).toContain('0,00');
        });

        it('deve retornar valor formatado para undefined', () => {
            const result = formatCurrency(undefined);
            expect(result).toContain('0,00');
        });

        it('deve retornar valor formatado para string vazia', () => {
            const result = formatCurrency('');
            expect(result).toContain('0,00');
        });

        it('deve converter string numérica para moeda', () => {
            const result = formatCurrency('2500.99');
            expect(result).toContain('2.500,99');
        });

        it('deve retornar valor formatado para NaN', () => {
            const result = formatCurrency('not-a-number');
            expect(result).toContain('0,00');
        });

        it('deve formatar valores grandes corretamente', () => {
            const result = formatCurrency(999999.99);
            expect(result).toContain('999.999,99');
        });

        it('deve arredondar para duas casas decimais', () => {
            const result = formatCurrency(100.999);
            expect(result).toContain('101,00');
        });
    });

    describe('formatWhatsAppUrl', () => {
        it('deve gerar URL correta com número e mensagem', () => {
            const result = formatWhatsAppUrl('5511999999999', 'Olá!');
            expect(result).toBe('https://wa.me/5511999999999?text=Ol%C3%A1!');
        });

        it('deve gerar URL sem mensagem quando não fornecida', () => {
            const result = formatWhatsAppUrl('5511999999999');
            expect(result).toBe('https://wa.me/5511999999999');
        });

        it('deve remover caracteres não numéricos do número', () => {
            const result = formatWhatsAppUrl('+55 (11) 99999-9999', 'Test');
            expect(result).toBe('https://wa.me/5511999999999?text=Test');
        });

        it('deve retornar # para número nulo', () => {
            const result = formatWhatsAppUrl(null, 'Test');
            expect(result).toBe('#');
        });

        it('deve retornar # para número vazio', () => {
            const result = formatWhatsAppUrl('', 'Test');
            expect(result).toBe('#');
        });

        it('deve retornar # para número muito curto', () => {
            const result = formatWhatsAppUrl('123', 'Test');
            expect(result).toBe('#');
        });

        it('deve codificar caracteres especiais na mensagem', () => {
            const result = formatWhatsAppUrl('5511999999999', 'Olá! Como vai?');
            expect(result).toContain('Ol%C3%A1!%20Como%20vai%3F');
        });

        it('deve truncar mensagens muito longas', () => {
            const longMessage = 'A'.repeat(1500);
            const result = formatWhatsAppUrl('5511999999999', longMessage);
            
            const messageParam = decodeURIComponent(result.split('text=')[1]);
            expect(messageParam.length).toBeLessThanOrEqual(1000);
        });

        it('deve aceitar número com 10 dígitos (mínimo)', () => {
            const result = formatWhatsAppUrl('1199999999', 'Test');
            expect(result).toBe('https://wa.me/1199999999?text=Test');
        });
    });

    describe('formatProductForDisplay', () => {
        it('deve formatar produto completo corretamente', () => {
            const product = {
                id: '1',
                nome: 'iPhone 14',
                valor: 5000,
                imagem_url: 'https://test.com/image.jpg',
                marca: 'Apple',
                armazenamento: '128GB',
                memoria_ram: '6GB',
                camera: '12MP',
                bateria: '3279mAh',
                cor: 'Preto',
                condicao: 'Novo',
                situacao: 'Oferta',
            };

            const result = formatProductForDisplay(product);

            expect(result.title).toBe('iPhone 14');
            expect(result.price).toContain('5.000,00');
            expect(result.image).toBe('https://test.com/image.jpg');
            expect(result.badge).toBe('Oferta');
            expect(result.specs).toContain('Apple');
            expect(result.specs).toContain('128GB');
            expect(result.specs).toContain('6GB');
            expect(result.specs).toHaveLength(7);
        });

        it('deve usar imagem padrão quando não fornecida', () => {
            const product = { nome: 'Test', valor: 100 };

            const result = formatProductForDisplay(product);

            expect(result.image).toBe('/imagens/phone-1.jpg');
        });

        it('deve retornar null para badge quando situação é Normal', () => {
            const product = { nome: 'Test', valor: 100, situacao: 'Normal' };

            const result = formatProductForDisplay(product);

            expect(result.badge).toBeNull();
        });

        it('deve filtrar specs nulas', () => {
            const product = {
                nome: 'Test',
                valor: 100,
                marca: 'Samsung',
                armazenamento: null,
                memoria_ram: undefined,
            };

            const result = formatProductForDisplay(product);

            expect(result.specs).toContain('Samsung');
            expect(result.specs).not.toContain(null);
            expect(result.specs).not.toContain(undefined);
        });

        it('deve retornar null para produto nulo', () => {
            const result = formatProductForDisplay(null);
            expect(result).toBeNull();
        });

        it('deve retornar null para produto undefined', () => {
            const result = formatProductForDisplay(undefined);
            expect(result).toBeNull();
        });

        it('deve retornar null para não-objeto', () => {
            const result = formatProductForDisplay('string');
            expect(result).toBeNull();
        });

        it('deve manter propriedades originais do produto', () => {
            const product = { id: '123', nome: 'Test', valor: 100, customField: 'value' };

            const result = formatProductForDisplay(product);

            expect(result.id).toBe('123');
            expect(result.customField).toBe('value');
        });

        it('deve definir título padrão para produto sem nome', () => {
            const product = { valor: 100 };

            const result = formatProductForDisplay(product);

            expect(result.title).toBe('Produto sem nome');
        });
    });
});
