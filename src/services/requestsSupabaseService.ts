import { RequestDetailsPageProps } from '@/pages/orders/RequestDetailsPage';
import { supabase } from '@/supabase/client';

export interface SupabaseRequest {
  id: string;
  user_id: string;
  user_name?: string;
  title: string;
  description?: string;
  specific_requirements?: string[];
  category?: string;
  budget_min?: number;
  budget_max?: number;
  currency?: string;
  product_origin?: string;
  designated_purchasing_location?: string;
  expected_delivery_location?: string;
  expected_delivery?: { start: string; end: string; unit: string };
  shipping_address?: any;
  delivery_method?: string;
  images?: string[];
  offers?: {
    user_id: string;
    user_name: string;
    created_at: string;
  }[];
  created_at: string;
  updated_at: string;
  status?: string;
  urgency?: string;
}

export interface RequestFilters {
  category?: string;
  location?: string;
  budgetMin?: number;
  budgetMax?: number;
  urgency?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export class RequestsSupabaseService {
  // Get all requests with optional filters
  async getRequests(
    filters?: RequestFilters
  ): Promise<SupabaseRequest[]> {
    try {
      let query = supabase.from('requests').select('*');

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.location) {
        query = query.or(
          `expected_delivery_location.ilike.%${filters.location}%,designated_purchasing_location.ilike.%${filters.location}%`
        );
      }
      if (filters?.budgetMin) {
        query = query.gte('budget_min', filters.budgetMin);
      }
      if (filters?.budgetMax) {
        query = query.lte('budget_max', filters.budgetMax);
      }
      if (filters?.urgency) {
        query = query.eq('urgency', filters.urgency);
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
        console.error('Error fetching requests:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRequests:', error);
      throw error;
    }
  }

  // Get trending/recent requests (limited)
  async getTrendingRequests(
    limit: number = 6
  ): Promise<SupabaseRequest[]> {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .limit(limit)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trending requests:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTrendingRequests:', error);
      throw error;
    }
  }

  // Get request by ID
  async getRequestById(
    requestId: string
  ): Promise<SupabaseRequest | null> {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (error) {
        console.error('Error fetching request:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getRequestById:', error);
      throw error;
    }
  }

  async getRequesByIds(
    requestIds: string[]
  ): Promise<SupabaseRequest[]> {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .in('id', requestIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests by IDs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRequesByIds:', error);
      throw error;
    }
  }

  // Create new request
  async createRequest(
    requestData: Partial<SupabaseRequest>
  ): Promise<SupabaseRequest> {
    try {
      const now = new Date().toISOString();

      const insertData = {
        user_id: requestData.user_id,
        user_name: requestData.user_name,
        title: requestData.title,
        description: requestData.description,
        specific_requirements:
          requestData.specific_requirements || [],
        category: requestData.category,
        budget_min: requestData.budget_min,
        budget_max: requestData.budget_max,
        currency: requestData.currency || 'USD',
        product_origin: requestData.product_origin,
        designated_purchasing_location:
          requestData.designated_purchasing_location,
        expected_delivery_location:
          requestData.expected_delivery_location,
        expected_delivery: requestData.expected_delivery,
        shipping_address: requestData.shipping_address,
        delivery_method: requestData.delivery_method || 'personal',
        images: requestData.images || [],
        created_at: now,
        updated_at: now,
        status: requestData.status || 'active',
        urgency: requestData.urgency || 'normal',
      };

      const { data, error } = await supabase
        .from('requests')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Error creating request:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createRequest:', error);
      throw error;
    }
  }

  // Update request
  async updateRequest(
    requestId: string,
    requestData: Partial<SupabaseRequest>
  ): Promise<SupabaseRequest> {
    try {
      const { data, error } = await supabase
        .from('requests')
        .update({
          ...requestData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) {
        console.error('Error updating request:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateRequest:', error);
      throw error;
    }
  }

  // Delete request
  async deleteRequest(requestId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', requestId);

      if (error) {
        console.error('Error deleting request:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteRequest:', error);
      throw error;
    }
  }

  // Get requests by category
  async getRequestsByCategory(
    category: string,
    limit?: number
  ): Promise<SupabaseRequest[]> {
    try {
      let query = supabase
        .from('requests')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching requests by category:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRequestsByCategory:', error);
      throw error;
    }
  }

  // Get requests by user
  async getRequestsByUser(
    userId: string
  ): Promise<SupabaseRequest[]> {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests by user:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRequestsByUser:', error);
      throw error;
    }
  }

  // Get urgent requests
  async getUrgentRequests(
    limit: number = 10
  ): Promise<SupabaseRequest[]> {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('urgency', 'urgent')
        .limit(limit)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching urgent requests:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUrgentRequests:', error);
      throw error;
    }
  }

  // Search requests
  async searchRequests(
    query: string,
    filters?: RequestFilters
  ): Promise<SupabaseRequest[]> {
    try {
      let supabaseQuery = supabase
        .from('requests')
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
        supabaseQuery = supabaseQuery.or(
          `expected_delivery_location.ilike.%${filters.location}%,designated_purchasing_location.ilike.%${filters.location}%`
        );
      }
      if (filters?.budgetMin) {
        supabaseQuery = supabaseQuery.gte(
          'budget_min',
          filters.budgetMin
        );
      }
      if (filters?.budgetMax) {
        supabaseQuery = supabaseQuery.lte(
          'budget_max',
          filters.budgetMax
        );
      }
      if (filters?.urgency) {
        supabaseQuery = supabaseQuery.eq('urgency', filters.urgency);
      }

      if (filters?.limit) {
        supabaseQuery = supabaseQuery.limit(filters.limit);
      }

      supabaseQuery = supabaseQuery.order('created_at', {
        ascending: false,
      });

      const { data, error } = await supabaseQuery;

      if (error) {
        console.error('Error searching requests:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchRequests:', error);
      throw error;
    }
  }
}

export const requestsSupabaseService = new RequestsSupabaseService();
export async function getRequestById(
  requestId: string
): Promise<RequestDetailsPageProps['request'] | null> {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (error) {
      console.error('Error fetching request:', error);
      throw error;
    }

    // Map SupabaseRequest to RequestDetailsPageProps['request']
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      status: data.status || 'Active',
      step: 1, // Default step; adjust based on your logic
      role: 'client', // Default role; adjust based on your logic
      agent: data.offers?.[0]?.user_name,
      client: data.user_name,
      location: data.expected_delivery_location || '',
      createdDate: data.created_at,
      category: data.category || '',
      deliveryMethod: data.delivery_method as 'ship' | 'personal',
      budget: data.budget_min
        ? `${data.budget_min}-${data.budget_max}`
        : undefined,
      timeline: data.expected_delivery?.start,
      requirements: data.specific_requirements,
      images: data.images,
      isPurchased: false, // Default value; adjust based on your logic
      isShipped: false, // Default value; adjust based on your logic
      purchaseDate: undefined,
      shippingDate: undefined,
      trackingNumber: undefined,
    };
  } catch (error) {
    console.error('Error in getRequestById:', error);
    throw error;
  }
}
