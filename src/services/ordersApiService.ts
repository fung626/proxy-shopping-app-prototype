import { BaseApiService } from './baseApiService';

export class OrdersApiService extends BaseApiService {
  private readonly endpoint = '/orders';

  // Get all orders
  async getOrders(filters?: {
    clientId?: string;
    agentId?: string;
    status?: string;
    paymentStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: any[]; total?: number }> {
    let url = this.endpoint;

    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const cacheKey = `orders-${JSON.stringify(filters || {})}`;
    return this.request(url, {}, cacheKey, 1 * 60 * 1000); // 1 minute cache for orders
  }

  // Get order by ID
  async getOrderById(orderId: string): Promise<{ order: any }> {
    return this.request(
      `${this.endpoint}/${orderId}`,
      {},
      `order-${orderId}`,
      5 * 60 * 1000 // 5 minutes cache
    );
  }

  // Create new order
  async createOrder(orderData: any): Promise<{ order: any }> {
    const result = await this.request<{ order: any }>(this.endpoint, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });

    // Invalidate orders cache
    this.clearCachePattern('orders-');

    return result;
  }

  // Update order
  async updateOrder(
    orderId: string,
    orderData: any
  ): Promise<{ order: any }> {
    const result = await this.request<{ order: any }>(
      `${this.endpoint}/${orderId}`,
      {
        method: 'PUT',
        body: JSON.stringify(orderData),
      }
    );

    // Invalidate related caches
    this.clearCachePattern('orders-');
    this.clearCache(`order-${orderId}`);

    return result;
  }

  // Delete order
  async deleteOrder(orderId: string): Promise<{ success: boolean }> {
    const result = await this.request<{ success: boolean }>(
      `${this.endpoint}/${orderId}`,
      {
        method: 'DELETE',
      }
    );

    // Invalidate related caches
    this.clearCachePattern('orders-');
    this.clearCache(`order-${orderId}`);

    return result;
  }

  // Get orders by client
  async getOrdersByClient(
    clientId: string
  ): Promise<{ orders: any[] }> {
    return this.request(
      `${this.endpoint}/client/${clientId}`,
      {},
      `orders-client-${clientId}`,
      1 * 60 * 1000
    );
  }

  // Get orders by agent
  async getOrdersByAgent(
    agentId: string
  ): Promise<{ orders: any[] }> {
    return this.request(
      `${this.endpoint}/agent/${agentId}`,
      {},
      `orders-agent-${agentId}`,
      1 * 60 * 1000
    );
  }

  // Update order status
  async updateOrderStatus(
    orderId: string,
    status:
      | 'pending'
      | 'confirmed'
      | 'processing'
      | 'shipped'
      | 'delivered'
      | 'cancelled'
      | 'refunded'
  ): Promise<{ order: any }> {
    return this.updateOrder(orderId, { status });
  }

  // Update payment status
  async updatePaymentStatus(
    orderId: string,
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  ): Promise<{ order: any }> {
    return this.updateOrder(orderId, {
      payment_status: paymentStatus,
    });
  }

  // Update tracking information
  async updateTrackingInfo(
    orderId: string,
    trackingNumber: string,
    carrier?: string
  ): Promise<{ order: any }> {
    const updateData: any = { tracking_number: trackingNumber };
    if (carrier) updateData.carrier = carrier;

    return this.updateOrder(orderId, updateData);
  }

  // Add order notes
  async addOrderNotes(
    orderId: string,
    notes: string
  ): Promise<{ order: any }> {
    return this.updateOrder(orderId, { notes });
  }

  // Update shipping details
  async updateShippingDetails(
    orderId: string,
    shippingDetails: any
  ): Promise<{ order: any }> {
    return this.updateOrder(orderId, {
      shipping_details: shippingDetails,
    });
  }

  // Get order history/timeline
  async getOrderHistory(
    orderId: string
  ): Promise<{ history: any[] }> {
    return this.request(
      `${this.endpoint}/${orderId}/history`,
      {},
      `order-history-${orderId}`,
      5 * 60 * 1000
    );
  }

  // Cancel order
  async cancelOrder(
    orderId: string,
    reason?: string
  ): Promise<{ order: any }> {
    const cancelData: any = { status: 'cancelled' };
    if (reason) cancelData.cancellation_reason = reason;

    return this.updateOrder(orderId, cancelData);
  }

  // Confirm order
  async confirmOrder(orderId: string): Promise<{ order: any }> {
    return this.updateOrderStatus(orderId, 'confirmed');
  }

  // Mark order as delivered
  async markAsDelivered(
    orderId: string,
    deliveryDate?: string
  ): Promise<{ order: any }> {
    const updateData: any = { status: 'delivered' };
    if (deliveryDate) updateData.delivery_date = deliveryDate;

    return this.updateOrder(orderId, updateData);
  }

  // Process refund
  async processRefund(
    orderId: string,
    refundAmount?: number,
    reason?: string
  ): Promise<{ order: any }> {
    const refundData: any = {
      status: 'refunded',
      payment_status: 'refunded',
    };
    if (refundAmount) refundData.refund_amount = refundAmount;
    if (reason) refundData.refund_reason = reason;

    return this.updateOrder(orderId, refundData);
  }

  // Get pending orders
  async getPendingOrders(limit?: number): Promise<{ orders: any[] }> {
    const params = new URLSearchParams({ status: 'pending' });
    if (limit) params.append('limit', limit.toString());

    return this.request(
      `${this.endpoint}?${params}`,
      {},
      `pending-orders-${limit || 'all'}`,
      30 * 1000 // 30 seconds cache for pending orders
    );
  }

  // Get order statistics
  async getOrderStats(userId?: string): Promise<{ stats: any }> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);

    return this.request(
      `/analytics/orders?${params}`,
      {},
      `order-stats-${userId || 'all'}`,
      5 * 60 * 1000
    );
  }
}

// Create and export singleton instance
export const ordersApiService = new OrdersApiService();
