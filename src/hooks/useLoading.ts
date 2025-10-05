import { useLoadingStore } from '@/store/zustand/loadingStore';
import { useEffect } from 'react';

/**
 * Hook for managing loading states with automatic cleanup
 * @param isLoading - Boolean indicating if loading should be active
 * @param key - Unique key for this loading instance (default: 'default')
 * @param message - Optional loading message to display
 */
export function useLoading(
  isLoading: boolean,
  key = 'default',
  message?: string
) {
  const { start, stop } = useLoadingStore();

  useEffect(() => {
    if (isLoading) {
      start(key, message);
    } else {
      stop(key);
    }

    return () => {
      stop(key);
    };
  }, [isLoading, key, message, start, stop]);
}

/**
 * Hook for managing async operations with loading states
 * @param asyncFn - Async function to execute
 * @param deps - Dependencies array (like useEffect)
 * @param key - Unique key for this loading instance
 * @param message - Optional loading message to display
 */
export function useAsyncWithLoading<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList,
  key = 'async-operation',
  message?: string
) {
  const { start, stop } = useLoadingStore();

  useEffect(() => {
    const execute = async () => {
      try {
        start(key, message);
        await asyncFn();
      } catch (error) {
        console.error('Async operation failed:', error);
        throw error;
      } finally {
        stop(key);
      }
    };

    execute();
  }, deps);
}
