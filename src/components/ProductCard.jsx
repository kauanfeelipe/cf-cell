import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Check } from 'lucide-react';
import { CONFIG } from '../config/constants';
import { formatWhatsAppUrl } from '../lib/formatters';
import Modal from './Modal';

const ProductCard = ({ image, title, price, specs, delay = 0, badge }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    const handleWhatsAppClick = useCallback(() => {
        const message = CONFIG.WHATSAPP.MESSAGE_TEMPLATES.PRODUCT_INTEREST(title);
        const url = formatWhatsAppUrl(CONFIG.WHATSAPP.NUMBER, message);
        window.open(url, '_blank', 'noopener,noreferrer');
        closeModal();
    }, [title, closeModal]);

    return (
        <>
            <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay }}
                className="glass-card rounded-2xl overflow-hidden group relative flex flex-col h-full min-h-[520px] lg:min-h-[560px]"
            >
                <div className="relative h-64 md:h-72 lg:h-80 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60 z-10" />
                    <img
                        src={image}
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    {badge && (
                        <div className={`absolute top-4 right-4 z-20 font-bold px-3 py-1 rounded-full text-sm shadow-lg ${
                            badge === 'Oferta' ? 'bg-red-500 text-white' : 'bg-primary text-dark'
                        }`}>
                            {badge}
                        </div>
                    )}
                </div>

                <div className="p-6 relative z-20 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <div className="text-2xl font-bold text-primary mb-4">{price}</div>

                    {specs?.length > 0 && (
                        <ul className="grid grid-cols-2 gap-3 mb-6">
                            {specs.map((spec, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                                >
                                    <Check size={14} className="text-primary flex-shrink-0" />
                                    <span className="leading-snug">{spec}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <button
                        onClick={openModal}
                        className="btn-primary w-full flex items-center justify-center gap-2 !py-2 mt-auto"
                        type="button"
                    >
                        <MessageCircle size={18} />
                        Comprar Agora
                    </button>
                </div>
            </motion.article>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Comprar Agora"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-dark-surface rounded-xl border border-white/10">
                        <img
                            src={image}
                            alt={title}
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div>
                            <h4 className="font-bold text-white">{title}</h4>
                            <p className="text-primary font-bold">{price}</p>
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm">
                        Entre em contato conosco pelo WhatsApp para finalizar sua compra e tirar todas as suas dúvidas!
                    </p>

                    <button
                        onClick={handleWhatsAppClick}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                        type="button"
                    >
                        <MessageCircle size={20} />
                        Continuar no WhatsApp
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default React.memo(ProductCard);
