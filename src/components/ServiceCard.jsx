import React from 'react';
import { motion } from 'framer-motion';

const ServiceCard = ({ icon: Icon, title, description }) => {
    return (
        <motion.div
            className="bg-dark-lighter p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
            whileHover={{ y: -10 }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
                <div className="w-14 h-14 bg-dark rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10 group-hover:border-primary/50 shadow-lg group-hover:shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                    <Icon className="text-primary" size={28} />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.div>
    );
};

export default ServiceCard;
