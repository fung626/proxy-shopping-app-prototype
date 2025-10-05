import { useWishlistStore } from '@/store/zustand';
import { useCallback } from 'react';

interface FavoriteItem {
  id: string;
  type: 'offer' | 'request';
  title: string;
  price?: number;
  currency?: string;
  budget_min?: number;
  budget_max?: number;
  location?: string;
  category?: string;
  images?: string[];
  addedAt?: string;
}

/**
 * Custom hook for managing favorites functionality
 * Provides easy-to-use methods for handling favorites in components
 */
export const useFavorites = () => {
  const {
    favorites,
    toggleFavorite: storeToggleFavorite,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavorites,
    getFavoritesByType,
    clearFavorites,
    getFavoriteCount,
  } = useWishlistStore();

  /**
   * Toggle favorite status for an item
   * @param id - The item ID
   * @param item - The item data (required when adding to favorites)
   */
  const toggleFavorite = useCallback(
    (id: string, item?: FavoriteItem) => {
      if (item) {
        storeToggleFavorite(id, {
          ...item,
          addedAt: new Date().toISOString(),
        });
      } else {
        storeToggleFavorite(id);
      }
    },
    [storeToggleFavorite]
  );

  /**
   * Check if an item is favorited
   * @param id - The item ID
   * @returns boolean indicating if the item is favorited
   */
  const checkIsFavorite = useCallback(
    (id: string) => {
      return isFavorite(id);
    },
    [isFavorite]
  );

  return {
    // State
    favorites,

    // Actions
    toggleFavorite,
    addFavorite: (item: FavoriteItem) =>
      addFavorite({ ...item, addedAt: new Date().toISOString() }),
    removeFavorite,
    isFavorite: checkIsFavorite,

    // Getters
    getFavorites,
    getFavoritesByType,
    getFavoriteCount,

    // Utilities
    clearFavorites,
  };
};

export type { FavoriteItem };
