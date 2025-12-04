import React, { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Home, AlertCircle } from 'lucide-react';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000;

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkExistingSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.app_metadata?.role === 'admin') {
                navigate('/admin', { replace: true });
            }
        };
        
        checkExistingSession();
    }, [navigate]);

    useEffect(() => {
        if (lockoutUntil) {
            const timer = setTimeout(() => {
                setLockoutUntil(null);
                setAttempts(0);
            }, lockoutUntil - Date.now());

            return () => clearTimeout(timer);
        }
    }, [lockoutUntil]);

    const validateInput = useCallback(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email || !emailRegex.test(email)) {
            setError('Por favor, insira um email válido');
            return false;
        }

        if (!password || password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return false;
        }

        return true;
    }, [email, password]);

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        
        if (lockoutUntil && Date.now() < lockoutUntil) {
            const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 1000 / 60);
            setError(`Muitas tentativas. Tente novamente em ${remainingTime} minutos.`);
            return;
        }

        if (!validateInput()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password,
            });

            if (authError) {
                throw authError;
            }

            if (data?.user?.app_metadata?.role !== 'admin') {
                await supabase.auth.signOut();
                throw new Error('Acesso não autorizado. Apenas administradores podem acessar.');
            }

            setAttempts(0);
            navigate('/admin', { replace: true });
        } catch (err) {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
                setLockoutUntil(Date.now() + LOCKOUT_DURATION);
                setError(`Conta bloqueada temporariamente por muitas tentativas. Tente novamente em 5 minutos.`);
            } else {
                const remainingAttempts = MAX_LOGIN_ATTEMPTS - newAttempts;
                setError(
                    err.message === 'Invalid login credentials'
                        ? `Credenciais inválidas. ${remainingAttempts} tentativas restantes.`
                        : err.message
                );
            }
        } finally {
            setLoading(false);
        }
    }, [email, password, attempts, lockoutUntil, navigate, validateInput]);

    const isLocked = lockoutUntil && Date.now() < lockoutUntil;

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-dark-surface p-8 rounded-2xl border border-white/10 shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Admin Access</h2>
                    <p className="text-gray-400">Área restrita para administradores</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-dark border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                required
                                disabled={loading || isLocked}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                            Senha
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-dark border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                placeholder="••••••••"
                                required
                                disabled={loading || isLocked}
                                autoComplete="current-password"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || isLocked}
                        className="w-full bg-primary hover:bg-primary-dark text-dark font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Entrando...' : isLocked ? 'Aguarde...' : 'Acessar Painel'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/10">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-lg transition-all duration-300 border border-white/10 hover:border-primary/50"
                    >
                        <Home size={20} />
                        Ir para o Site
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
