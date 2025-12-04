import React, { lazy, Suspense, useCallback, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import VirusRemoval from './components/VirusRemoval';
import Products from './components/Products';
import Accessories from './components/Accessories';
import About from './components/About';
import Footer from './components/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import Modal from './components/Modal';
import ProtectedRoute from './components/ProtectedRoute';
import { useWhatsApp } from './hooks/useWhatsApp';
import { CONFIG } from './config/constants';

const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const PublicLayout = () => {
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const { openDefaultChat } = useWhatsApp();

    const handleWhatsAppClick = useCallback((e) => {
        e.preventDefault();
        setIsWhatsAppModalOpen(true);
    }, []);

    const confirmWhatsAppRedirect = useCallback(() => {
        setIsWhatsAppModalOpen(false);
        openDefaultChat();
    }, [openDefaultChat]);

    const closeModal = useCallback(() => setIsWhatsAppModalOpen(false), []);

    return (
        <div className="bg-dark min-h-screen text-white font-body selection:bg-primary selection:text-dark">
            <Navbar />

            <main>
                <Hero />
                <Services />
                <Products />
                <VirusRemoval />
                <Accessories />
                <About />
            </main>

            <Footer />

            <a
                href={CONFIG.WHATSAPP.NUMBER ? `https://wa.me/${CONFIG.WHATSAPP.NUMBER}` : '#'}
                onClick={handleWhatsAppClick}
                className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all duration-300 animate-bounce cursor-pointer"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle size={32} fill="white" />
            </a>

            <Modal
                isOpen={isWhatsAppModalOpen}
                onClose={closeModal}
                title="Ir para o WhatsApp?"
            >
                <div className="space-y-4">
                    <p className="text-gray-400 text-center">
                        Você será redirecionado para o atendimento da loja no WhatsApp.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                            type="button"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={confirmWhatsAppRedirect}
                            className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium transition-colors flex items-center gap-2"
                            type="button"
                        >
                            <MessageCircle size={18} fill="white" />
                            Confirmar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const App = () => {
    return (
        <Routes>
            <Route 
                path="/admin/login" 
                element={
                    <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                        <AdminLogin />
                    </Suspense>
                } 
            />
            <Route path="/admin" element={<ProtectedRoute />}>
                <Route 
                    index 
                    element={
                        <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                            <AdminDashboard />
                        </Suspense>
                    } 
                />
            </Route>
            <Route path="/" element={<PublicLayout />} />
            <Route path="*" element={<PublicLayout />} />
        </Routes>
    );
};

export default App;
