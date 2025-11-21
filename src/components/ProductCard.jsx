import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Check, Star } from 'lucide-react';
import Modal from './Modal';

const ProductCard = ({ image, title, price, specs, delay, badge }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBuyClick = () => {
        setIsModalOpen(true);
    };

    const handleWhatsAppClick = () => {
        window.open(`https://wa.me/5511999999999?text=Olá!%20Tenho%20interesse%20no%20${encodeURIComponent(title)}`, '_blank');
        setIsModalOpen(false);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: delay }}
                className="glass-card rounded-2xl overflow-hidden group relative"
            >
                {/* Image Container */}
                <div className="relative h-64 md:h-72 lg:h-80 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60 z-10"></div>
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    {badge && (
                        <div className={`absolute top-4 right-4 z-20 font-bold px-3 py-1 rounded-full text-sm shadow-lg ${badge === 'Oferta' ? 'bg-red-500 text-white' : 'bg-primary text-dark'
                            }`}>
                            {badge}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 relative z-20">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
                    <div className="text-2xl font-bold text-primary mb-4">{price}</div>

                    <div className="space-y-2 mb-6">
                        {specs.map((spec, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                                <Check size={16} className="text-primary" />
                                <span>{spec}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleBuyClick}
                        className="btn-primary w-full flex items-center justify-center gap-2 !py-2"
                    >
                        <MessageCircle size={18} />
                        Comprar Agora
                    </button>
                </div>
            </motion.div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
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
                    >
                        <MessageCircle size={20} />
                        Continuar no WhatsApp
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default ProductCard;
