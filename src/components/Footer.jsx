import React from 'react';
import { Instagram, Phone, MapPin, Clock } from 'lucide-react';
import { CONFIG } from '../config/constants';

const QUICK_LINKS = [
    { href: '#services', label: 'Assistência Técnica' },
    { href: '#products', label: 'Celulares à Venda' },
    { href: '#accessories', label: 'Acessórios' },
    { href: '#about', label: 'Quem Somos' },
];

const CONTACT_INFO = {
    phone: '(11) 99999-9999',
    address: 'R. Espírito Santo, 618\nCentro - Nuporanga/SP',
    hours: 'Seg-Sex: 9h às 18h\nSáb: 9h às 14h',
};

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark-surface border-t border-white/5 pt-10 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 mb-8">
                    <div className="col-span-2 md:col-span-1 lg:col-span-1 flex flex-col justify-between items-center lg:items-start">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent animate-shine bg-[length:200%_auto] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] italic tracking-wider">
                                CF CELL
                            </h3>
                            <a
                                href={CONFIG.INSTAGRAM.URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors"
                            >
                                <Instagram size={20} />
                                <span className="text-sm">@cf_assistenciatecnica_</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-base font-bold mb-4 text-white">Contato</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <Phone className="text-primary shrink-0" size={16} />
                                <span>{CONTACT_INFO.phone}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="text-primary shrink-0" size={16} />
                                <span className="whitespace-pre-line">{CONTACT_INFO.address}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Clock className="text-primary shrink-0" size={16} />
                                <span className="whitespace-pre-line">{CONTACT_INFO.hours}</span>
                            </li>
                        </ul>
                    </div>

                    <nav aria-label="Links rápidos">
                        <h4 className="text-base font-bold mb-4 text-white">Links Rápidos</h4>
                        <ul className="space-y-1 text-sm">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a 
                                        href={link.href} 
                                        className="text-gray-400 hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="col-span-2 md:col-span-1 lg:col-span-1">
                        <h4 className="text-base font-bold mb-4 text-white">Localização</h4>
                        <div className="w-full h-40 bg-white/5 rounded-xl overflow-hidden border border-white/10 shadow-lg relative group">
                            <iframe
                                src="https://maps.google.com/maps?q=CF%20Cell%20Nuporanga%20SP&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Localização CF Cell"
                                className="w-full h-full transition-opacity duration-300"
                            />
                            <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-xl" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-6 text-center text-gray-600 text-xs">
                    <p>&copy; {currentYear} CF CELL. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default React.memo(Footer);
