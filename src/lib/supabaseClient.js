import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const validateEnvVars = () => {
    const errors = [];
    
    if (!supabaseUrl) {
        errors.push('VITE_SUPABASE_URL');
    }
    
    if (!supabaseAnonKey) {
        errors.push('VITE_SUPABASE_ANON_KEY');
    }
    
    if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
        if (import.meta.env.PROD) {
            errors.push('VITE_SUPABASE_URL deve usar HTTPS em produção');
        }
    }
    
    if (errors.length > 0) {
        throw new Error(
            `Configuração do Supabase inválida: ${errors.join(', ')}. ` +
            'Verifique suas variáveis de ambiente.'
        );
    }
};

validateEnvVars();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    global: {
        headers: {
            'x-application-name': 'cf-cell',
        },
    },
    db: {
        schema: 'public',
    },
});
