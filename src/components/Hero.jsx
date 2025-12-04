import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Smartphone, ChevronRight, ChevronLeft } from 'lucide-react';
import { useHeroProductsQuery } from '../hooks/useProductsQuery';
import { CONFIG } from '../config/constants';
import { formatWhatsAppUrl } from '../lib/formatters';
import LoadingSpinner from './common/LoadingSpinner';
import Modal from './Modal';

const FALLBACK_IMAGE = { imagem_url: '/imagens/phone-1.jpg', nome: 'Smartphone Repair' };

const ImageCarousel = ({ images, currentIndex, onPrev, onNext, onSelect, isLoading }) => {
    if (isLoading) {
        return <LoadingSpinner size="md" className="w-full h-full" />;
    }

    return (
        <>
            <AnimatePresence mode='wait'>
                {images.length > 0 && (
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex].imagem_url}
                        alt={images[currentIndex].nome}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                )}
            </AnimatePresence>

            {images.length > 1 && (
                <>
                    <button
                        onClick={onPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-primary hover:text-dark transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Imagem anterior"
                        type="button"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={onNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-primary hover:text-dark transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Próxima imagem"
                        type="button"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSelect(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    idx === currentIndex ? 'bg-primary w-4' : 'bg-white/50 hover:bg-white'
                                }`}
                                aria-label={`Ir para imagem ${idx + 1}`}
                                type="button"
                            />
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

const Hero = () => {
    const { data: heroData, isLoading } = useHeroProductsQuery(5);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    
    const displayImages = useMemo(() => {
        return heroData?.length > 0 ? heroData : [FALLBACK_IMAGE];
    }, [heroData]);

    const nextImage = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, [displayImages.length]);

    const prevImage = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    }, [displayImages.length]);

    const handleWhatsAppClick = useCallback((message) => {
        const url = formatWhatsAppUrl(CONFIG.WHATSAPP.NUMBER, message);
        window.open(url, '_blank', 'noopener,noreferrer');
        setIsQuoteModalOpen(false);
    }, []);

    const openQuoteModal = useCallback(() => setIsQuoteModalOpen(true), []);
    const closeQuoteModal = useCallback(() => setIsQuoteModalOpen(false), []);

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            <div className="absolute inset-0 bg-dark z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-dark to-dark opacity-50" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[96px] animate-float" />
            </div>

            <div className="container mx-auto px-4 z-10 relative">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="lg:w-1/2 text-center lg:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex justify-center lg:justify-start mb-20 lg:mb-20 lg:relative lg:right-[-43%]"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary-light to-primary rounded-3xl blur-md opacity-50 group-hover:opacity-75 transition duration-500" />
                                <img
                                    src={`${import.meta.env.BASE_URL}cf-cell.jpg`}
                                    alt="CF CELL"
                                    className="relative h-40 md:h-36 lg:h-40 w-auto rounded-3xl border-2 border-primary/30 shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_50px_rgba(255,215,0,0.5)] transition-all duration-300"
                                />
                            </div>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-sm font-medium text-gray-300">Especialistas em Tecnologia</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 italic">
                            Seu Celular <br />
                            <span className="text-gradient">Novo de Novo</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Assistência técnica especializada e venda de smartphones com a qualidade e confiança que você merece. Transformamos seu problema em solução.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <button
                                onClick={openQuoteModal}
                                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group"
                                type="button"
                            >
                                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                                Solicitar Orçamento
                            </button>
                            <a
                                href="#products"
                                className="btn-outline w-full sm:w-auto flex items-center justify-center gap-2 group"
                            >
                                <Smartphone size={20} className="group-hover:rotate-12 transition-transform" />
                                Ver Celulares
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>

                        <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-400 text-sm font-medium">
                            {['Orçamento Rápido', 'Peças Originais', 'Garantia Total'].map((text) => (
                                <div 
                                    key={text}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                                >
                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                                    <span className="font-bold text-white tracking-wide">{text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:w-1/2 relative"
                    >
                        <div className="relative z-10 animate-float">
                            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,215,0,0.15)] bg-dark-surface/50 backdrop-blur-sm p-4">
                                <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden group">
                                    <ImageCarousel
                                        images={displayImages}
                                        currentIndex={currentIndex}
                                        onPrev={prevImage}
                                        onNext={nextImage}
                                        onSelect={setCurrentIndex}
                                        isLoading={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="absolute -top-10 -right-10 w-full h-full border-2 border-primary/20 rounded-3xl -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-full h-full border-2 border-white/5 rounded-3xl -z-10" />
                    </motion.div>
                </div>
            </div>

            <Modal
                isOpen={isQuoteModalOpen}
                onClose={closeQuoteModal}
                title="Solicitar Orçamento"
            >
                <div className="space-y-4">
                    <p className="text-gray-400">
                        Escolha o serviço que você precisa e entre em contato conosco pelo WhatsApp!
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => handleWhatsAppClick(CONFIG.WHATSAPP.MESSAGE_TEMPLATES.QUOTE_TECHNICAL)}
                            className="btn-outline w-full flex items-center justify-center gap-2"
                            type="button"
                        >
                            <MessageCircle size={20} />
                            Assistência Técnica
                        </button>

                        <button
                            onClick={() => handleWhatsAppClick(CONFIG.WHATSAPP.MESSAGE_TEMPLATES.QUOTE_PURCHASE)}
                            className="btn-outline w-full flex items-center justify-center gap-2"
                            type="button"
                        >
                            <Smartphone size={20} />
                            Compra de Celular
                        </button>

                        <button
                            onClick={() => handleWhatsAppClick(CONFIG.WHATSAPP.MESSAGE_TEMPLATES.QUOTE_OTHER)}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                            type="button"
                        >
                            <MessageCircle size={20} />
                            Outro Serviço
                        </button>
                    </div>
                </div>
            </Modal>
        </section>
    );
};

export default React.memo(Hero);
