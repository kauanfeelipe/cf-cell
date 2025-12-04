import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/cf-cell/',
    plugins: [
        react({
            jsxRuntime: 'automatic',
        }),
    ],
    build: {
        target: 'esnext',
        minify: 'esbuild',
        sourcemap: false,
        
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'react-vendor';
                        }
                        if (id.includes('react-router')) {
                            return 'router-vendor';
                        }
                        if (id.includes('framer-motion')) {
                            return 'animation-vendor';
                        }
                        if (id.includes('lucide-react')) {
                            return 'icons-vendor';
                        }
                        if (id.includes('@supabase')) {
                            return 'supabase-vendor';
                        }
                        if (id.includes('@tanstack/react-query')) {
                            return 'query-vendor';
                        }
                        return 'vendor';
                    }
                },
            },
        },
        
        assetsInlineLimit: 4096,
        chunkSizeWarningLimit: 1000,
        reportCompressedSize: true,
    },
    
    server: {
        hmr: {
            overlay: true,
        },
    },
    
    preview: {
        port: 4173,
    },

    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/__tests__/setup.js'],
        include: ['src/**/*.{test,spec}.{js,jsx}'],
        exclude: ['node_modules', 'dist'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
            include: ['src/**/*.{js,jsx}'],
            exclude: [
                'src/__tests__/**',
                'src/main.jsx',
                'src/index.css',
            ],
        },
        clearMocks: true,
        restoreMocks: true,
    },
})
