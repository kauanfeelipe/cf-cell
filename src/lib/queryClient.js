import { QueryClient } from '@tanstack/react-query';

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;
const MAX_RETRIES = 2;

const shouldRetry = (failureCount, error) => {
    if (failureCount >= MAX_RETRIES) {
        return false;
    }
    
    if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
        return false;
    }
    
    return true;
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: STALE_TIME,
            gcTime: GC_TIME,
            retry: shouldRetry,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            refetchOnMount: true,
        },
        mutations: {
            retry: 1,
        },
    },
});
