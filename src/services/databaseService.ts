import type { Database } from '@/supabase/client';
import { supabase } from '@/supabase/client';

// Type aliases for easier use
type Tables = Database['public']['Tables'];
type User = Tables['users']['Row'];
type UserInsert = Tables['users']['Insert'];
type UserUpdate = Tables['users']['Update'];
type Offer = Tables['shopping_offers']['Row'];
type OfferInsert = Tables['shopping_offers']['Insert'];
type OfferUpdate = Tables['shopping_offers']['Update'];
type Request = Tables['shopping_requests']['Row'];
type RequestInsert = Tables['shopping_requests']['Insert'];
type RequestUpdate = Tables['shopping_requests']['Update'];
type Order = Tables['orders']['Row'];
type OrderInsert = Tables['orders']['Insert'];
type OrderUpdate = Tables['orders']['Update'];
type Message = Tables['messages']['Row'];
type MessageInsert = Tables['messages']['Insert'];
type MessageUpdate = Tables['messages']['Update'];

export interface DatabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

export interface DatabaseResponse<T> {
  data: T | null;
  error: DatabaseError | null;
  count?: number;
}

class DatabaseService {
  // Users table operations
  async getUsers(
    limit?: number,
    offset?: number
  ): Promise<DatabaseResponse<User[]>> {
    let query = supabase.from('users').select('*');

    if (limit) query = query.limit(limit);
    if (offset)
      query = query.range(offset, offset + (limit || 10) - 1);

    const { data, error, count } = await query;
    return { data, error, count: count === null ? undefined : count };
  }

