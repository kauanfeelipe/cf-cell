import { describe, it, expect, vi, beforeEach } from 'vitest';
import { imageService } from '../../api/services/imageService';
import { supabase } from '../../lib/supabaseClient';

vi.mock('../../lib/supabaseClient');

describe('imageService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('validateFile', () => {
        it('deve lançar erro quando arquivo não é fornecido', () => {
            expect(() => imageService.validateFile(null))
                .toThrow('Nenhum arquivo fornecido');
        });

        it('deve lançar erro quando arquivo não é instância de File/Blob', () => {
            expect(() => imageService.validateFile({ name: 'test.jpg' }))
                .toThrow('Arquivo inválido');
        });

        it('deve lançar erro para tipo de arquivo não permitido', () => {
            const file = new File(['content'], 'test.gif', { type: 'image/gif' });
            
            expect(() => imageService.validateFile(file))
                .toThrow('Tipo de arquivo não permitido');
        });

        it('deve lançar erro para arquivo muito grande', () => {
            const largeContent = new Array(3 * 1024 * 1024).fill('a').join('');
            const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
            
            expect(() => imageService.validateFile(file))
                .toThrow('Arquivo muito grande');
        });

        it('deve lançar erro para arquivo vazio', () => {
            const file = new File([], 'empty.jpg', { type: 'image/jpeg' });
            
            expect(() => imageService.validateFile(file))
                .toThrow('Arquivo vazio');
        });

        it('deve aceitar arquivo JPEG válido', () => {
            const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
            
            expect(imageService.validateFile(file)).toBe(true);
        });

        it('deve aceitar arquivo PNG válido', () => {
            const file = new File(['content'], 'test.png', { type: 'image/png' });
            
            expect(imageService.validateFile(file)).toBe(true);
        });

        it('deve aceitar arquivo WebP válido', () => {
            const file = new File(['content'], 'test.webp', { type: 'image/webp' });
            
            expect(imageService.validateFile(file)).toBe(true);
        });

        it('deve aceitar arquivo com tamanho máximo permitido', () => {
            const content = new Array(2 * 1024 * 1024 - 1).fill('a').join('');
            const file = new File([content], 'max.jpg', { type: 'image/jpeg' });
            
            expect(imageService.validateFile(file)).toBe(true);
        });
    });

    describe('upload', () => {
        it('deve fazer upload de arquivo válido e retornar URL pública', async () => {
            const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
            const mockPublicUrl = 'https://storage.supabase.co/phones/12345.jpg';

            supabase.storage.from.mockReturnValue({
                upload: vi.fn().mockResolvedValue({ error: null }),
                getPublicUrl: vi.fn().mockReturnValue({
                    data: { publicUrl: mockPublicUrl },
                }),
            });

            const result = await imageService.upload(file);

            expect(result).toBe(mockPublicUrl);
        });

        it('deve gerar nome de arquivo único', async () => {
            const file = new File(['content'], 'Test File Name.jpg', { type: 'image/jpeg' });
            const uploadMock = vi.fn().mockResolvedValue({ error: null });

            supabase.storage.from.mockReturnValue({
                upload: uploadMock,
                getPublicUrl: vi.fn().mockReturnValue({
                    data: { publicUrl: 'https://test.com/image.jpg' },
                }),
            });

            await imageService.upload(file);

            const uploadedFileName = uploadMock.mock.calls[0][0];
            expect(uploadedFileName).toMatch(/^\d+-[a-z0-9]+-test-file-name\.jpg$/);
        });

        it('deve lançar erro quando upload falha', async () => {
            const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

            supabase.storage.from.mockReturnValue({
                upload: vi.fn().mockResolvedValue({
                    error: { message: 'Upload failed', error: 'UPLOAD_ERROR' },
                }),
            });

            await expect(imageService.upload(file))
                .rejects.toThrow('Upload failed');
        });

        it('deve lançar erro quando não consegue obter URL pública', async () => {
            const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

            supabase.storage.from.mockReturnValue({
                upload: vi.fn().mockResolvedValue({ error: null }),
                getPublicUrl: vi.fn().mockReturnValue({
                    data: { publicUrl: null },
                }),
            });

            await expect(imageService.upload(file))
                .rejects.toThrow('Não foi possível obter URL da imagem');
        });

        it('deve validar arquivo antes de fazer upload', async () => {
            const invalidFile = new File([], 'empty.jpg', { type: 'image/jpeg' });

            await expect(imageService.upload(invalidFile))
                .rejects.toThrow('Arquivo vazio');
        });

        it('deve usar bucket padrão quando não especificado', async () => {
            const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

            supabase.storage.from.mockReturnValue({
                upload: vi.fn().mockResolvedValue({ error: null }),
                getPublicUrl: vi.fn().mockReturnValue({
                    data: { publicUrl: 'https://test.com/image.jpg' },
                }),
            });

            await imageService.upload(file);

            expect(supabase.storage.from).toHaveBeenCalledWith('phones');
        });

        it('deve usar bucket customizado quando especificado', async () => {
            const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

            supabase.storage.from.mockReturnValue({
                upload: vi.fn().mockResolvedValue({ error: null }),
                getPublicUrl: vi.fn().mockReturnValue({
                    data: { publicUrl: 'https://test.com/image.jpg' },
                }),
            });

            await imageService.upload(file, 'custom-bucket');

            expect(supabase.storage.from).toHaveBeenCalledWith('custom-bucket');
        });

        it('deve configurar cache control corretamente', async () => {
            const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
            const uploadMock = vi.fn().mockResolvedValue({ error: null });

            supabase.storage.from.mockReturnValue({
                upload: uploadMock,
                getPublicUrl: vi.fn().mockReturnValue({
                    data: { publicUrl: 'https://test.com/image.jpg' },
                }),
            });

            await imageService.upload(file);

            const uploadOptions = uploadMock.mock.calls[0][2];
            expect(uploadOptions.cacheControl).toBe('31536000');
            expect(uploadOptions.upsert).toBe(false);
            expect(uploadOptions.contentType).toBe('image/jpeg');
        });
    });

    describe('delete', () => {
        it('deve deletar imagem existente', async () => {
            const removeMock = vi.fn().mockResolvedValue({ error: null });

            supabase.storage.from.mockReturnValue({
                remove: removeMock,
            });

            const result = await imageService.delete('https://storage.supabase.co/phones/test.jpg');

            expect(result).toBe(true);
            expect(removeMock).toHaveBeenCalledWith(['test.jpg']);
        });

        it('deve retornar false para URL nula', async () => {
            const result = await imageService.delete(null);

            expect(result).toBe(false);
        });

        it('deve retornar false para URL vazia', async () => {
            const result = await imageService.delete('');

            expect(result).toBe(false);
        });

        it('deve retornar false para URL inválida (não string)', async () => {
            const result = await imageService.delete(123);

            expect(result).toBe(false);
        });

        it('deve lançar erro quando delete falha no Supabase', async () => {
            supabase.storage.from.mockReturnValue({
                remove: vi.fn().mockResolvedValue({
                    error: { message: 'Delete failed', error: 'DELETE_ERROR' },
                }),
            });

            await expect(imageService.delete('https://storage.supabase.co/phones/test.jpg'))
                .rejects.toThrow('Delete failed');
        });

        it('deve usar bucket padrão quando não especificado', async () => {
            supabase.storage.from.mockReturnValue({
                remove: vi.fn().mockResolvedValue({ error: null }),
            });

            await imageService.delete('https://storage.supabase.co/phones/test.jpg');

            expect(supabase.storage.from).toHaveBeenCalledWith('phones');
        });

        it('deve usar bucket customizado quando especificado', async () => {
            supabase.storage.from.mockReturnValue({
                remove: vi.fn().mockResolvedValue({ error: null }),
            });

            await imageService.delete('https://storage.supabase.co/custom/test.jpg', 'custom');

            expect(supabase.storage.from).toHaveBeenCalledWith('custom');
        });
    });
});

