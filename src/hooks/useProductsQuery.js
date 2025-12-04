import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../api/services/productService';

const QUERY_KEYS = {
    products: 'products',
    product: 'product',
    heroProducts: 'heroProducts',
};

const DEFAULT_STALE_TIME = 5 * 60 * 1000;
const DEFAULT_GC_TIME = 10 * 60 * 1000;
const HERO_STALE_TIME = 10 * 60 * 1000;
const HERO_GC_TIME = 15 * 60 * 1000;

export const useProductsQuery = (options = {}) => {
    const {
        limit = 20,
        offset = 0,
        orderBy = 'created_at',
        ascending = false,
        enabled = true,
    } = options;

    return useQuery({
        queryKey: [QUERY_KEYS.products, { limit, offset, orderBy, ascending }],
        queryFn: () => productService.getAll({ limit, offset, orderBy, ascending }),
        enabled,
        staleTime: DEFAULT_STALE_TIME,
        gcTime: DEFAULT_GC_TIME,
    });
};

export const useProductQuery = (id, enabled = true) => {
    return useQuery({
        queryKey: [QUERY_KEYS.product, id],
        queryFn: () => productService.getById(id),
        enabled: enabled && Boolean(id),
        staleTime: DEFAULT_STALE_TIME,
    });
};

export const useHeroProductsQuery = (limit = 5) => {
    return useQuery({
        queryKey: [QUERY_KEYS.heroProducts, limit],
        queryFn: () => productService.getHeroProducts(limit),
        staleTime: HERO_STALE_TIME,
        gcTime: HERO_GC_TIME,
    });
};

export const useCreateProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.products] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.heroProducts] });
        },
    });
};

export const useUpdateProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => productService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.setQueryData([QUERY_KEYS.product, variables.id], data);
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.products] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.heroProducts] });
        },
    });
};

export const useDeleteProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productService.delete,
        onSuccess: (_, id) => {
            queryClient.removeQueries({ queryKey: [QUERY_KEYS.product, id] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.products] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.heroProducts] });
        },
    });
};
