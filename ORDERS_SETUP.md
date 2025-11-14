# Orders System Setup Guide

Complete guide for implementing the Supabase-based orders system in your proxy shopping application.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Setup Instructions](#setup-instructions)
4. [TypeScript Types](#typescript-types)
5. [Service Methods](#service-methods)
6. [Usage Examples](#usage-examples)
7. [Real-time Features](#real-time-features)
8. [Best Practices](#best-practices)

---

## 🎯 Overview

The orders system manages the complete order lifecycle from creation to completion, including:

- **Order Management**: Create, read, update, and delete orders
- **Order Items**: Track individual products/services in each order
- **Payment Tracking**: Monitor payment status and transactions
- **Delivery Management**: Handle delivery methods, tracking, and addresses
- **Order History**: Automatic tracking of all status changes
- **Real-time Updates**: Subscribe to order changes in real-time
- **Commission Calculation**: Automatic agent commission calculation

### Order Flow

```
1. Client creates order → pending_payment
2. Payment processed → payment_confirmed
3. Agent prepares order → processing
4. Order shipped → shipped → in_transit
5. Order delivered → delivered
6. Client confirms → completed
```

---

## 🗄️ Database Schema

The system consists of three main tables:

### 1. `orders` Table

Main order information table.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  client_user_id UUID NOT NULL REFERENCES auth.users(id),
  agent_user_id UUID NOT NULL REFERENCES auth.users(id),
  request_id UUID REFERENCES requests(id),
  offer_id UUID REFERENCES offers(id),
  status order_status NOT NULL DEFAULT 'pending_payment',
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_transaction_id VARCHAR(100),
  paid_at TIMESTAMPTZ,
  delivery_method delivery_method NOT NULL,
  delivery_address JSONB NOT NULL,
  tracking_number VARCHAR(100),
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  notes TEXT,
  cancellation_reason TEXT,
  refund_amount DECIMAL(10, 2),
  refund_reason TEXT,
  agent_commission_rate DECIMAL(5, 2) DEFAULT 10.00,
  agent_commission_amount DECIMAL(10, 2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
```

### 2. `order_items` Table

Individual items in each order.

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT,
  product_image_url TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  offer_id UUID REFERENCES offers(id),
  specifications JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3. `order_history` Table

Tracks all status changes automatically.

```sql
CREATE TABLE order_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  previous_status order_status,
  changed_by_user_id UUID REFERENCES auth.users(id),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Enums

```sql
-- Order statuses
CREATE TYPE order_status AS ENUM (
  'pending_payment',
  'payment_confirmed',
  'processing',
  'shipped',
  'in_transit',
  'delivered',
  'completed',
  'cancelled',
  'refunded',
  'disputed'
);

-- Payment statuses
CREATE TYPE payment_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
  'partially_refunded'
);

-- Delivery methods
CREATE TYPE delivery_method AS ENUM (
  'pickup',
  'standard_shipping',
  'express_shipping',
  'same_day_delivery',
  'international_shipping'
);
```

---

## 🚀 Setup Instructions

### Step 1: Run SQL Schema

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the contents of `src/supabase/orders-schema.sql`
5. Execute the SQL script
6. Verify tables are created successfully

### Step 2: Enable Realtime (Optional but Recommended)

1. Go to **Database** → **Replication**
2. Enable Realtime for these tables:
   - `orders`
   - `order_items`
   - `order_history`

### Step 3: Verify RLS Policies

Check that Row Level Security is enabled and policies are active:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('orders', 'order_items', 'order_history');

-- Should return true for all tables
```

### Step 4: Test the Setup

Run this query to verify everything works:

```sql
-- Should return empty result but no errors
SELECT * FROM orders LIMIT 1;
```

---

## 📦 TypeScript Types

All types are defined in `src/types/order.ts`:

### Core Types

```typescript
// Order status
type OrderStatus =
  | 'pending_payment'
  | 'payment_confirmed'
  | 'processing'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'disputed';

// Payment status
type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

// Main order interface
interface Order {
  id: string;
  orderNumber: string;
  clientUserId: string;
  agentUserId: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: DeliveryAddress;
  // ... other fields
}

// Order with full details
interface OrderWithDetails extends Order {
  items: OrderItem[];
  clientInfo: { id: string; nickname: string; image?: string };
  agentInfo: { id: string; nickname: string; image?: string };
  history?: OrderHistoryEntry[];
}
```

### Request/Response Types

```typescript
// Create order request
interface CreateOrderRequest {
  agentUserId: string;
  requestId?: string;
  offerId?: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    // ... other fields
  }[];
  currency: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: DeliveryAddress;
}

// Update order request
interface UpdateOrderRequest {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
  // ... other fields
}
```

---

## 🛠️ Service Methods

The `ordersSupabaseService` provides comprehensive order management:

### Create Operations

```typescript
// Create a new order
await ordersSupabaseService.createOrder({
  agentUserId: 'agent-uuid',
  offerId: 'offer-uuid',
  items: [
    {
      productName: 'iPhone 15 Pro',
      quantity: 1,
      unitPrice: 999.0,
      productDescription: '256GB, Natural Titanium',
    },
  ],
  currency: 'USD',
  deliveryMethod: 'standard_shipping',
  deliveryAddress: {
    fullName: 'John Doe',
    phone: '+1234567890',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA',
  },
});
```

### Read Operations

```typescript
// Get specific order
const order = await ordersSupabaseService.getOrderById('order-uuid');

// Get all orders (client + agent)
const allOrders = await ordersSupabaseService.getOrders();

// Get orders as client (buyer)
const myPurchases = await ordersSupabaseService.getClientOrders();

// Get orders as agent (seller)
const mySales = await ordersSupabaseService.getAgentOrders();

// Filter orders
const pendingOrders = await ordersSupabaseService.getOrders({
  status: 'pending_payment',
  role: 'client',
});

// Get order statistics
const stats = await ordersSupabaseService.getOrderStatistics(
  'client'
);
```

### Update Operations

```typescript
// Update order status
await ordersSupabaseService.updateOrderStatus(
  'order-uuid',
  'shipped',
  'Order shipped via FedEx'
);

// Update with tracking info
await ordersSupabaseService.updateOrder('order-uuid', {
  status: 'shipped',
  trackingNumber: 'FEDEX123456789',
  estimatedDeliveryDate: '2024-11-20',
});

// Cancel order
await ordersSupabaseService.cancelOrder(
  'order-uuid',
  'Customer requested cancellation'
);

// Complete order
await ordersSupabaseService.completeOrder('order-uuid');
```

### Delete Operations

```typescript
// Delete order (only pending_payment status)
const deleted = await ordersSupabaseService.deleteOrder('order-uuid');
```

---

## 💡 Usage Examples

### Example 1: Creating Order from Offer

```typescript
import { ordersSupabaseService } from '@/services/ordersSupabaseService';

async function createOrderFromOffer(offer: ShoppingOffer) {
  const order = await ordersSupabaseService.createOrder({
    agentUserId: offer.agentId,
    offerId: offer.id,
    items: [
      {
        productName: offer.title,
        productDescription: offer.description,
        productImageUrl: offer.images?.[0],
        quantity: 1,
        unitPrice: offer.price,
        offerId: offer.id,
        specifications: {
          category: offer.category,
          tags: offer.tags,
        },
      },
    ],
    currency: offer.currency,
    deliveryMethod: 'standard_shipping',
    deliveryAddress: {
      fullName: user.name,
      phone: user.phone || '',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
    notes: 'Please handle with care',
  });

  if (order) {
    console.log('Order created:', order.orderNumber);
    // Navigate to order details
    navigate(`/orders/${order.id}`);
  }
}
```

### Example 2: Displaying Order List

```typescript
import { useEffect, useState } from 'react';
import { ordersSupabaseService } from '@/services/ordersSupabaseService';
import { OrderWithDetails } from '@/types/order';

function OrdersList() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const data = await ordersSupabaseService.getClientOrders({
      status: ['pending_payment', 'processing', 'shipped'],
    });
    setOrders(data);
    setLoading(false);
  }

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      {orders.map((order) => (
        <div key={order.id}>
          <h3>Order #{order.orderNumber}</h3>
          <p>Status: {order.status}</p>
          <p>
            Total: {order.currency} {order.totalAmount}
          </p>
          <p>Items: {order.items.length}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Order Status Badge Component

```typescript
import { Badge } from '@/components/ui/badge';
import { OrderStatus, ORDER_STATUS_VARIANTS } from '@/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const variant = ORDER_STATUS_VARIANTS[status];
  const label = status.replace(/_/g, ' ').toUpperCase();

  return <Badge variant={variant}>{label}</Badge>;
}
```

---

## ⚡ Real-time Features

### Subscribe to Order Updates

```typescript
import { useEffect } from 'react';
import { ordersSupabaseService } from '@/services/ordersSupabaseService';

function OrderDetails({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Initial load
    loadOrder();

    // Subscribe to real-time updates
    const channel = ordersSupabaseService.subscribeToOrder(
      orderId,
      (updatedOrder) => {
        setOrder(transformOrder(updatedOrder));
        toast.info('Order updated!');
      }
    );

    return () => {
      ordersSupabaseService.unsubscribeFromOrder(orderId);
    };
  }, [orderId]);

  async function loadOrder() {
    const data = await ordersSupabaseService.getOrderById(orderId);
    setOrder(data);
  }

  return (
    <div>
      <h2>Order #{order?.orderNumber}</h2>
      <p>Status: {order?.status}</p>
    </div>
  );
}
```

### Subscribe to All User Orders

```typescript
useEffect(() => {
  const channel = ordersSupabaseService.subscribeToUserOrders(
    (event, order) => {
      if (event === 'INSERT') {
        toast.success('New order created!');
      } else if (event === 'UPDATE') {
        toast.info('Order updated');
      }
      // Refresh orders list
      loadOrders();
    }
  );

  return () => {
    channel.unsubscribe();
  };
}, []);
```

---

## ✅ Best Practices

### 1. Error Handling

Always handle errors gracefully:

```typescript
async function createOrder(data: CreateOrderRequest) {
  try {
    const order = await ordersSupabaseService.createOrder(data);
    if (!order) {
      throw new Error('Failed to create order');
    }
    return order;
  } catch (error) {
    console.error('Order creation error:', error);
    toast.error('Failed to create order. Please try again.');
    return null;
  }
}
```

### 2. Order Validation

Validate order data before creating:

```typescript
function validateOrderData(data: CreateOrderRequest): string | null {
  if (data.items.length === 0) {
    return 'Order must have at least one item';
  }
  if (!data.deliveryAddress.street || !data.deliveryAddress.city) {
    return 'Complete delivery address is required';
  }
  if (data.items.some((item) => item.quantity <= 0)) {
    return 'All items must have quantity > 0';
  }
  return null;
}
```

### 3. Status Transitions

Only allow valid status transitions:

```typescript
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ['payment_confirmed', 'cancelled'],
  payment_confirmed: ['processing', 'refunded', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['in_transit', 'delivered'],
  in_transit: ['delivered'],
  delivered: ['completed', 'disputed'],
  completed: [],
  cancelled: [],
  refunded: [],
  disputed: ['completed', 'refunded'],
};

function canTransitionTo(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean {
  return VALID_TRANSITIONS[currentStatus].includes(newStatus);
}
```

### 4. Permission Checks

Check user permissions before operations:

```typescript
async function canUpdateOrder(
  orderId: string,
  userId: string
): Promise<boolean> {
  const order = await ordersSupabaseService.getOrderById(orderId);
  if (!order) return false;

  // Client can update pending orders
  if (
    order.clientUserId === userId &&
    order.status === 'pending_payment'
  ) {
    return true;
  }

  // Agent can update orders they're managing
  if (order.agentUserId === userId) {
    return true;
  }

  return false;
}
```

### 5. Cleanup Subscriptions

Always cleanup real-time subscriptions:

```typescript
useEffect(() => {
  const channels: RealtimeChannel[] = [];

  orders.forEach((order) => {
    const channel = ordersSupabaseService.subscribeToOrder(
      order.id,
      handleOrderUpdate
    );
    channels.push(channel);
  });

  return () => {
    ordersSupabaseService.cleanupSubscriptions();
  };
}, [orders]);
```

---

## 🎨 UI Components Recommendations

### Suggested Components to Build

1. **OrdersList** - Display all orders with filters
2. **OrderDetails** - Show full order information
3. **OrderStatusBadge** - Visual status indicator
4. **OrderTimeline** - Show order history
5. **CreateOrderForm** - Form to create new order
6. **OrderTrackingCard** - Show delivery tracking info
7. **OrderItemCard** - Display individual order items
8. **OrderActionsMenu** - Actions dropdown (cancel, update, etc.)

---

## 🐛 Troubleshooting

### Issue: RLS Policy Errors

**Error**: "new row violates row-level security policy"

**Solution**: Verify RLS policies are correctly set up:

```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'orders';
```

### Issue: Order Number Generation Fails

**Error**: "duplicate key value violates unique constraint"

**Solution**: The trigger should handle this automatically, but if it fails:

```sql
-- Check trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'generate_order_number_trigger';
```

### Issue: Real-time Not Working

**Solution**:

1. Check Realtime is enabled in Supabase dashboard
2. Verify tables are published for Realtime
3. Check browser console for WebSocket errors

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

---

## 🎉 You're All Set!

Your orders system is now ready to use. Start by:

1. ✅ Running the SQL schema in Supabase
2. ✅ Enabling Realtime for the tables
3. ✅ Testing order creation with `createOrder()`
4. ✅ Building UI components to display orders
5. ✅ Adding real-time subscriptions for live updates

Happy coding! 🚀
