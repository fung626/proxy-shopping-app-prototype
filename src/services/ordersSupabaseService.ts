import { supabase } from '@/supabase/client';
import {
  CreateOrderRequest,
  DetailedOrder,
  Order,
  OrderFilters,
  OrderHistory,
  OrderItem,
  OrderStatistics,
  OrderStatus,
  SupabaseOrder,
  SupabaseOrderHistory,
  SupabaseOrderItem,
  UpdateOrderRequest,
} from '@/types/order';
import { RealtimeChannel } from '@supabase/supabase-js';

class OrdersSupabaseService {
  private orderSubscriptions: Map<string, RealtimeChannel> =
    new Map();

  // =====================================================
  // HELPER FUNCTIONS - Data Transformation
  // =====================================================

  /**
   * Transform Supabase order to client-side format
   */
  private transformOrder(supabaseOrder: SupabaseOrder): Order {
    return {
      id: supabaseOrder.id,
      orderNumber: supabaseOrder.order_number,
      clientUserId: supabaseOrder.client_user_id,
      agentUserId: supabaseOrder.agent_user_id,
      requestId: supabaseOrder.request_id || undefined,
      offerId: supabaseOrder.offer_id || undefined,
      status: supabaseOrder.status,
      totalAmount: supabaseOrder.total_amount,
      currency: supabaseOrder.currency,
      paymentStatus: supabaseOrder.payment_status,
      paymentMethod: supabaseOrder.payment_method || undefined,
      paymentTransactionId:
        supabaseOrder.payment_transaction_id || undefined,
      paidAt: supabaseOrder.paid_at || undefined,
      deliveryMethod: supabaseOrder.delivery_method,
      deliveryAddress: supabaseOrder.delivery_address,
      trackingNumber: supabaseOrder.tracking_number || undefined,
      estimatedDeliveryDate:
        supabaseOrder.estimated_delivery_date || undefined,
      actualDeliveryDate:
        supabaseOrder.actual_delivery_date || undefined,
      notes: supabaseOrder.notes || undefined,
      cancellationReason:
        supabaseOrder.cancellation_reason || undefined,
      refundAmount: supabaseOrder.refund_amount || undefined,
      refundReason: supabaseOrder.refund_reason || undefined,
      agentCommissionRate: supabaseOrder.agent_commission_rate,
      agentCommissionAmount:
        supabaseOrder.agent_commission_amount || undefined,
      metadata: supabaseOrder.metadata,
      createdAt: supabaseOrder.created_at,
      updatedAt: supabaseOrder.updated_at,
      cancelledAt: supabaseOrder.cancelled_at || undefined,
      completedAt: supabaseOrder.completed_at || undefined,
    };
  }

  /**
   * Transform Supabase order item to client-side format
   */
  private transformOrderItem(
    supabaseItem: SupabaseOrderItem
  ): OrderItem {
    return {
      id: supabaseItem.id,
      orderId: supabaseItem.order_id,
      productName: supabaseItem.product_name,
      productDescription:
        supabaseItem.product_description || undefined,
      productImageUrl: supabaseItem.product_image_url || undefined,
      quantity: supabaseItem.quantity,
      unitPrice: supabaseItem.unit_price,
      subtotal: supabaseItem.subtotal,
      offerId: supabaseItem.offer_id || undefined,
      specifications: supabaseItem.specifications,
      metadata: supabaseItem.metadata,
      createdAt: supabaseItem.created_at,
      updatedAt: supabaseItem.updated_at,
    };
  }

  /**
   * Transform Supabase order history to client-side format
   */
  private transformOrderHistory(
    supabaseHistory: SupabaseOrderHistory
  ): OrderHistory {
    return {
      id: supabaseHistory.id,
      orderId: supabaseHistory.order_id,
      status: supabaseHistory.status,
      previousStatus: supabaseHistory.previous_status || undefined,
      changedByUserId:
        supabaseHistory.changed_by_user_id || undefined,
      metadata: supabaseHistory.metadata,
      createdAt: supabaseHistory.created_at,
    };
  }

  // =====================================================
  // CREATE OPERATIONS
  // =====================================================

