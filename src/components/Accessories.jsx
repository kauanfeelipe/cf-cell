import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, BatteryCharging, Cable, Shield, Smartphone, Car } from 'lucide-react';

const accessories = [
    { icon: <Shield size={32} />, name: "Películas", desc: "Vidro 3D, 9D e Gel" },
    { icon: <Smartphone size={32} />, name: "Capinhas", desc: "Anti-impacto e Silicone" },
    { icon: <Headphones size={32} />, name: "Fones", desc: "Bluetooth e Com Fio" },
    { icon: <BatteryCharging size={32} />, name: "Carregadores", desc: "Turbo e Portáteis" },
    { icon: <Cable size={32} />, name: "Cabos", desc: "iPhone, Tipo-C e V8" },
    { icon: <Car size={32} />, name: "Suportes", desc: "Veicular e Mesa" },
];

const Accessories = () => {
    return (
        <section id="accessories" className="py-20 bg-dark relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Acessórios <span className="text-primary">Premium</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Tudo que você precisa para proteger e aproveitar o máximo do seu smartphone.
                        Produtos de alta qualidade com garantia.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {accessories.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 rounded-xl text-center group hover:bg-primary hover:border-primary transition-all duration-300 cursor-pointer"
                        >
                            <div className="mb-4 text-primary group-hover:text-dark transition-colors flex justify-center">
                                {item.icon}
                            </div>
                            <h3 className="font-bold mb-1 group-hover:text-dark transition-colors">{item.name}</h3>
                            <p className="text-xs text-gray-500 group-hover:text-dark/70 transition-colors">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Accessories;
