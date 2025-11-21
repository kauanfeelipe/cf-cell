import React from 'react';
import { MessageCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import VirusRemoval from './components/VirusRemoval';
import Products from './components/Products';
import Accessories from './components/Accessories';
import About from './components/About';
import Footer from './components/Footer';

import { Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const PublicLayout = () => {
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = React.useState(false);

    const handleWhatsAppClick = (e) => {
        e.preventDefault();
        setIsWhatsAppModalOpen(true);
    };

    const confirmWhatsAppRedirect = () => {
        setIsWhatsAppModalOpen(false);
        window.open("https://wa.me/5511999999999", "_blank");
    };

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

            {/* Floating WhatsApp Button */}
            <a
                href="https://wa.me/5511999999999"
                onClick={handleWhatsAppClick}
                className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all duration-300 animate-bounce cursor-pointer"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle size={32} fill="white" />
            </a>

            {/* WhatsApp Confirmation Modal */}
            {isWhatsAppModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-dark-surface border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100">
                        <h3 className="text-xl font-bold mb-4 text-center">Ir para o WhatsApp?</h3>
                        <p className="text-gray-400 text-center mb-6">
                            Você será redirecionado para o atendimento da loja no WhatsApp.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setIsWhatsAppModalOpen(false)}
                                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmWhatsAppRedirect}
                                className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium transition-colors flex items-center gap-2"
                            >
                                <MessageCircle size={18} fill="white" />
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function App() {
    return (
        <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute />}>
                <Route index element={<AdminDashboard />} />
            </Route>
            <Route path="/" element={<PublicLayout />} />
            <Route path="*" element={<PublicLayout />} />
        </Routes>
    );
}

export default App;
