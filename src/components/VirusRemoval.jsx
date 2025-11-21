import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Zap, CheckCircle2 } from 'lucide-react';

const VirusRemoval = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            {/* Dark gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark to-dark-lighter z-0"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="bg-dark-surface border border-white/5 rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
                    {/* Glow effect */}
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50"></div>

                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 mb-6">
                                    <ShieldCheck size={16} />
                                    <span className="text-sm font-bold uppercase tracking-wider">Segurança Total</span>
                                </div>

                                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                    Celular Lento ou com <span className="text-primary">Vírus?</span>
                                </h2>

                                <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                                    Não deixe seus dados em risco. Removemos vírus, malwares e aplicativos maliciosos sem que você perca suas fotos e contatos. Seu aparelho volta a ficar rápido e seguro.
                                </p>

                                <ul className="space-y-4 mb-8">
                                    {[
                                        "Remoção completa de ameaças",
                                        "Otimização de desempenho",
                                        "Preservação dos seus dados",
                                        "Instalação de antivírus"
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <CheckCircle2 className="text-primary" size={20} />
                                            <span className="text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>


                            </motion.div>
                        </div>

                        <div className="lg:w-1/2 flex justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="relative"
                            >
                                <div className="relative z-10 bg-gradient-to-br from-dark-lighter to-dark p-8 rounded-full border border-white/10 shadow-[0_0_60px_rgba(255,215,0,0.1)]">
                                    <Lock size={80} className="text-primary animate-pulse" />
                                </div>

                                {/* Orbiting elements */}
                                <div className="absolute inset-0 animate-spin-slow">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-dark-surface p-3 rounded-full border border-white/10 shadow-lg">
                                        <ShieldCheck size={24} className="text-green-400" />
                                    </div>
                                </div>
                                <div className="absolute inset-0 animate-spin-reverse-slow">
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-dark-surface p-3 rounded-full border border-white/10 shadow-lg">
                                        <Zap size={24} className="text-yellow-400" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VirusRemoval;
