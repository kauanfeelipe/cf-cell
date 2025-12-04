import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, Phone, Instagram, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { CONFIG } from '../config/constants';

const Navbar = ({ onContactClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { openDefaultChat, whatsappUrl } = useWhatsApp();

    const handleContactClick = useCallback(
        (event) => {
            event.preventDefault();
            if (onContactClick) {
                onContactClick(event);
                return;
            }
            openDefaultChat();
        },
        [onContactClick, openDefaultChat]
    );

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Início', href: '#home' },
        { name: 'Assistência', href: '#services' },
        { name: 'Celulares', href: '#products' },
        { name: 'Acessórios', href: '#accessories' },
        { name: 'Sobre', href: '#about' },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "bg-dark/90 backdrop-blur-md py-4 shadow-glow" : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                <a href="#home" className="relative group flex justify-center md:justify-start flex-1 md:flex-initial">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-wider italic flex items-center gap-2">
                        <span className="bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent animate-shine bg-[length:200%_auto] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                            CF CELL
                        </span>
                        <Smartphone className="text-primary" size={32} />
                    </h1>
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-gray-300 hover:text-primary transition-colors font-medium text-sm uppercase tracking-wider relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    ))}

                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleContactClick}
                        className="btn-primary flex items-center gap-2 !py-2 !px-6 text-sm"
                    >
                        <Phone size={18} />
                        <span>Contato</span>
                    </a>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white p-2 hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-dark-surface/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-semibold font-heading uppercase tracking-[0.3em] text-white text-center hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="pt-4 flex flex-col gap-3">
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(event) => {
                                        handleContactClick(event);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="btn-primary text-center flex justify-center items-center gap-2"
                                >
                                    <Phone size={20} />
                                    WhatsApp
                                </a>
                                <a
                                    href={CONFIG.INSTAGRAM.URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-outline text-center flex justify-center items-center gap-2"
                                >
                                    <Instagram size={20} />
                                    Instagram
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default React.memo(Navbar);
