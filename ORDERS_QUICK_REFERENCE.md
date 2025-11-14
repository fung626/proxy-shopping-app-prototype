# Orders System - Quick Reference

## 📁 Files Created

1. **`src/supabase/orders-schema.sql`** - Complete database schema (400+ lines)

   - 3 tables: `orders`, `order_items`, `order_history`
   - 3 enums: `order_status`, `payment_status`, `delivery_method`
   - RLS policies for security
   - Triggers for automation
   - Helper functions

2. **`src/types/order.ts`** - TypeScript type definitions (270+ lines)

   - `Order`, `OrderItem`, `OrderWithDetails`
   - `OrderStatus`, `PaymentStatus`, `DeliveryMethod`
   - Request/Response types
   - Helper types and constants

3. **`src/services/ordersSupabaseService.ts`** - Service implementation (680+ lines)

   - CRUD operations
   - Real-time subscriptions
   - Data transformations
   - 15+ methods

4. **`ORDERS_SETUP.md`** - Complete documentation (500+ lines)
   - Setup instructions
   - Usage examples
   - Best practices
   - Troubleshooting guide

## 🚀 Quick Start

### 1. Setup Database (5 minutes)

```bash
# In Supabase SQL Editor:
1. Copy contents of src/supabase/orders-schema.sql
2. Run the SQL script
3. Enable Realtime for: orders, order_items, order_history
```

### 2. Create Your First Order

```typescript
import { ordersSupabaseService } from '@/services';

const order = await ordersSupabaseService.createOrder({
  agentUserId: 'agent-uuid',
  items: [
    {
      productName: 'iPhone 15 Pro',
      quantity: 1,
      unitPrice: 999.0,
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

### 3. Get Orders

```typescript
// Get all orders
const allOrders = await ordersSupabaseService.getOrders();

// Get as client (purchases)
const myPurchases = await ordersSupabaseService.getClientOrders();

// Get as agent (sales)
const mySales = await ordersSupabaseService.getAgentOrders();

// Filter orders
const pending = await ordersSupabaseService.getOrders({
  status: 'pending_payment',
  role: 'client',
});
```

### 4. Update Order Status

```typescript
// Update status
await ordersSupabaseService.updateOrderStatus(
  orderId,
  'shipped',
  'Shipped via FedEx'
);

// Add tracking
await ordersSupabaseService.updateOrder(orderId, {
  trackingNumber: 'FEDEX123456789',
  estimatedDeliveryDate: '2024-11-20',
});

// Cancel order
await ordersSupabaseService.cancelOrder(
  orderId,
  'Customer requested'
);
```

## 📊 Order Status Flow

```
pending_payment → payment_confirmed → processing
                                    ↓
                        shipped → in_transit → delivered → completed
                                                          ↗
                                                    disputed
```

## 🎯 Key Features

✅ **Automatic Order Numbers** - Format: `ORD-20241114-1234`
✅ **Commission Calculation** - Automatic 10% agent commission
✅ **Order History** - Automatic tracking of all status changes
✅ **Real-time Updates** - Subscribe to order changes
✅ **RLS Security** - Users can only see their own orders
✅ **Cascading Deletes** - Items deleted when order is deleted

## 📦 Service Methods Reference

### Create

- `createOrder(request)` - Create new order with items

### Read

- `getOrderById(id)` - Get order with full details
- `getOrders(filters?)` - Get all orders
- `getClientOrders(filters?)` - Get orders as client
- `getAgentOrders(filters?)` - Get orders as agent
- `getOrderStatistics(role?)` - Get order stats

### Update

- `updateOrder(id, updates)` - Update order fields
- `updateOrderStatus(id, status, notes?)` - Update status
- `cancelOrder(id, reason)` - Cancel order
- `completeOrder(id)` - Mark as completed

### Delete

- `deleteOrder(id)` - Delete pending payment order

### Real-time

- `subscribeToOrder(id, callback)` - Subscribe to order
- `unsubscribeFromOrder(id)` - Unsubscribe
- `subscribeToUserOrders(callback)` - Subscribe to all
- `cleanupSubscriptions()` - Cleanup all subscriptions

## 🎨 UI Components to Build

Suggested components based on orders data:

1. **OrdersList** - Display all orders with filters

   ```tsx
   <OrdersList role="client" status="processing" />
   ```

2. **OrderCard** - Individual order summary

   ```tsx
   <OrderCard order={order} onClick={handleClick} />
   ```

3. **OrderDetails** - Full order information

   ```tsx
   <OrderDetails orderId={orderId} />
   ```

4. **OrderStatusBadge** - Visual status indicator

   ```tsx
   <OrderStatusBadge status="shipped" />
   ```

5. **OrderTimeline** - Show order history

   ```tsx
   <OrderTimeline history={order.history} />
   ```

6. **CreateOrderForm** - Form to create order

   ```tsx
   <CreateOrderForm offerId={offerId} />
   ```

7. **OrderTrackingCard** - Delivery tracking
   ```tsx
   <OrderTrackingCard
     trackingNumber={order.trackingNumber}
     deliveryMethod={order.deliveryMethod}
   />
   ```

## 🔍 Example: Order Card Component

```typescript
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  OrderWithDetails,
  ORDER_STATUS_VARIANTS,
} from '@/types/order';
import { Package, Truck } from 'lucide-react';

interface OrderCardProps {
  order: OrderWithDetails;
  onClick?: () => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer hover:bg-muted/50"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">#{order.orderNumber}</span>
        </div>
        <Badge variant={ORDER_STATUS_VARIANTS[order.status]}>
          {order.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="space-y-1 text-sm">
        <div className="font-medium">
          {order.items.length} item(s)
        </div>
        <div className="text-muted-foreground">
          {order.currency} {order.totalAmount.toFixed(2)}
        </div>
        {order.trackingNumber && (
          <div className="flex items-center space-x-1 text-xs text-primary">
            <Truck className="h-3 w-3" />
            <span>{order.trackingNumber}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
```

## 🛡️ Security Notes

- **RLS Policies**: Users can only access their own orders
- **Client Access**: Can create and view their orders
- **Agent Access**: Can view and update orders they're managing
- **Delete Restrictions**: Only `pending_payment` orders can be deleted
- **Automatic Auditing**: All status changes tracked in `order_history`

## 📝 Database Indexes

Optimized queries for:

- Client user orders
- Agent user orders
- Order status filtering
- Payment status filtering
- Date range queries
- Order number lookups

## ⚠️ Important Notes

1. **Order Numbers**: Auto-generated as `ORD-YYYYMMDD-XXXX`
2. **Commission**: Default 10% agent commission (configurable)
3. **Currency**: Default USD, supports any 3-letter currency code
4. **Delivery Address**: Stored as JSONB for flexibility
5. **Metadata**: JSONB field for custom data storage

## 🎓 Next Steps

1. ✅ Run SQL schema in Supabase
2. ✅ Enable Realtime
3. ✅ Test creating an order
4. Build UI components for:
   - Orders list page
   - Order details page
   - Create order form
   - Order status updates
5. Add real-time notifications
6. Implement order search/filtering
7. Add order export functionality

## 📚 Full Documentation

See `ORDERS_SETUP.md` for complete documentation including:

- Detailed schema explanation
- All TypeScript types
- Complete service API reference
- Usage examples
- Best practices
- Troubleshooting guide

---

**Ready to use!** Import and start creating orders:

```typescript
import { ordersSupabaseService } from '@/services';
```
