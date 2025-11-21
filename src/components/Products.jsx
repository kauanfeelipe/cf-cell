import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Loader } from 'lucide-react';
import ProductCard from './ProductCard';
import { supabase } from '../lib/supabaseClient';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('celulares_venda')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching products:', error);
            } else {
                // Transform data to match ProductCard props
                const formattedProducts = data.map(item => ({
                    image: item.imagem_url || "/imagens/phone-1.jpg", // Fallback image
                    title: item.nome,
                    price: `R$ ${Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                    specs: [
                        item.marca,
                        item.armazenamento,
                        item.memoria_ram,
                        item.camera,
                        item.bateria,
                        item.cor,
                        item.condicao
                    ].filter(Boolean), // Remove null/undefined specs
                    badge: item.situacao !== 'Normal' ? item.situacao : null
                }));
                setProducts(formattedProducts);
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);

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

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="animate-spin text-primary" size={48} />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        <p>Nenhum produto disponível no momento.</p>
                    </div>
                ) : (
                    <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 gap-6 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-white/5">
                        {products.map((product, index) => (
                            <div key={index} className="w-[280px] md:w-[340px] lg:w-[380px] snap-center flex-shrink-0">
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

export default Products;
