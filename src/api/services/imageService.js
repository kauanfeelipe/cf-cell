import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errorHandler';
import { CONFIG } from '../../config/constants';

class ImageServiceError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'ImageServiceError';
        this.code = code;
    }
}

const sanitizeFileName = (fileName) => {
    if (!fileName || typeof fileName !== 'string') {
        return 'file';
    }
    
    return fileName
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 100);
};

const generateSecureFileName = (originalName) => {
    const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const sanitizedBase = sanitizeFileName(originalName.replace(/\.[^/.]+$/, ''));
    const timestamp = Date.now();
    const randomPart = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
    
    return `${timestamp}-${randomPart}-${sanitizedBase}.${ext}`;
};

export const imageService = {
    validateFile(file) {
        if (!file) {
            throw new ImageServiceError('Nenhum arquivo fornecido', 'NO_FILE');
        }

        if (!(file instanceof File || file instanceof Blob)) {
            throw new ImageServiceError('Arquivo inválido', 'INVALID_FILE');
        }

        if (!CONFIG.IMAGES.ALLOWED_TYPES.includes(file.type)) {
            throw new ImageServiceError(
                'Tipo de arquivo não permitido. Use JPG, PNG ou WebP',
                'INVALID_TYPE'
            );
        }

        if (file.size > CONFIG.IMAGES.MAX_SIZE) {
            const maxSizeMB = CONFIG.IMAGES.MAX_SIZE / (1024 * 1024);
            throw new ImageServiceError(
                `Arquivo muito grande. Máximo ${maxSizeMB}MB`,
                'FILE_TOO_LARGE'
            );
        }

        if (file.size === 0) {
            throw new ImageServiceError('Arquivo vazio', 'EMPTY_FILE');
        }

        return true;
    },

    async upload(file, bucket = CONFIG.SUPABASE.STORAGE.BUCKETS.PHONES) {
        try {
            this.validateFile(file);

            const fileName = generateSecureFileName(file.name);

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '31536000',
                    upsert: false,
                    contentType: file.type,
                });

            if (uploadError) {
                throw new ImageServiceError(
                    uploadError.message,
                    uploadError.error || 'UPLOAD_ERROR'
                );
            }

            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            if (!data?.publicUrl) {
                throw new ImageServiceError(
                    'Não foi possível obter URL da imagem',
                    'URL_ERROR'
                );
            }

            return data.publicUrl;
        } catch (error) {
            if (error instanceof ImageServiceError) {
                throw error;
            }
            handleSupabaseError(error, 'imageService.upload');
            throw new ImageServiceError(
                'Erro ao fazer upload da imagem',
                'UPLOAD_FAILED'
            );
        }
    },

    async delete(url, bucket = CONFIG.SUPABASE.STORAGE.BUCKETS.PHONES) {
        try {
            if (!url || typeof url !== 'string') {
                return false;
            }

            const urlParts = url.split('/');
            const path = urlParts[urlParts.length - 1];
            
            if (!path) {
                return false;
            }

            const { error } = await supabase.storage
                .from(bucket)
                .remove([path]);

            if (error) {
                throw new ImageServiceError(error.message, error.error || 'DELETE_ERROR');
            }

            return true;
        } catch (error) {
            if (error instanceof ImageServiceError) {
                throw error;
            }
            handleSupabaseError(error, 'imageService.delete');
            return false;
        }
    },
};
