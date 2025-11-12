import { supabase } from '@/supabase/client';

export interface SupabaseOffer {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  price: number;
  currency: string;
  location?: string;
  shopping_location?: string;
  available_quantity: number;
  estimated_delivery?: { start: number; end: number; type: string };
  specifications?: string[];
  tags?: string[];
  delivery_options?: string[];
  images?: string[];
  created_at: string;
  updated_at: string;
  status?: string;
  processing_time?: string;
  agent_id?: string;
  availability?: string;
  agent_details?: {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    since: string;
    verified: boolean;
    image: string;
    totalOrders: number;
    successRate: number;
  };
}

export interface OfferFilters {
  name?: string;
  description?: string;
  category?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  status?: string;
  limit?: number;
  offset?: number;
}

export class OffersSupabaseService {
  // Get all offers with optional filters
  async getOffers(filters?: OfferFilters): Promise<SupabaseOffer[]> {
    try {
      let query = supabase.from('offers').select('*');

      // Apply filters
      if (filters?.name) {
        query = query.ilike('title', `%${filters.name}%`);
      }
      if (filters?.description) {
        query = query.ilike(
          'description',
          `%${filters.description}%`
        );
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters?.priceMin) {
        query = query.gte('price', filters.priceMin);
      }
      if (filters?.priceMax) {
        query = query.lte('price', filters.priceMax);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      // Apply pagination
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 10) - 1
        );
      }

      // Order by creation date (newest first)
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching offers:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getOffers:', error);
      throw error;
    }
  }

  // Get trending/featured offers (limited)
  async getTrendingOffers(
    limit: number = 4
  ): Promise<SupabaseOffer[]> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .limit(limit)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trending offers:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTrendingOffers:', error);
      throw error;
    }
  }

  // Get offer by ID
  async getOfferById(offerId: string): Promise<SupabaseOffer | null> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('id', offerId)
        .single();

      if (error) {
        console.error('Error fetching offer:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getOfferById:', error);
      throw error;
    }
  }

  async getOfferByIds(offerIds: string[]): Promise<SupabaseOffer[]> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .in('id', offerIds);

      if (error) {
        console.error('Error fetching offers by IDs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getOfferByIds:', error);
      throw error;
    }
  }

  // Create new offer
  async createOffer(
    offerData: Partial<SupabaseOffer>
  ): Promise<SupabaseOffer> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .insert([offerData])
        .select()
        .single();

      if (error) {
        console.error('Error creating offer:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createOffer:', error);
      throw error;
    }
  }

  // Update offer
  async updateOffer(
    offerId: string,
    offerData: Partial<SupabaseOffer>
  ): Promise<SupabaseOffer> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .update({
          ...offerData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', offerId)
        .select()
        .single();

      if (error) {
        console.error('Error updating offer:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateOffer:', error);
      throw error;
    }
  }

  // Delete offer
  async deleteOffer(offerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId);

      if (error) {
        console.error('Error deleting offer:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteOffer:', error);
      throw error;
    }
  }

  // Get offers by category
  async getOffersByCategory(
    category: string,
    limit?: number
  ): Promise<SupabaseOffer[]> {
    try {
      let query = supabase
        .from('offers')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching offers by category:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getOffersByCategory:', error);
      throw error;
    }
  }

  // Get offers by user
  async getOffersByUser(userId: string): Promise<SupabaseOffer[]> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching offers by user:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getOffersByUser:', error);
      throw error;
    }
  }

  // Search offers
  async searchOffers(
    query: string,
    filters?: OfferFilters
  ): Promise<SupabaseOffer[]> {
    try {
      let supabaseQuery = supabase
        .from('offers')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

      // Apply additional filters
      if (filters?.category) {
        supabaseQuery = supabaseQuery.eq(
          'category',
          filters.category
        );
      }
      if (filters?.location) {
        supabaseQuery = supabaseQuery.ilike(
          'location',
          `%${filters.location}%`
        );
      }
      if (filters?.priceMin) {
        supabaseQuery = supabaseQuery.gte('price', filters.priceMin);
      }
      if (filters?.priceMax) {
        supabaseQuery = supabaseQuery.lte('price', filters.priceMax);
      }

      if (filters?.limit) {
        supabaseQuery = supabaseQuery.limit(filters.limit);
      }

      supabaseQuery = supabaseQuery.order('created_at', {
        ascending: false,
      });

      const { data, error } = await supabaseQuery;

      if (error) {
        console.error('Error searching offers:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchOffers:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export default new OffersSupabaseService();

// Create and export singleton instance
export const offersSupabaseService = new OffersSupabaseService();
