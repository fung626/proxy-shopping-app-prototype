import { useWishlistStore } from '@/store/zustand';
import { useCallback } from 'react';

/**
 * Custom hook for managing favorites functionality
 * Provides easy-to-use methods for handling favorites in components
 *
 * Note: This now works with the simplified wishlist store that only stores IDs
 */
export const useFavorites = () => {
  const {
    wishlist,
    toggleWishlistItem,
    addWishlistItem,
    removeWishlistItem,
    isWishlistItem,
    getWishlist,
    clearWishlist,
    getWishlistCount,
  } = useWishlistStore();

  /**
   * Toggle favorite status for an item by ID
   * @param id - The item ID
   * @param type - The item type (required for adding new items)
   */
  const toggleFavorite = useCallback(
    (id: string, type?: 'offer' | 'request') => {
      toggleWishlistItem(id, type);
    },
    [toggleWishlistItem]
  );

  /**
   * Add item to favorites by ID
   * @param id - The item ID
   * @param type - The item type
   */
  const addFavorite = useCallback(
    (id: string, type: 'offer' | 'request') => {
      addWishlistItem({ id, type });
    },
    [addWishlistItem]
  );

  /**
   * Remove item from favorites by ID
   * @param id - The item ID
   */
  const removeFavorite = useCallback(
    (id: string) => {
      removeWishlistItem(id);
    },
    [removeWishlistItem]
  );

  /**
   * Check if an item is favorited
   * @param id - The item ID
   * @returns boolean indicating if the item is favorited
   */
  const isFavorite = useCallback(
    (id: string) => {
      return isWishlistItem(id);
    },
    [isWishlistItem]
  );

  /**
   * Get all favorite item IDs
   * @returns Array of favorite item IDs
   */
  const getFavorites = useCallback(() => {
    return getWishlist();
  }, [getWishlist]);

  return {
    // State
    favorites: wishlist,

    // Actions
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isFavorite,

    // Getters
    getFavorites,
    getFavoriteCount: getWishlistCount,

    // Utilities
    clearFavorites: clearWishlist,
  };
};
