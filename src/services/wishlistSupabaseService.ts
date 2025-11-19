import { supabase } from '@/supabase/client';
import {
  SupabaseOffer,
  offersSupabaseService,
} from './offersSupabaseService';
import {
  SupabaseRequest,
  requestsSupabaseService,
} from './requestsSupabaseService';

export interface SupabaseWishlistItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'offer' | 'request';
  request?: SupabaseRequest;
  offer?: SupabaseOffer;
  created_at: string;
}

export class WishlistSupabaseService {
  // Get wishlist items for a user
  async getWishlistByUser(
    userId: string
  ): Promise<SupabaseWishlistItem[]> {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching wishlist:', error);
        throw error;
      }

      const rows: any[] = data || [];

      // Collect ids by type
      const offerIds: string[] = [];
      const requestIds: string[] = [];
      for (const r of rows) {
        if (r.item_type === 'offer') offerIds.push(r.item_id);
        if (r.item_type === 'request') requestIds.push(r.item_id);
      }

      // Batch fetch offers and requests
      let offers: SupabaseOffer[] = [];
      let requests: SupabaseRequest[] = [];
      try {
        if (offerIds.length > 0) {
          offers = await offersSupabaseService.getOfferByIds(
            offerIds
          );
        }
      } catch (err) {
        console.warn('Failed to fetch offers for wishlist:', err);
      }
      try {
        if (requestIds.length > 0) {
          requests = await requestsSupabaseService.getRequesByIds(
            requestIds
          );
        }
      } catch (err) {
        console.warn('Failed to fetch requests for wishlist:', err);
      }

      // Map rows to enriched items
      const enriched: SupabaseWishlistItem[] = rows.map((r) => {
        const item: SupabaseWishlistItem = {
          id: r.id,
          user_id: r.user_id,
          item_id: r.item_id,
          item_type: r.item_type,
          created_at: r.created_at,
        } as SupabaseWishlistItem;

        if (r.item_type === 'offer') {
          item.offer = offers.find((o) => o.id === r.item_id);
        } else if (r.item_type === 'request') {
          item.request = requests.find((q) => q.id === r.item_id);
        }

        return item;
      });

      return enriched;
    } catch (error) {
      console.error('getWishlistByUser error:', error);
      throw error;
    }
  }

  async isItemWishlisted(
    userId: string,
    itemId: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', userId)
        .eq('item_id', itemId)
        .limit(1)
        .single();

      if (error && (error as any).code !== 'PGRST116') {
        // PGRST116 is 'Result contains 0 rows' for single() in some setups
        // but we'll just return false when not found
        if ((error as any).code === 'PGRST116') return false;
        console.error('isItemWishlisted error:', error);
        throw error;
      }

      return !!data;
    } catch (error) {
      return false;
    }
  }

  // Add wishlist item
  async addWishlistItem(
    userId: string,
    itemId: string,
    itemType: 'offer' | 'request'
  ) {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .insert([
          {
            user_id: userId,
            item_id: itemId,
            item_type: itemType,
          },
        ]);

      if (error) {
        // If duplicate due to race, ignore
        if ((error as any)?.code === '23505') {
          return true;
        }
        console.error('Error adding wishlist item:', error);
        throw error;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('addWishlistItem error:', error);
      throw error;
    }
  }

  // Remove wishlist item
  async removeWishlistItem(userId: string, itemId: string) {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('item_id', itemId);

      if (error) {
        console.error('Error removing wishlist item:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('removeWishlistItem error:', error);
      throw error;
    }
  }
}

export const wishlistSupabaseService = new WishlistSupabaseService();
