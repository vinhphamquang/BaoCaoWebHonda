import { useState, useEffect, useCallback, useMemo } from 'react';

// Generic API hook state
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Generic API hook return type
export interface UseApiReturn<T> extends ApiState<T> {
  refetch: () => Promise<void>;
  reset: () => void;
}

// Generic API hook
export function useApi<T>(
  apiFunction: () => Promise<T>,
  dependencies: unknown[] = [],
  immediate: boolean = true
): UseApiReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  // Memoize dependencies để tránh infinite re-render
  const depsString = JSON.stringify(dependencies);
  const memoizedDeps = useMemo(() => dependencies, [depsString]);

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction();
      setState({
        data: result,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra',
      });
    }
  }, [apiFunction, memoizedDeps]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    refetch: execute,
    reset,
  };
}

// Mutation hook for API calls that modify data
export interface UseMutationReturn<T, P> {
  mutate: (params: P) => Promise<T>;
  data: T | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export function useMutation<T, P = void>(
  apiFunction: (params: P) => Promise<T>
): UseMutationReturn<T, P> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (params: P): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction(params);
      setState({
        data: result,
        loading: false,
        error: null,
      });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    mutate,
    ...state,
    reset,
  };
}

// Paginated API hook
export interface PaginatedApiState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
}

export interface UsePaginatedApiReturn<T> extends PaginatedApiState<T> {
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  reset: () => void;
}

export function usePaginatedApi<T>(
  apiFunction: (params: { page: number; limit: number; [key: string]: unknown }) => Promise<{
    data: T[];
    pagination: PaginatedApiState<T>['pagination'];
  }>,
  params: { limit?: number; [key: string]: unknown } = {},
  immediate: boolean = true
): UsePaginatedApiReturn<T> {
  const [state, setState] = useState<PaginatedApiState<T>>({
    data: [],
    loading: immediate,
    error: null,
    pagination: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const limit = params.limit || 10;

  // Memoize params để tránh infinite re-render
  const memoizedParams = useMemo(() => params, [JSON.stringify(params)]);

  const execute = useCallback(async (page: number = 1, append: boolean = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction({ ...memoizedParams, page, limit });
      setState(prev => ({
        data: append ? [...prev.data, ...result.data] : result.data,
        loading: false,
        error: null,
        pagination: result.pagination,
      }));
      setCurrentPage(page);
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra',
      }));
    }
  }, [apiFunction, memoizedParams, limit]);

  const refetch = useCallback(() => execute(currentPage), [execute, currentPage]);
  
  const loadMore = useCallback(async () => {
    if (state.pagination?.hasNext) {
      await execute(currentPage + 1, true);
    }
  }, [execute, currentPage, state.pagination?.hasNext]);

  const goToPage = useCallback(async (page: number) => {
    await execute(page);
  }, [execute]);

  const reset = useCallback(() => {
    setState({
      data: [],
      loading: false,
      error: null,
      pagination: null,
    });
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute(1);
    }
  }, [execute, immediate]);

  return {
    ...state,
    refetch,
    loadMore,
    goToPage,
    reset,
  };
}

// Optimistic update hook
export function useOptimisticUpdate<T>(
  initialData: T[],
  keyField: keyof T = '_id' as keyof T
) {
  const [data, setData] = useState<T[]>(initialData);

  const addItem = useCallback((item: T) => {
    setData(prev => [...prev, item]);
  }, []);

  const updateItem = useCallback((id: unknown, updates: Partial<T>) => {
    setData(prev => prev.map(item =>
      item[keyField] === id ? { ...item, ...updates } : item
    ));
  }, [keyField]);

  const removeItem = useCallback((id: unknown) => {
    setData(prev => prev.filter(item => item[keyField] !== id));
  }, [keyField]);

  const replaceData = useCallback((newData: T[]) => {
    setData(newData);
  }, []);

  return {
    data,
    addItem,
    updateItem,
    removeItem,
    replaceData,
  };
}

export default useApi;
