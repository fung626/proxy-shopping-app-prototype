import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  type: 'offer' | 'request';
}

interface WishlistState {
  wishlist: Set<WishlistItem>;
  addWishlistItem: (item: WishlistItem) => void;
  removeWishlistItem: (id: string) => void;
  toggleWishlistItem: (
    id: string,
    type?: 'offer' | 'request'
  ) => void;
  isWishlistItem: (id: string) => boolean;
  getWishlist: () => WishlistItem[];
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: new Set<WishlistItem>(),
      addWishlistItem: (item: WishlistItem) => {
        const { wishlist } = get();
        const newWishlist = new Set(wishlist);
        newWishlist.add(item);
        set({ wishlist: newWishlist });
      },
      removeWishlistItem: (id: string) => {
        const { wishlist } = get();
        const newWishlist = new Set(wishlist);
        // Find and remove the item with matching id
        for (const item of newWishlist) {
          if (item.id === id) {
            newWishlist.delete(item);
            break;
          }
        }
        set({ wishlist: newWishlist });
      },
      toggleWishlistItem: (
        id: string,
        type?: 'offer' | 'request'
      ) => {
        const { wishlist, addWishlistItem, removeWishlistItem } =
          get();
        // Check if item exists by id
        const existingItem = Array.from(wishlist).find(
          (item) => item.id === id
        );

        if (existingItem) {
          removeWishlistItem(id);
        } else if (type) {
          addWishlistItem({ id, type });
        }
      },
      isWishlistItem: (id: string) => {
        const { wishlist } = get();
        return Array.from(wishlist).some((item) => item.id === id);
      },
      getWishlist: () => {
        const { wishlist } = get();
        return Array.from(wishlist);
      },
      clearWishlist: () => {
        set({ wishlist: new Set<WishlistItem>() });
      },
      getWishlistCount: () => {
        return get().wishlist.size;
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state: WishlistState) => ({
        wishlist: Array.from(state.wishlist),
      }),
      merge: (persistedState: any, currentState: WishlistState) => ({
        ...currentState,
        wishlist: new Set(persistedState?.wishlist || []),
      }),
    }
  )
);
