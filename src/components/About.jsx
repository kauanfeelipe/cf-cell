import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, Star, Heart } from 'lucide-react';

const FEATURES = [
    { icon: Award, label: 'Qualidade Garantida' },
    { icon: Clock, label: 'Atendimento Rápido' },
    { icon: Star, label: 'Profissionais Experientes' },
    { icon: Heart, label: 'Feito com Paixão' },
];

const About = () => {
    const logoSrc = `${import.meta.env.BASE_URL}cf-cell.jpg`;

    return (
        <section id="about" className="py-20 bg-dark-lighter relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <div className="mb-6 lg:hidden flex justify-center">
                            <img
                                src={logoSrc}
                                alt="CF CELL Logo"
                                className="h-20 w-auto rounded-xl border border-white/10 shadow-lg"
                            />
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center lg:text-left">
                            Sobre a{' '}
                            <span className="bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent animate-shine bg-[length:200%_auto] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] italic tracking-wider">
                                CF CELL
                            </span>
                        </h2>
                        
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                            Especialistas em assistência técnica e venda de smartphones.
                            Compromisso com qualidade, agilidade e a satisfação de cada cliente.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            {FEATURES.map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Icon size={24} />
                                    </div>
                                    <span className="font-medium">{label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 relative hidden lg:block"
                    >
                        <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <img
                                src={logoSrc}
                                alt="CF CELL Loja"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-50" />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/20 rounded-full blur-[64px] -z-10" />
                        <div className="absolute -top-6 -left-6 w-48 h-48 bg-white/5 rounded-full blur-[64px] -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default React.memo(About);
