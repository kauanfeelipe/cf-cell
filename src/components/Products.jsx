import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import ProductCard from './ProductCard';
import { useProductsQuery } from '../hooks/useProductsQuery';
import { formatProductForDisplay } from '../lib/formatters';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorMessage from './common/ErrorMessage';
import EmptyState from './common/EmptyState';

const Products = () => {
    const { data, isLoading, error, isError, refetch } = useProductsQuery({ limit: 20 });

    const formattedProducts = useMemo(() => {
        if (!data?.products) return [];
        return data.products
            .map(formatProductForDisplay)
            .filter(Boolean);
    }, [data]);

    return (
        <section id="products" className="py-20 bg-dark-lighter relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block p-4 rounded-full bg-dark-surface border border-white/5 mb-6 shadow-glow"
                    >
                        <Smartphone size={32} className="text-primary" />
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Celulares <span className="text-gradient">Novos e Seminovos</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Modelos atualizados com garantia e a melhor relação custo-benefício da região.
                        Parcelamos em até 18x no cartão.
                    </p>
                </div>

                {isLoading ? (
                    <LoadingSpinner size="lg" className="h-64" />
                ) : isError ? (
                    <ErrorMessage 
                        error={error} 
                        title="Erro ao carregar produtos"
                        onRetry={refetch}
                    />
                ) : formattedProducts.length === 0 ? (
                    <EmptyState 
                        message="Nenhum produto disponível no momento."
                        description="Volte em breve para ver nossos produtos."
                    />
                ) : (
                    <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 gap-6 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-white/5">
                        {formattedProducts.map((product, index) => (
                            <div 
                                key={product.id} 
                                className="w-[280px] md:w-[340px] lg:w-[380px] snap-center flex-shrink-0"
                            >
                                <ProductCard
                                    {...product}
                                    delay={index * 0.1}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default React.memo(Products);
