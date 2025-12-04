import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import App from './App.jsx'
import LoadingSpinner from './components/common/LoadingSpinner.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <HashRouter>
                    <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                        <App />
                    </Suspense>
                </HashRouter>
            </QueryClientProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
