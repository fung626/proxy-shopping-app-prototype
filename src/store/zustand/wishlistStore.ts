import { authSupabaseService } from '@/services/authSupabaseService';
import { wishlistSupabaseService } from '@/services/wishlistSupabaseService';
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
  // Optional remote sync helpers
  syncWithServer: () => Promise<void>;
  fetchRemoteWishlist: () => Promise<void>;
  addRemoteItem: (
    id: string,
    type: 'offer' | 'request'
  ) => Promise<void>;
  removeRemoteItem: (id: string) => Promise<void>;
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
        (async () => {
          try {
            const { data: userData } =
              await authSupabaseService.getCurrentUser();
            const user = userData.user;
            if (!user) return;
            await wishlistSupabaseService.addWishlistItem(
              user.id,
              item.id,
              item.type
            );
          } catch (err) {
            console.warn('Failed to add remote wishlist item', err);
          }
        })();
      },
      syncWithServer: async () => {
        try {
          const { data: userData } =
            await authSupabaseService.getCurrentUser();
          const user = userData.user;
          if (!user) return;
          const remote =
            await wishlistSupabaseService.getWishlistByUser(user.id);
          const remoteItems = new Set<WishlistItem>(
            (remote || []).map((r) => ({
              id: r.item_id,
              type: r.item_type,
            }))
          );
          set({ wishlist: remoteItems });
        } catch (err) {
          console.warn('Failed to sync wishlist with server', err);
        }
      },
      fetchRemoteWishlist: async () => {
        await get().syncWithServer();
      },
      addRemoteItem: async (
        id: string,
        type: 'offer' | 'request'
      ) => {
        try {
          const { data: userData } =
            await authSupabaseService.getCurrentUser();
          const user = userData.user;
          if (!user) return;
          await wishlistSupabaseService.addWishlistItem(
            user.id,
            id,
            type
          );
        } catch (err) {
          console.warn('Failed to add remote wishlist item', err);
        }
      },
      removeRemoteItem: async (id: string) => {
        try {
          const { data: userData } =
            await authSupabaseService.getCurrentUser();
          const user = userData.user;
          if (!user) return;
          await wishlistSupabaseService.removeWishlistItem(
            user.id,
            id
          );
        } catch (err) {
          console.warn('Failed to remove remote wishlist item', err);
        }
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

        // Fire-and-forget remote removal
        (async () => {
          try {
            const { data: userData } =
              await authSupabaseService.getCurrentUser();
            const user = userData.user;
            if (!user) return;
            await wishlistSupabaseService.removeWishlistItem(
              user.id,
              id
            );
          } catch (err) {
            console.warn(
              'Failed to remove remote wishlist item',
              err
            );
          }
        })();
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