  /**
   * Create a new order with items
   */
  async createOrder(
    request: CreateOrderRequest
  ): Promise<DetailedOrder | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Calculate total amount
      const totalAmount = request.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );

      // Calculate agent commission
      const commissionRate = 10.0; // Default 10%
      const commissionAmount = (totalAmount * commissionRate) / 100;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          client_user_id: user.id,
          agent_user_id: request.agentUserId,
          request_id: request.requestId || null,
          offer_id: request.offerId || null,
          status: 'pending_payment',
          total_amount: totalAmount,
          currency: request.currency,
          payment_status: 'pending',
          payment_method: request.paymentMethod || null,
          delivery_method: request.deliveryMethod,
          delivery_address: request.deliveryAddress,
          notes: request.notes || null,
          agent_commission_rate: commissionRate,
          agent_commission_amount: commissionAmount,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const itemsToInsert = request.items.map((item) => ({
        order_id: order.id,
        product_name: item.productName,
        product_description: item.productDescription || null,
        product_image_url: item.productImageUrl || null,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.quantity * item.unitPrice,
        offer_id: item.offerId || null,
        specifications: item.specifications || {},
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert)
        .select();

      if (itemsError) throw itemsError;

      // Fetch complete order details
      return await this.getOrderById(order.id);
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  // =====================================================
  // READ OPERATIONS
  // =====================================================

  /**
   * Get a specific order by ID with full details
   */
  async getOrderById(orderId: string): Promise<DetailedOrder | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      // Get order items
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      // Get client info
      const { data: client, error: clientError } = await supabase
        .from('users')
        .select('*')
        .eq('id', order.client_user_id)
        .single();

      if (clientError) throw clientError;

      // Get agent info
      const { data: agent, error: agentError } = await supabase
        .from('users')
        .select('*')
        .eq('id', order.agent_user_id)
        .single();

      if (agentError) throw agentError;

      // Get order history
      const { data: history, error: historyError } = await supabase
        .from('order_history')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (historyError) throw historyError;

      // Transform and combine data
      const transformedOrder = this.transformOrder(
        order as SupabaseOrder
      );
      const transformedItems = items.map((item) =>
        this.transformOrderItem(item as SupabaseOrderItem)
      );
      const transformedHistory = history.map((h) =>
        this.transformOrderHistory(h as SupabaseOrderHistory)
      );

      return {
        ...transformedOrder,
        items: transformedItems,
        client: client,
        agent: agent,
        history: transformedHistory,
      };
    } catch (error) {
      console.error('Error getting order by ID:', error);
      return null;
    }
  }

  /**
   * Get orders for current user with filters
   */
  async getOrders(filters?: OrderFilters): Promise<DetailedOrder[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase.from('orders').select('*');

      // Apply role filter
      if (filters?.role === 'client') {
        query = query.eq('client_user_id', user.id);
      } else if (filters?.role === 'agent') {
        query = query.eq('agent_user_id', user.id);
      } else {
        // Default: get all orders where user is either client or agent
        query = query.or(
          `client_user_id.eq.${user.id},agent_user_id.eq.${user.id}`
        );
      }

      // Apply status filter
      if (filters?.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }

      // Apply payment status filter
      if (filters?.paymentStatus) {
        if (Array.isArray(filters.paymentStatus)) {
          query = query.in('payment_status', filters.paymentStatus);
        } else {
          query = query.eq('payment_status', filters.paymentStatus);
        }
      }

      // Apply date range filters
      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      // Apply amount filters
      if (filters?.minAmount !== undefined) {
        query = query.gte('total_amount', filters.minAmount);
      }
      if (filters?.maxAmount !== undefined) {
        query = query.lte('total_amount', filters.maxAmount);
      }

      // Order by creation date (newest first)
      query = query.order('created_at', { ascending: false });

      const { data: orders, error } = await query;

      if (error) throw error;

      // Fetch details for each order
      const ordersWithDetails = await Promise.all(
        orders.map((order) => this.getOrderById(order.id))
      );

      return ordersWithDetails.filter(
        (order): order is DetailedOrder => order !== null
      );
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }

  /**
   * Get orders as client (buyer)
   */
  async getClientOrders(
    filters?: Omit<OrderFilters, 'role'>
  ): Promise<DetailedOrder[]> {
    return this.getOrders({ ...filters, role: 'client' });
  }

  /**
   * Get orders as agent (seller)
   */
  async getAgentOrders(
    filters?: Omit<OrderFilters, 'role'>
  ): Promise<DetailedOrder[]> {
    return this.getOrders({ ...filters, role: 'agent' });
  }

  /**
   * Get order statistics for current user
   */
  async getOrderStatistics(
    role?: 'client' | 'agent'
  ): Promise<OrderStatistics | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase.from('orders').select('*');

      if (role === 'client') {
        query = query.eq('client_user_id', user.id);
      } else if (role === 'agent') {
        query = query.eq('agent_user_id', user.id);
      } else {
        query = query.or(
          `client_user_id.eq.${user.id},agent_user_id.eq.${user.id}`
        );
      }

      const { data: orders, error } = await query;

      if (error) throw error;

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.total_amount,
        0
      );
      const averageOrderValue =
        totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const ordersByStatus = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<OrderStatus, number>);

      const ordersByPaymentStatus = orders.reduce((acc, order) => {
        acc[order.payment_status] =
          (acc[order.payment_status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        ordersByStatus,
        ordersByPaymentStatus: ordersByPaymentStatus as any,
      };
    } catch (error) {
      console.error('Error getting order statistics:', error);
      return null;
    }
  }

  // =====================================================
  // UPDATE OPERATIONS
  // =====================================================

  /**
   * Update an existing order
   */
  async updateOrder(
    orderId: string,
    updates: UpdateOrderRequest
  ): Promise<Order | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Build update object with snake_case keys
      const updateData: any = {};

      if (updates.status !== undefined)
        updateData.status = updates.status;
      if (updates.paymentStatus !== undefined)
        updateData.payment_status = updates.paymentStatus;
      if (updates.paymentMethod !== undefined)
        updateData.payment_method = updates.paymentMethod;
      if (updates.paymentTransactionId !== undefined)
        updateData.payment_transaction_id =
          updates.paymentTransactionId;
      if (updates.trackingNumber !== undefined)
        updateData.tracking_number = updates.trackingNumber;
      if (updates.estimatedDeliveryDate !== undefined)
        updateData.estimated_delivery_date =
          updates.estimatedDeliveryDate;
      if (updates.actualDeliveryDate !== undefined)
        updateData.actual_delivery_date = updates.actualDeliveryDate;
      if (updates.notes !== undefined)
        updateData.notes = updates.notes;
      if (updates.cancellationReason !== undefined)
        updateData.cancellation_reason = updates.cancellationReason;
      if (updates.refundAmount !== undefined)
        updateData.refund_amount = updates.refundAmount;
      if (updates.refundReason !== undefined)
        updateData.refund_reason = updates.refundReason;

      // Set timestamp fields based on status
      if (updates.status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
      }
      if (updates.status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }
      if (
        updates.paymentStatus === 'completed' &&
        !updateData.paid_at
      ) {
        updateData.paid_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      return this.transformOrder(data as SupabaseOrder);
    } catch (error) {
      console.error('Error updating order:', error);
      return null;
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    notes?: string
  ): Promise<Order | null> {
    return this.updateOrder(orderId, {
      status,
      notes,
      ...(status === 'cancelled' && notes
        ? { cancellationReason: notes }
        : {}),
    });
  }

  /**
   * Cancel an order
   */
  async cancelOrder(
    orderId: string,
    reason: string
  ): Promise<Order | null> {
    return this.updateOrder(orderId, {
      status: 'cancelled',
      cancellationReason: reason,
    });
  }

  /**
   * Complete an order
   */
  async completeOrder(orderId: string): Promise<Order | null> {
    return this.updateOrder(orderId, {
      status: 'completed',
    });
  }

  // =====================================================
  // DELETE OPERATIONS
  // =====================================================

  /**
   * Delete an order (only if pending_payment)
   */
  async deleteOrder(orderId: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if order can be deleted (only pending_payment orders)
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('status, client_user_id')
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;

      if (order.client_user_id !== user.id) {
        throw new Error('Not authorized to delete this order');
      }

      if (order.status !== 'pending_payment') {
        throw new Error(
          'Can only delete orders with pending_payment status'
        );
      }

      const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (deleteError) throw deleteError;

      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  }

  // =====================================================
  // REAL-TIME SUBSCRIPTIONS
  // =====================================================

  /**
   * Subscribe to order updates
   */
  subscribeToOrder(
    orderId: string,
    callback: (order: SupabaseOrder) => void
  ): RealtimeChannel {
    // Unsubscribe from existing subscription if any
    this.unsubscribeFromOrder(orderId);

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          callback(payload.new as SupabaseOrder);
        }
      )
      .subscribe();

    this.orderSubscriptions.set(orderId, channel);
    return channel;
  }

  /**
   * Unsubscribe from order updates
   */
  async unsubscribeFromOrder(orderId: string): Promise<void> {
    const channel = this.orderSubscriptions.get(orderId);
    if (channel) {
      await supabase.removeChannel(channel);
      this.orderSubscriptions.delete(orderId);
    }
  }

  /**
   * Subscribe to all orders for current user
   */
  subscribeToUserOrders(
    callback: (
      event: 'INSERT' | 'UPDATE' | 'DELETE',
      order: SupabaseOrder
    ) => void
  ): RealtimeChannel {
    return supabase
      .channel('user-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          callback(
            payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
            payload.new as SupabaseOrder
          );
        }
      )
      .subscribe();
  }

  /**
   * Cleanup all subscriptions
   */
  async cleanupSubscriptions(): Promise<void> {
    for (const [, channel] of this.orderSubscriptions) {
      await supabase.removeChannel(channel);
    }
    this.orderSubscriptions.clear();
  }
}

// Export singleton instance
export const ordersSupabaseService = new OrdersSupabaseService();
