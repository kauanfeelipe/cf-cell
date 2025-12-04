import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errorHandler';
import { CONFIG } from '../../config/constants';
import { imageService } from './imageService';

const PRODUCT_FIELDS = 'id, nome, valor, imagem_url, marca, armazenamento, memoria_ram, camera, bateria, cor, condicao, situacao, created_at';

class ProductServiceError extends Error {
    constructor(error) {
        super(error.message || 'Erro no serviço de produtos');
        this.name = 'ProductServiceError';
        this.code = error.code;
        this.details = error.details;
    }
}

const sanitizeString = (value, maxLength = 255) => {
    if (value === null || value === undefined) {
        return null;
    }
    
    if (typeof value !== 'string') {
        return String(value).slice(0, maxLength).trim();
    }
    
    return value.slice(0, maxLength).trim();
};

const validateProductData = (data) => {
    const errors = [];
    
    if (!data.nome || typeof data.nome !== 'string' || data.nome.trim().length < 2) {
        errors.push('Nome do produto é obrigatório (mínimo 2 caracteres)');
    }
    
    if (data.valor === undefined || data.valor === null || data.valor === '') {
        errors.push('Valor do produto é obrigatório');
    } else {
        const valor = Number(data.valor);
        if (isNaN(valor) || valor < 0 || valor > 999999.99) {
            errors.push('Valor do produto deve ser um número válido entre 0 e 999999.99');
        }
    }
    
    if (errors.length > 0) {
        throw new ProductServiceError({ 
            message: errors.join('. '), 
            code: 'VALIDATION_ERROR' 
        });
    }
};

const sanitizeProductData = (data) => {
    const sanitized = {};
    
    if (data.nome !== undefined) {
        sanitized.nome = sanitizeString(data.nome, 200);
    }
    
    if (data.marca !== undefined) {
        sanitized.marca = sanitizeString(data.marca, 100);
    }
    
    if (data.armazenamento !== undefined) {
        sanitized.armazenamento = sanitizeString(data.armazenamento, 50);
    }
    
    if (data.memoria_ram !== undefined) {
        sanitized.memoria_ram = sanitizeString(data.memoria_ram, 50);
    }
    
    if (data.camera !== undefined) {
        sanitized.camera = sanitizeString(data.camera, 100);
    }
    
    if (data.bateria !== undefined) {
        sanitized.bateria = sanitizeString(data.bateria, 50);
    }
    
    if (data.cor !== undefined) {
        sanitized.cor = sanitizeString(data.cor, 50);
    }
    
    if (data.condicao !== undefined) {
        const allowedCondicoes = ['Novo', 'Seminovo', 'Usado'];
        sanitized.condicao = allowedCondicoes.includes(data.condicao) 
            ? data.condicao 
            : 'Novo';
    }
    
    if (data.situacao !== undefined) {
        const allowedSituacoes = ['Normal', 'Oferta', 'Lançamento'];
        sanitized.situacao = allowedSituacoes.includes(data.situacao) 
            ? data.situacao 
            : 'Normal';
    }
    
    if (data.valor !== undefined) {
        const valor = Number(data.valor);
        sanitized.valor = isNaN(valor) ? 0 : Math.min(Math.max(valor, 0), 999999.99);
    }
    
    if (data.imagem_url !== undefined) {
        sanitized.imagem_url = typeof data.imagem_url === 'string' 
            ? data.imagem_url.slice(0, 500) 
            : null;
    }
    
    return sanitized;
};

const validateUUID = (id) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
        throw new ProductServiceError({ 
            message: 'ID inválido', 
            code: 'INVALID_ID' 
        });
    }
};

export const productService = {
    async getAll(options = {}) {
        const {
            limit = CONFIG.PAGINATION.DEFAULT_LIMIT,
            offset = 0,
            orderBy = 'created_at',
            ascending = false,
        } = options;

        const safeLimit = Math.min(Math.max(1, Number(limit) || CONFIG.PAGINATION.DEFAULT_LIMIT), CONFIG.PAGINATION.MAX_LIMIT);
        const safeOffset = Math.max(0, Number(offset) || 0);
        const allowedOrderBy = ['created_at', 'nome', 'valor'];
        const safeOrderBy = allowedOrderBy.includes(orderBy) ? orderBy : 'created_at';

        try {
            const { data, error, count } = await supabase
                .from(CONFIG.SUPABASE.TABLES.PRODUCTS)
                .select(PRODUCT_FIELDS, { count: 'exact' })
                .order(safeOrderBy, { ascending: Boolean(ascending) })
                .range(safeOffset, safeOffset + safeLimit - 1);

            if (error) {
                throw new ProductServiceError(error);
            }

            return {
                products: data || [],
                total: count || 0,
                hasMore: (data?.length || 0) === safeLimit,
            };
        } catch (error) {
            handleSupabaseError(error, 'productService.getAll');
            throw error;
        }
    },

    async getById(id) {
        validateUUID(id);

        try {
            const { data, error } = await supabase
                .from(CONFIG.SUPABASE.TABLES.PRODUCTS)
                .select(PRODUCT_FIELDS)
                .eq('id', id)
                .single();

            if (error) {
                throw new ProductServiceError(error);
            }

            return data;
        } catch (error) {
            handleSupabaseError(error, 'productService.getById');
            throw error;
        }
    },

    async create(productData) {
        try {
            validateProductData(productData);
            
            let finalData = sanitizeProductData(productData);
            
            if (productData.imageFile) {
                finalData.imagem_url = await imageService.upload(productData.imageFile);
            }

            const { data, error } = await supabase
                .from(CONFIG.SUPABASE.TABLES.PRODUCTS)
                .insert([finalData])
                .select(PRODUCT_FIELDS)
                .single();

            if (error) {
                throw new ProductServiceError(error);
            }

            return data;
        } catch (error) {
            handleSupabaseError(error, 'productService.create');
            throw error;
        }
    },

    async update(id, productData) {
        validateUUID(id);

        try {
            let finalData = sanitizeProductData(productData);
            
            if (productData.imageFile) {
                finalData.imagem_url = await imageService.upload(productData.imageFile);
            }

            const { data, error } = await supabase
                .from(CONFIG.SUPABASE.TABLES.PRODUCTS)
                .update(finalData)
                .eq('id', id)
                .select(PRODUCT_FIELDS)
                .single();

            if (error) {
                throw new ProductServiceError(error);
            }

            return data;
        } catch (error) {
            handleSupabaseError(error, 'productService.update');
            throw error;
        }
    },

    async delete(id) {
        validateUUID(id);

        try {
            const { error } = await supabase
                .from(CONFIG.SUPABASE.TABLES.PRODUCTS)
                .delete()
                .eq('id', id);

            if (error) {
                throw new ProductServiceError(error);
            }

            return true;
        } catch (error) {
            handleSupabaseError(error, 'productService.delete');
            throw error;
        }
    },

    async getHeroProducts(limit = 5) {
        const safeLimit = Math.min(Math.max(1, Number(limit) || 5), 10);

        try {
            const { data, error } = await supabase
                .from(CONFIG.SUPABASE.TABLES.PRODUCTS)
                .select('imagem_url, nome')
                .not('imagem_url', 'is', null)
                .order('created_at', { ascending: false })
                .limit(safeLimit);

            if (error) {
                throw new ProductServiceError(error);
            }

            return data || [];
        } catch (error) {
            handleSupabaseError(error, 'productService.getHeroProducts');
            throw error;
        }
    },
};
