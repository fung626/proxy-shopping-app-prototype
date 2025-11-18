import { SupabaseUser } from '@/services/type';
import {
  DeliveryMethod,
  DetailedOrder,
  OrderStatus,
  PaymentStatus,
} from '@/types/order';
import {
  CreditCard,
  Package,
  PackageCheck,
  Search,
  Truck,
} from 'lucide-react';

export const getOrderRole = (
  user: SupabaseUser | null,
  order: DetailedOrder
): 'client' | 'agent' => {
  return order.clientUserId === user?.id ? 'client' : 'agent';
};

export const getOrderStep = (
  status: OrderStatus,
  deliveryMethod: DeliveryMethod
): number => {
  if (deliveryMethod === 'personal_handoff') {
    // Personal delivery steps: 1. Payment -> 2. Shopping -> 3. Ready for Pickup -> 4. Meeting Arranged -> 5. Completed
    const map: Record<string, number> = {
      pending_payment: 1,
      payment_confirmed: 1,
      processing: 2,
      shopping: 3,
      shipped: 3, // Repurposed as "ready for pickup"
      in_transit: 4, // Repurposed as "meeting arranged"
      delivered: 5,
      completed: 5,
      cancelled: 0,
      refunded: 0,
      disputed: 0,
    };
    return map[status] || 1;
  } else {
    // Ship delivery steps: 1. Payment -> 2. Shopping -> 3. Items Purchased -> 4. Shipped/In Transit -> 5. Delivered
    const map: Record<string, number> = {
      pending_payment: 1,
      payment_confirmed: 1,
      processing: 2,
      shipped: 4,
      in_transit: 4,
      delivered: 5,
      completed: 5,
      cancelled: 0,
      refunded: 0,
      disputed: 0,
    };
    return map[status] || 1;
  }
};

export const getStepDetails = (
  step: number,
  role: 'client' | 'agent',
  deliveryMethod: DeliveryMethod
) => {
  if (deliveryMethod === 'personal_handoff') {
    // Personal delivery steps
    if (role === 'client') {
      const steps = [
        {
          icon: Search,
          label: 'orders.steps.requestPosted',
          description: 'orders.steps.waitingForAgents',
        },
        {
          icon: Package,
          label: 'orders.steps.agentAssigned',
          description: 'orders.steps.shoppingInProgress',
        },
        {
          icon: CreditCard,
          label: 'orders.steps.readyForPickup',
          description: 'orders.steps.itemsReadyForMeetup',
        },
        {
          icon: PackageCheck,
          label: 'orders.steps.meetingArranged',
          description: 'orders.steps.meetupScheduled',
        },
        {
          icon: Truck,
          label: 'orders.steps.completed',
          description: 'orders.steps.itemsReceived',
        },
      ];
      return steps[step - 1] || steps[0];
    } else {
      const steps = [
        {
          icon: Search,
          label: 'orders.steps.requestAccepted',
          description: 'orders.steps.startingShopping',
        },
        {
          icon: Package,
          label: 'orders.steps.shoppingStarted',
          description: 'orders.steps.findingRequestedItems',
        },
        {
          icon: CreditCard,
          label: 'orders.steps.readyForPickup',
          description: 'orders.steps.itemsReadyForHandoff',
        },
        {
          icon: PackageCheck,
          label: 'orders.steps.meetingArranged',
          description: 'orders.steps.coordinatingMeetup',
        },
        {
          icon: Truck,
          label: 'orders.steps.completed',
          description: 'orders.steps.itemsHandedOver',
        },
      ];
      return steps[step - 1] || steps[0];
    }
  } else {
    // Ship delivery steps
    if (role === 'client') {
      const steps = [
        {
          icon: Search,
          label: 'orders.steps.requestPosted',
          description: 'orders.steps.waitingForAgents',
        },
        {
          icon: Package,
          label: 'orders.steps.agentAssigned',
          description: 'orders.steps.shoppingInProgress',
        },
        {
          icon: CreditCard,
          label: 'orders.steps.itemsPurchased',
          description: 'orders.steps.itemsBoughtByAgent',
        },
        {
          icon: PackageCheck,
          label: 'orders.steps.packageShipped',
          description: 'orders.steps.packageSentOut',
        },
        {
          icon: Truck,
          label: 'orders.steps.delivered',
          description: 'orders.steps.orderComplete',
        },
      ];
      return steps[step - 1] || steps[0];
    } else {
      const steps = [
        {
          icon: Search,
          label: 'orders.steps.requestAccepted',
          description: 'orders.steps.startingShopping',
        },
        {
          icon: Package,
          label: 'orders.steps.shoppingStarted',
          description: 'orders.steps.findingRequestedItems',
        },
        {
          icon: CreditCard,
          label: 'orders.steps.itemsPurchased',
          description: 'orders.steps.itemsBoughtSuccessfully',
        },
        {
          icon: PackageCheck,
          label: 'orders.steps.packageShipped',
          description: 'orders.steps.packageSentToClient',
        },
        {
          icon: Truck,
          label: 'orders.steps.delivered',
          description: 'orders.steps.successfullyCompleted',
        },
      ];
      return steps[step - 1] || steps[0];
    }
  }
};

export const getStatusLabel = (status: OrderStatus): string => {
  const map: Record<string, string> = {
    pending_payment: 'orderStatus.pending_payment',
    payment_confirmed: 'orderStatus.payment_confirmed',
    processing: 'orderStatus.shopping',
    shipped: 'orderStatus.shipped',
    in_transit: 'orderStatus.in_transit',
    delivered: 'orderStatus.delivered',
    completed: 'orderStatus.completed',
    cancelled: 'orderStatus.cancelled',
    refunded: 'orderStatus.refunded',
    disputed: 'orderStatus.cancelled',
  };
  return map[status] || status;
};

export const getPaymentStatusLabel = (
  status: PaymentStatus
): string => {
  const map: Record<string, string> = {
    pending: 'paymentStatus.pending',
    processing: 'paymentStatus.processing',
    completed: 'paymentStatus.completed',
    failed: 'paymentStatus.failed',
    refunded: 'paymentStatus.refunded',
    partially_refunded: 'paymentStatus.partially_refunded',
  };
  console.log('[DBEUG] GetPaymentStatusLabel', map, status, map);
  return map[status] || String(status);
};

export const getStatusVariant = (
  status: OrderStatus
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (status === 'completed' || status === 'delivered')
    return 'default';
  if (
    status === 'cancelled' ||
    status === 'refunded' ||
    status === 'disputed'
  )
    return 'destructive';
  return 'secondary';
};

export const getRoleBadgeVariant = (role: 'client' | 'agent') => {
  return role === 'client' ? 'default' : 'secondary';
};

export const getRoleLabel = (role: 'client' | 'agent') => {
  return role === 'client' ? 'orders.request' : 'orders.offer';
};
