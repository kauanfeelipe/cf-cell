import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getUserFriendlyMessage, handleSupabaseError, isNetworkError, isAuthError } from '../../lib/errorHandler';

describe('errorHandler', () => {
    describe('getUserFriendlyMessage', () => {
        it('deve retornar mensagem padrão para erro nulo', () => {
            const result = getUserFriendlyMessage(null);
            expect(result).toBe('Ocorreu um erro. Tente novamente mais tarde.');
        });

        it('deve retornar mensagem padrão para erro undefined', () => {
            const result = getUserFriendlyMessage(undefined);
            expect(result).toBe('Ocorreu um erro. Tente novamente mais tarde.');
        });

        it('deve retornar mensagem amigável para código PGRST116', () => {
            const error = { code: 'PGRST116' };
            const result = getUserFriendlyMessage(error);
            expect(result).toBe('Nenhum resultado encontrado');
        });

        it('deve retornar mensagem amigável para código 23505 (duplicate)', () => {
            const error = { code: '23505' };
            const result = getUserFriendlyMessage(error);
            expect(result).toBe('Este item já existe');
        });

        it('deve retornar mensagem amigável para código 23503 (foreign key)', () => {
            const error = { code: '23503' };
            const result = getUserFriendlyMessage(error);
            expect(result).toBe('Não é possível excluir este item');
        });

        it('deve retornar mensagem amigável para código 42501 (permission)', () => {
            const error = { code: '42501' };
            const result = getUserFriendlyMessage(error);
            expect(result).toBe('Você não tem permissão para esta ação');
        });

        it('deve retornar mensagem de rede para TypeError com fetch', () => {
            const error = { name: 'TypeError', message: 'Failed to fetch' };
            const result = getUserFriendlyMessage(error);
            expect(result).toBe('Erro de conexão. Verifique sua internet.');
        });

        it('deve retornar mensagem de timeout para AbortError', () => {
            const error = { name: 'AbortError' };
            const result = getUserFriendlyMessage(error);
            expect(result).toBe('A operação demorou muito. Tente novamente.');
        });

        it('deve sanitizar mensagens com informações sensíveis - password', () => {
            const error = { message: 'Invalid password provided' };
            const result = getUserFriendlyMessage(error);
            expect(result).not.toContain('password');
            expect(result).toContain('[REDACTED]');
        });

        it('deve sanitizar mensagens com informações sensíveis - token', () => {
            const error = { message: 'Token expired: abc123token' };
            const result = getUserFriendlyMessage(error);
            expect(result).not.toContain('token');
        });

        it('deve sanitizar mensagens com informações sensíveis - api_key', () => {
            const error = { message: 'Invalid api_key: xyz789' };
            const result = getUserFriendlyMessage(error);
            expect(result).not.toContain('api_key');
        });

        it('deve truncar mensagens muito longas', () => {
            const longMessage = 'A'.repeat(300);
            const error = { message: longMessage };
            const result = getUserFriendlyMessage(error);
            expect(result.length).toBeLessThanOrEqual(200);
        });

        it('deve retornar mensagem do erro quando não há código conhecido', () => {
            const error = { message: 'Erro específico' };
            const result = getUserFriendlyMessage(error);
            expect(result).toBe('Erro específico');
        });
    });

    describe('handleSupabaseError', () => {
        let consoleSpy;

        beforeEach(() => {
            consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('deve retornar objeto de erro formatado', () => {
            const error = { code: '42501', message: 'Permission denied' };
            const result = handleSupabaseError(error, 'testContext');

            expect(result.message).toBe('Você não tem permissão para esta ação');
            expect(result.code).toBe('42501');
            expect(result.context).toBe('testContext');
            expect(result.timestamp).toBeDefined();
        });

        it('deve definir código como UNKNOWN quando não fornecido', () => {
            const error = { message: 'Generic error' };
            const result = handleSupabaseError(error, 'testContext');

            expect(result.code).toBe('UNKNOWN');
        });

        it('deve logar erro em desenvolvimento', () => {
            const error = { code: '500', message: 'Server error' };
            handleSupabaseError(error, 'testContext');

            expect(consoleSpy).toHaveBeenCalled();
        });

        it('deve incluir timestamp ISO válido', () => {
            const error = { message: 'Test error' };
            const result = handleSupabaseError(error, 'testContext');

            const timestamp = new Date(result.timestamp);
            expect(timestamp).toBeInstanceOf(Date);
            expect(isNaN(timestamp.getTime())).toBe(false);
        });
    });

    describe('isNetworkError', () => {
        it('deve retornar true para TypeError', () => {
            const error = { name: 'TypeError' };
            expect(isNetworkError(error)).toBe(true);
        });

        it('deve retornar true para erro com fetch na mensagem', () => {
            const error = { message: 'Failed to fetch data' };
            expect(isNetworkError(error)).toBe(true);
        });

        it('deve retornar true para código NETWORK_ERROR', () => {
            const error = { code: 'NETWORK_ERROR' };
            expect(isNetworkError(error)).toBe(true);
        });

        it('deve retornar false para erro comum', () => {
            const error = { message: 'Database error', code: '500' };
            expect(isNetworkError(error)).toBe(false);
        });

        it('deve retornar false para erro nulo', () => {
            expect(isNetworkError(null)).toBeFalsy();
        });
    });

    describe('isAuthError', () => {
        it('deve retornar true para código 42501', () => {
            const error = { code: '42501' };
            expect(isAuthError(error)).toBe(true);
        });

        it('deve retornar true para status 401', () => {
            const error = { status: 401 };
            expect(isAuthError(error)).toBe(true);
        });

        it('deve retornar true para status 403', () => {
            const error = { status: 403 };
            expect(isAuthError(error)).toBe(true);
        });

        it('deve retornar true para mensagem com unauthorized', () => {
            const error = { message: 'Unauthorized access' };
            expect(isAuthError(error)).toBe(true);
        });

        it('deve retornar false para erro comum', () => {
            const error = { message: 'Database error', status: 500 };
            expect(isAuthError(error)).toBe(false);
        });

        it('deve retornar falsy para erro nulo', () => {
            expect(isAuthError(null)).toBeFalsy();
        });
    });
});
