import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import LoadingSpinner from './common/LoadingSpinner';

const AUTH_CHECK_TIMEOUT = 10000;

const ProtectedRoute = () => {
    const [authState, setAuthState] = useState({
        session: null,
        isAdmin: false,
        loading: true,
        error: null,
    });
    
    const timeoutRef = useRef(null);
    const isMountedRef = useRef(true);

    const checkAdminRole = useCallback((session) => {
        if (!session?.user) {
            return false;
        }
        
        return session.user.app_metadata?.role === 'admin';
    }, []);

    const updateAuthState = useCallback((session) => {
        if (!isMountedRef.current) return;
        
        const isAdmin = checkAdminRole(session);
        
        setAuthState({
            session,
            isAdmin,
            loading: false,
            error: null,
        });
    }, [checkAdminRole]);

    useEffect(() => {
        isMountedRef.current = true;

        const checkAuth = async () => {
            try {
                timeoutRef.current = setTimeout(() => {
                    if (isMountedRef.current) {
                        setAuthState(prev => ({
                            ...prev,
                            loading: false,
                            error: 'Tempo limite excedido',
                        }));
                    }
                }, AUTH_CHECK_TIMEOUT);

                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                if (error) {
                    throw error;
                }

                updateAuthState(session);
            } catch (error) {
                if (isMountedRef.current) {
                    setAuthState({
                        session: null,
                        isAdmin: false,
                        loading: false,
                        error: error.message,
                    });
                }
            }
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                updateAuthState(session);
            }
        );

        return () => {
            isMountedRef.current = false;
            
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            
            subscription.unsubscribe();
        };
    }, [updateAuthState]);

    if (authState.loading) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <LoadingSpinner size="lg" text="Verificando autenticação..." />
            </div>
        );
    }

    if (authState.error) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center p-4">
                <div className="bg-dark-surface border border-red-500/20 rounded-xl p-8 max-w-md text-center">
                    <p className="text-red-400 mb-4">Erro de autenticação</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-dark font-medium rounded-lg"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    if (!authState.session || !authState.isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
