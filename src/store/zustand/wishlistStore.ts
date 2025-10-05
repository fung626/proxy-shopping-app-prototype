import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
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
  addedAt: string;
  agentName?: string;
  clientName?: string;
  rating?: number;
  reviews?: number;
  estimatedDelivery?: string;
  bids?: number;
  deadline?: string;
}

interface WishlistState {
  wishlist: Set<string>;
  wishlistItems: Map<string, WishlistItem>;
  addWishlistItem: (item: WishlistItem) => void;
  removeWishlistItem: (id: string) => void;
  toggleWishlistItem: (id: string, item?: WishlistItem) => void;
  isWishlistItem: (id: string) => boolean;
  getWishlist: () => WishlistItem[];
  getWishlistByType: (type: 'offer' | 'request') => WishlistItem[];
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: new Set<string>(),
      wishlistItems: new Map<string, WishlistItem>(),
      addWishlistItem: (item: WishlistItem) => {
        const { wishlist, wishlistItems } = get();
        const newWishlist = new Set(wishlist);
        const newWishlistItems = new Map(wishlistItems);
        newWishlist.add(item.id);
        newWishlistItems.set(item.id, {
          ...item,
          addedAt: new Date().toISOString(),
        });
        set({
          wishlist: newWishlist,
          wishlistItems: newWishlistItems,
        });
      },
      removeWishlistItem: (id: string) => {
        const { wishlist, wishlistItems } = get();
        const newWishlist = new Set(wishlist);
        const newWishlistItems = new Map(wishlistItems);

        newWishlist.delete(id);
        newWishlistItems.delete(id);

        set({
          wishlist: newWishlist,
          wishlistItems: newWishlistItems,
        });
      },
      toggleWishlistItem: (id: string, item?: WishlistItem) => {
        const {
          wishlist,
          wishlistItems,
          addWishlistItem,
          removeWishlistItem,
        } = get();
        if (wishlist.has(id)) {
          removeWishlistItem(id);
        } else {
          const newItem = item || wishlistItems.get(id);
          if (newItem) {
            addWishlistItem(newItem);
          }
        }
      },
      isWishlistItem: (id: string) => {
        return get().wishlist.has(id);
      },
      getWishlist: () => {
        const { wishlistItems } = get();
        return Array.from(wishlistItems.values()).sort(
          (a, b) =>
            new Date(b.addedAt).getTime() -
            new Date(a.addedAt).getTime()
        );
      },
      getWishlistByType: (type: 'offer' | 'request') => {
        const { wishlistItems } = get();
        return Array.from(wishlistItems.values())
          .filter((item) => item.type === type)
          .sort(
            (a, b) =>
              new Date(b.addedAt).getTime() -
              new Date(a.addedAt).getTime()
          );
      },
      clearWishlist: () => {
        set({
          wishlist: new Set<string>(),
          wishlistItems: new Map<string, WishlistItem>(),
        });
      },
      getWishlistCount: () => {
        return get().wishlist.size;
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state: WishlistState) => ({
        wishlist: Array.from(state.wishlist),
        wishlistItems: Array.from(state.wishlistItems.entries()),
      }),
      merge: (persistedState: any, currentState: WishlistState) => ({
        ...currentState,
        wishlist: new Set(persistedState?.wishlist || []),
        wishlistItems: new Map(persistedState?.wishlistItems || []),
      }),
    }
  )
);
