import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Battery, Plug, Download, Cpu, ShieldAlert, Wrench } from 'lucide-react';

const services = [
    {
        icon: <Smartphone size={32} />,
        title: "Troca de Telas",
        description: "Substituição de telas quebradas com peças de alta qualidade e garantia."
    },
    {
        icon: <Battery size={32} />,
        title: "Troca de Baterias",
        description: "Baterias novas para dar vida longa ao seu aparelho novamente."
    },
    {
        icon: <Plug size={32} />,
        title: "Conectores de Carga",
        description: "Reparo em entradas de carregador que não funcionam ou estão com mau contato."
    },
    {
        icon: <Download size={32} />,
        title: "Software",
        description: "Atualizações, formatação e recuperação de sistema operacional."
    },
    {
        icon: <Cpu size={32} />,
        title: "Reparo em Placas",
        description: "Diagnóstico e conserto avançado em placas de smartphones."
    },
    {
        icon: <ShieldAlert size={32} />,
        title: "Limpeza e Otimização",
        description: "Remoção de vírus e otimização para deixar seu celular mais rápido."
    }
];

const Services = () => {
    return (
        <section id="services" className="py-20 bg-dark relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4"
                    >
                        <Wrench className="text-primary" size={24} />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        Assistência Técnica <span className="text-gradient">Especializada</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto"
                    >
                        Consertamos seu smartphone com rapidez, segurança e peças de qualidade.
                        Técnicos certificados prontos para resolver seu problema.
                    </motion.p>
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 md:px-0 scrollbar-hide">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-8 rounded-2xl group hover:-translate-y-2 min-w-[280px] md:min-w-0 snap-center mx-2 md:mx-0"
                        >
                            <div className="mb-6 p-4 bg-dark-lighter rounded-xl inline-block group-hover:bg-primary group-hover:text-dark transition-colors duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>


            </div>
        </section>
    );
};

export default Services;