  async getUserById(id: string): Promise<DatabaseResponse<User>> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  }

  async getUserByEmail(
    email: string
  ): Promise<DatabaseResponse<User>> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    return { data, error };
  }

  async createUser(
    user: UserInsert
  ): Promise<DatabaseResponse<User>> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();

    return { data, error };
  }

  async updateUser(
    id: string,
    updates: UserUpdate
  ): Promise<DatabaseResponse<User>> {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  async deleteUser(id: string): Promise<DatabaseResponse<null>> {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    return { data, error };
  }

  // Shopping offers operations
  async getOffers(filters?: {
    category?: string;
    location?: string;
    priceMin?: number;
    priceMax?: number;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<DatabaseResponse<Offer[]>> {
    let query = supabase.from('shopping_offers').select('*');

    if (filters?.category)
      query = query.eq('category', filters.category);
    if (filters?.location)
      query = query.ilike('location', `%${filters.location}%`);
    if (filters?.priceMin)
      query = query.gte('price', filters.priceMin);
    if (filters?.priceMax)
      query = query.lte('price', filters.priceMax);
    if (filters?.status) query = query.eq('status', filters.status);

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) query = query.limit(filters.limit);
    if (filters?.offset)
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );

    const { data, error, count } = await query;
    return { data, error, count: count === null ? undefined : count };
  }

  async getOfferById(id: string): Promise<DatabaseResponse<Offer>> {
    const { data, error } = await supabase
      .from('shopping_offers')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  }

  async getOffersByAgent(
    agentId: string
  ): Promise<DatabaseResponse<Offer[]>> {
    const { data, error } = await supabase
      .from('shopping_offers')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    return { data, error };
  }

  async createOffer(
    offer: OfferInsert
  ): Promise<DatabaseResponse<Offer>> {
    const { data, error } = await supabase
      .from('shopping_offers')
      .insert([offer])
      .select()
      .single();

    return { data, error };
  }

  async updateOffer(
    id: string,
    updates: OfferUpdate
  ): Promise<DatabaseResponse<Offer>> {
    const { data, error } = await supabase
      .from('shopping_offers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  async deleteOffer(id: string): Promise<DatabaseResponse<null>> {
    const { data, error } = await supabase
      .from('shopping_offers')
      .delete()
      .eq('id', id);

    return { data, error };
  }

  // Shopping requests operations
  async getRequests(filters?: {
    category?: string;
    location?: string;
    budgetMin?: number;
    budgetMax?: number;
    urgency?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<DatabaseResponse<Request[]>> {
    let query = supabase.from('shopping_requests').select('*');

    if (filters?.category)
      query = query.eq('category', filters.category);
    if (filters?.location)
      query = query.ilike('target_location', `%${filters.location}%`);
    if (filters?.urgency)
      query = query.eq('urgency', filters.urgency);
    if (filters?.status) query = query.eq('status', filters.status);

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) query = query.limit(filters.limit);
    if (filters?.offset)
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );

    const { data, error, count } = await query;
    return { data, error, count: count === null ? undefined : count };
  }

  async getRequestById(
    id: string
  ): Promise<DatabaseResponse<Request>> {
    const { data, error } = await supabase
      .from('shopping_requests')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  }

  async getRequestsByUser(
    userId: string
  ): Promise<DatabaseResponse<Request[]>> {
    const { data, error } = await supabase
      .from('shopping_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  }

  async createRequest(
    request: RequestInsert
  ): Promise<DatabaseResponse<Request>> {
    const { data, error } = await supabase
      .from('shopping_requests')
      .insert([request])
      .select()
      .single();

    return { data, error };
  }

  async updateRequest(
    id: string,
    updates: RequestUpdate
  ): Promise<DatabaseResponse<Request>> {
    const { data, error } = await supabase
      .from('shopping_requests')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  async deleteRequest(id: string): Promise<DatabaseResponse<null>> {
    const { data, error } = await supabase
      .from('shopping_requests')
      .delete()
      .eq('id', id);

    return { data, error };
  }

  // Orders operations
  async getOrders(filters?: {
    clientId?: string;
    agentId?: string;
    status?: string;
    paymentStatus?: string;
    limit?: number;
    offset?: number;
  }): Promise<DatabaseResponse<Order[]>> {
    let query = supabase.from('orders').select('*');

    if (filters?.clientId)
      query = query.eq('client_id', filters.clientId);
    if (filters?.agentId)
      query = query.eq('agent_id', filters.agentId);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.paymentStatus)
      query = query.eq('payment_status', filters.paymentStatus);

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) query = query.limit(filters.limit);
    if (filters?.offset)
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );

    const { data, error, count } = await query;
    return { data, error, count: count === null ? undefined : count };
  }

  async getOrderById(id: string): Promise<DatabaseResponse<Order>> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  }

  async createOrder(
    order: OrderInsert
  ): Promise<DatabaseResponse<Order>> {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    return { data, error };
  }

  async updateOrder(
    id: string,
    updates: OrderUpdate
  ): Promise<DatabaseResponse<Order>> {
    const { data, error } = await supabase
      .from('orders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  async deleteOrder(id: string): Promise<DatabaseResponse<null>> {
    const { data, error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    return { data, error };
  }

  // Messages operations
  async getMessages(filters: {
    userId: string;
    limit?: number;
    offset?: number;
  }): Promise<DatabaseResponse<Message[]>> {
    let query = supabase
      .from('messages')
      .select('*')
      .or(
        `sender_id.eq.${filters.userId},recipient_id.eq.${filters.userId}`
      )
      .order('created_at', { ascending: false });

    if (filters.limit) query = query.limit(filters.limit);
    if (filters.offset)
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );

    const { data, error, count } = await query;
    return { data, error, count: count === null ? undefined : count };
  }

  async getConversation(
    userId1: string,
    userId2: string
  ): Promise<DatabaseResponse<Message[]>> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1})`
      )
      .order('created_at', { ascending: true });

    return { data, error };
  }

  async sendMessage(
    message: MessageInsert
  ): Promise<DatabaseResponse<Message>> {
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()
      .single();

    return { data, error };
  }

  async markMessageAsRead(
    id: string
  ): Promise<DatabaseResponse<Message>> {
    const { data, error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  async markConversationAsRead(
    userId: string,
    otherUserId: string
  ): Promise<DatabaseResponse<Message[]>> {
    const { data, error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', otherUserId)
      .eq('recipient_id', userId)
      .eq('read', false)
      .select();

    return { data, error };
  }

  // Search operations
  async searchOffers(
    searchTerm: string,
    filters?: {
      category?: string;
      location?: string;
      priceMin?: number;
      priceMax?: number;
      limit?: number;
    }
  ): Promise<DatabaseResponse<Offer[]>> {
    let query = supabase
      .from('shopping_offers')
      .select('*')
      .or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
      )
      .eq('status', 'active');

    if (filters?.category)
      query = query.eq('category', filters.category);
    if (filters?.location)
      query = query.ilike('location', `%${filters.location}%`);
    if (filters?.priceMin)
      query = query.gte('price', filters.priceMin);
    if (filters?.priceMax)
      query = query.lte('price', filters.priceMax);

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    return { data, error };
  }

  async searchRequests(
    searchTerm: string,
    filters?: {
      category?: string;
      location?: string;
      urgency?: string;
      limit?: number;
    }
  ): Promise<DatabaseResponse<Request[]>> {
    let query = supabase
      .from('shopping_requests')
      .select('*')
      .or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
      )
      .eq('status', 'active');

    if (filters?.category)
      query = query.eq('category', filters.category);
    if (filters?.location)
      query = query.ilike('target_location', `%${filters.location}%`);
    if (filters?.urgency)
      query = query.eq('urgency', filters.urgency);

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    return { data, error };
  }

  // Analytics operations
  async getAnalytics(): Promise<
    DatabaseResponse<{
      totalUsers: number;
      totalOffers: number;
      totalRequests: number;
      totalOrders: number;
      recentActivity: any[];
    }>
  > {
    try {
      const [users, offers, requests, orders] = await Promise.all([
        supabase
          .from('users')
          .select('*', { count: 'exact', head: true }),
        supabase
          .from('shopping_offers')
          .select('*', { count: 'exact', head: true }),
        supabase
          .from('shopping_requests')
          .select('*', { count: 'exact', head: true }),
        supabase
          .from('orders')
          .select('*', { count: 'exact', head: true }),
      ]);

      // Get recent activity
      const { data: recentOffers } = await supabase
        .from('shopping_offers')
        .select('id, title, created_at, agent_name')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentRequests } = await supabase
        .from('shopping_requests')
        .select('id, title, created_at, user_name')
        .order('created_at', { ascending: false })
        .limit(5);

      const recentActivity = [
        ...(recentOffers || []).map((item) => ({
          ...item,
          type: 'offer',
        })),
        ...(recentRequests || []).map((item) => ({
          ...item,
          type: 'request',
        })),
      ]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )
        .slice(0, 10);

      const data = {
        totalUsers: users.count || 0,
        totalOffers: offers.count || 0,
        totalRequests: requests.count || 0,
        totalOrders: orders.count || 0,
        recentActivity,
      };

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // Utility operations
  async checkTableExists(tableName: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(tableName as any)
        .select('*', { count: 'exact', head: true })
        .limit(1);

      return !error;
    } catch {
      return false;
    }
  }

  async healthCheck(): Promise<
    DatabaseResponse<{ status: string; timestamp: string }>
  > {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      if (error) {
        return { data: null, error };
      }

      return {
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
        },
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message },
      };
    }
  }
}

// Create and export singleton instance
export const databaseService = new DatabaseService();

// Export types for convenience
export type {
  Message,
  MessageInsert,
  MessageUpdate,
  Offer,
  OfferInsert,
  OfferUpdate,
  Order,
  OrderInsert,
  OrderUpdate,
  Request,
  RequestInsert,
  RequestUpdate,
  User,
  UserInsert,
  UserUpdate,
};
