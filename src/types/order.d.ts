// =====================================================
// ORDER TYPES FOR SUPABASE
// =====================================================

import { SupabaseOffer } from '@/services/offersSupabaseService';
import { SupabaseRequest } from '@/services/requestsSupabaseService';
import { SupabaseUser } from '@/services/type';

// Shipping Order Status enum
export type ShippingOrderStatus =
  | 'pending_payment' // Order created, awaiting payment
  | 'payment_confirmed' // Payment received and confirmed
  | 'processing' // Order being prepared/processed
  | 'shipped' // Order shipped to customer
  | 'in_transit' // Order in delivery
  | 'delivered' // Order delivered successfully
  | 'completed' // Order completed and confirmed by customer
  | 'cancelled' // Order cancelled by user or agent
  | 'refunded' // Order refunded
  | 'disputed'; // Order in dispute/arbitration

// Personal Handoff Order Status enum
export type PersonalHandoffOrderStatus =
  | 'pending_payment' // Order created, awaiting payment
  | 'payment_confirmed' // Payment received and confirmed
  | 'processing' // Order being prepared/processed
  | 'ready_for_handoff' // Order ready for personal handoff
  | 'completed' // Order completed and confirmed by customer
  | 'cancelled' // Order cancelled by user or agent
  | 'refunded' // Order refunded
  | 'disputed'; // Order in dispute/arbitration

// Order Status enum
export type OrderStatus =
  | ShippingOrderStatus
  | PersonalHandoffOrderStatus;

// Payment Status enum
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

// Delivery Method enum
export type DeliveryMethod =
  | 'personal_handoff'
  | 'standard_shipping'
  | 'express_shipping'
  | 'same_day_delivery'
  | 'international_shipping';

// Delivery Address
export interface DeliveryAddress {
  fullName: string;
  phone: string;
  street: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Order Item (from Supabase)
export interface SupabaseOrderItem {
  id: string;
  order_id: string;
  product_name: string;
  product_description: string | null;
  product_image_url: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  offer_id: string | null;
  specifications: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Order Item (Client-side)
export interface OrderItem {
  id: string;
  orderId: string;
  productName: string;
  productDescription?: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  offerId?: string;
  specifications?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Order (from Supabase)
export interface SupabaseOrder {
  id: string;
  order_number: string;
  client_user_id: string;
  agent_user_id: string;
  request_id: string | null;
  offer_id: string | null;
  status: OrderStatus;
  total_amount: number;
  currency: string;
  payment_status: PaymentStatus;
  payment_method: string | null;
  payment_transaction_id: string | null;
  paid_at: string | null;
  delivery_method: DeliveryMethod;
  delivery_address: DeliveryAddress;
  tracking_number: string | null;
  estimated_delivery_date: string | null;
  actual_delivery_date: string | null;
  notes: string | null;
  cancellation_reason: string | null;
  refund_amount: number | null;
  refund_reason: string | null;
  agent_commission_rate: number;
  agent_commission_amount: number | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  cancelled_at: string | null;
  completed_at: string | null;
}

// Order (Client-side)
export interface Order {
  id: string;
  orderNumber: string;
  clientUserId: string;
  agentUserId: string;
  requestId?: string;
  offerId?: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentTransactionId?: string;
  paidAt?: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: DeliveryAddress;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  cancellationReason?: string;
  refundAmount?: number;
  refundReason?: string;
  agentCommissionRate: number;
  agentCommissionAmount?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  completedAt?: string;
}

// Order with related data
export interface DetailedOrder extends Order {
  items: OrderItem[];
  client: SupabaseUser;
  agent: SupabaseUser;
  history?: OrderHistory[];
  request?: SupabaseRequest;
  offer?: SupabaseOffer;
}

// Order History Entry (from Supabase)
export interface SupabaseOrderHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  previous_status: OrderStatus | null;
  changed_by_user_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

// Order History Entry (Client-side)
export interface OrderHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  previousStatus?: OrderStatus;
  changedByUserId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// =====================================================
// REQUEST/RESPONSE TYPES FOR API
// =====================================================

// Create Order Request
export interface CreateOrderRequest {
  agentUserId: string;
  requestId?: string;
  offerId?: string;
  items: {
    productName: string;
    productDescription?: string;
    productImageUrl?: string;
    quantity: number;
    unitPrice: number;
    offerId?: string;
    specifications?: Record<string, any>;
  }[];
  currency: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: DeliveryAddress;
  paymentMethod?: string;
  notes?: string;
}

// Update Order Request
export interface UpdateOrderRequest {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  paymentTransactionId?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  cancellationReason?: string;
  refundAmount?: number;
  refundReason?: string;
}

// Order Filters
export interface OrderFilters {
  status?: OrderStatus | OrderStatus[];
  paymentStatus?: PaymentStatus | PaymentStatus[];
  role?: 'client' | 'agent'; // View orders where user is client or agent
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Order Statistics
export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
  ordersByPaymentStatus: Record<PaymentStatus, number>;
}

// =====================================================
// HELPER TYPES
// =====================================================

// Status badge variant mapping
export type OrderStatusVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline';

export const ORDER_STATUS_VARIANTS: Record<
  OrderStatus,
  OrderStatusVariant
> = {
  pending_payment: 'secondary',
  payment_confirmed: 'default',
  processing: 'default',
  ready_for_handoff: 'default',
  shipped: 'default',
  in_transit: 'default',
  delivered: 'default',
  completed: 'default',
  cancelled: 'destructive',
  refunded: 'destructive',
  disputed: 'destructive',
};

// Payment status badge variant mapping
export const PAYMENT_STATUS_VARIANTS: Record<
  PaymentStatus,
  OrderStatusVariant
> = {
  pending: 'secondary',
  processing: 'secondary',
  completed: 'default',
  failed: 'destructive',
  refunded: 'destructive',
  partially_refunded: 'outline',
};
