import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productService } from '../../api/services/productService';
import { supabase } from '../../lib/supabaseClient';

vi.mock('../../lib/supabaseClient');

describe('productService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAll', () => {
        it('deve retornar lista de produtos com paginação padrão', async () => {
            const mockProducts = [
                { id: '1', nome: 'iPhone 13', valor: 3500 },
                { id: '2', nome: 'Samsung S21', valor: 2800 },
            ];

            supabase.from.mockReturnValue({
                select: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                range: vi.fn().mockResolvedValue({
                    data: mockProducts,
                    count: 2,
                    error: null,
                }),
            });

            const result = await productService.getAll();

            expect(result.products).toHaveLength(2);
            expect(result.total).toBe(2);
            expect(result.products[0].nome).toBe('iPhone 13');
        });

        it('deve aplicar limite máximo de 100 mesmo se solicitado mais', async () => {
            supabase.from.mockReturnValue({
                select: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                range: vi.fn().mockResolvedValue({
                    data: [],
                    count: 0,
                    error: null,
                }),
            });

            await productService.getAll({ limit: 500 });

            const rangeCall = supabase.from().select().order().range;
            expect(rangeCall).toHaveBeenCalledWith(0, 99);
        });

        it('deve usar orderBy permitido', async () => {
            const orderMock = vi.fn().mockReturnThis();
            
            supabase.from.mockReturnValue({
                select: vi.fn().mockReturnThis(),
                order: orderMock,
                range: vi.fn().mockResolvedValue({
                    data: [],
                    count: 0,
                    error: null,
                }),
            });

            await productService.getAll({ orderBy: 'nome' });

            expect(orderMock).toHaveBeenCalledWith('nome', { ascending: false });
        });

        it('deve ignorar orderBy não permitido e usar created_at', async () => {
            const orderMock = vi.fn().mockReturnThis();
            
            supabase.from.mockReturnValue({
                select: vi.fn().mockReturnThis(),
                order: orderMock,
                range: vi.fn().mockResolvedValue({
                    data: [],
                    count: 0,
                    error: null,
                }),
            });

            await productService.getAll({ orderBy: 'malicious_field' });

            expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: false });
        });

        it('deve lançar erro quando Supabase retorna erro', async () => {
            supabase.from.mockReturnValue({
                select: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                range: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Database error', code: '500' },
                }),
            });

            await expect(productService.getAll()).rejects.toThrow();
        });
    });

    describe('getById', () => {
        it('deve retornar produto por ID válido', async () => {
            const mockProduct = { id: '550e8400-e29b-41d4-a716-446655440000', nome: 'iPhone 14' };

            supabase.from.mockReturnValue({
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: mockProduct,
                    error: null,
                }),
            });

            const result = await productService.getById('550e8400-e29b-41d4-a716-446655440000');

            expect(result.nome).toBe('iPhone 14');
        });

        it('deve lançar erro para UUID inválido', async () => {
            await expect(productService.getById('invalid-id')).rejects.toThrow('ID inválido');
        });

        it('deve lançar erro para ID nulo', async () => {
            await expect(productService.getById(null)).rejects.toThrow('ID inválido');
        });

        it('deve lançar erro para ID vazio', async () => {
            await expect(productService.getById('')).rejects.toThrow('ID inválido');
        });
    });

    describe('create', () => {
        it('deve criar produto com dados válidos', async () => {
            const productData = {
                nome: 'iPhone 15',
                valor: 5000,
                marca: 'Apple',
            };

            const mockCreatedProduct = { id: '550e8400-e29b-41d4-a716-446655440001', ...productData };

            supabase.from.mockReturnValue({
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: mockCreatedProduct,
                    error: null,
                }),
            });

            const result = await productService.create(productData);

            expect(result.nome).toBe('iPhone 15');
            expect(result.id).toBeDefined();
        });

        it('deve lançar erro para nome muito curto', async () => {
            await expect(productService.create({ nome: 'A', valor: 100 }))
                .rejects.toThrow('Nome do produto é obrigatório');
        });

        it('deve lançar erro para valor ausente', async () => {
            await expect(productService.create({ nome: 'iPhone 15' }))
                .rejects.toThrow('Valor do produto é obrigatório');
        });

        it('deve lançar erro para valor negativo', async () => {
            await expect(productService.create({ nome: 'iPhone 15', valor: -100 }))
                .rejects.toThrow('Valor do produto deve ser um número válido');
        });

        it('deve lançar erro para valor muito alto', async () => {
            await expect(productService.create({ nome: 'iPhone 15', valor: 9999999 }))
                .rejects.toThrow('Valor do produto deve ser um número válido');
        });

        it('deve sanitizar strings longas', async () => {
            const longName = 'A'.repeat(300);
            
            supabase.from.mockReturnValue({
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: { id: '1', nome: longName.slice(0, 200) },
                    error: null,
                }),
            });

            const insertMock = supabase.from().insert;
            
            await productService.create({ nome: longName, valor: 100 });

            const insertedData = insertMock.mock.calls[0][0][0];
            expect(insertedData.nome.length).toBeLessThanOrEqual(200);
        });

        it('deve normalizar condição inválida para "Novo"', async () => {
            supabase.from.mockReturnValue({
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: { id: '1', nome: 'Test', condicao: 'Novo' },
                    error: null,
                }),
            });

            const insertMock = supabase.from().insert;
            
            await productService.create({ 
                nome: 'Test Phone', 
                valor: 100, 
                condicao: 'InvalidCondition' 
            });

            const insertedData = insertMock.mock.calls[0][0][0];
            expect(insertedData.condicao).toBe('Novo');
        });
    });

    describe('update', () => {
        const validId = '550e8400-e29b-41d4-a716-446655440000';

        it('deve atualizar produto existente', async () => {
            const updateData = { nome: 'iPhone 15 Pro' };

            supabase.from.mockReturnValue({
                update: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: { id: validId, ...updateData },
                    error: null,
                }),
            });

            const result = await productService.update(validId, updateData);

            expect(result.nome).toBe('iPhone 15 Pro');
        });

        it('deve lançar erro para UUID inválido', async () => {
            await expect(productService.update('invalid', { nome: 'Test' }))
                .rejects.toThrow('ID inválido');
        });
    });

    describe('delete', () => {
        const validId = '550e8400-e29b-41d4-a716-446655440000';

        it('deve deletar produto existente', async () => {
            supabase.from.mockReturnValue({
                delete: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ error: null }),
            });

            const result = await productService.delete(validId);

            expect(result).toBe(true);
        });

        it('deve lançar erro para UUID inválido', async () => {
            await expect(productService.delete('invalid'))
                .rejects.toThrow('ID inválido');
        });
    });

    describe('getHeroProducts', () => {
        it('deve retornar produtos para hero com limite', async () => {
            const mockProducts = [
                { imagem_url: 'https://test.com/1.jpg', nome: 'Phone 1' },
                { imagem_url: 'https://test.com/2.jpg', nome: 'Phone 2' },
            ];

            supabase.from.mockReturnValue({
                select: vi.fn().mockReturnThis(),
                not: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                limit: vi.fn().mockResolvedValue({
                    data: mockProducts,
                    error: null,
                }),
            });

            const result = await productService.getHeroProducts(5);

            expect(result).toHaveLength(2);
            expect(result[0].imagem_url).toBeDefined();
        });

        it('deve limitar máximo a 10 produtos', async () => {
            const limitMock = vi.fn().mockResolvedValue({ data: [], error: null });

            supabase.from.mockReturnValue({
                select: vi.fn().mockReturnThis(),
                not: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                limit: limitMock,
            });

            await productService.getHeroProducts(100);

            expect(limitMock).toHaveBeenCalledWith(10);
        });

        it('deve retornar array vazio em caso de erro', async () => {
            supabase.from.mockReturnValue({
                select: vi.fn().mockReturnThis(),
                not: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                limit: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Error' },
                }),
            });

            await expect(productService.getHeroProducts()).rejects.toThrow();
        });
    });
});

