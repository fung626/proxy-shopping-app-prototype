import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { Separator } from '@/components/ui/separator';
import { chatSupabaseService } from '@/services/chatSupabaseService';
import { ordersSupabaseService } from '@/services/ordersSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useAuthStore } from '@/store/zustand';
import { OrderHistoryEntry, OrderWithDetails } from '@/types/order';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  MessageSquare,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function OrderDetailsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const orderData = await ordersSupabaseService.getOrderById(
        orderId!
      );
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderRole = (): 'client' | 'agent' => {
    if (!order || !user) return 'client';
    return order.clientUserId === user.id ? 'client' : 'agent';
  };

  const handleContactUser = async () => {
    if (!order || !user) return;
    const role = getOrderRole();
    const otherUserId =
      role === 'client' ? order.agentUserId : order.clientUserId;

    try {
      // Create or get conversation with order context
      const conversation =
        await chatSupabaseService.getOrCreateConversation({
          participant_user_id: otherUserId,
          order_id: order.id,
        });

      if (conversation) {
        navigate(`/messages/chat/${conversation.id}`);
      }
    } catch (error) {
      console.error('Error contacting user:', error);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    const confirmed = window.confirm(t('orders.confirmCancel'));
    if (!confirmed) return;

    const reason = window.prompt(t('orders.cancelReason'));
    if (!reason) return;

    const result = await ordersSupabaseService.cancelOrder(
      order.id,
      reason
    );
    if (result) {
      await loadOrderDetails();
    }
  };

  const handleCompleteOrder = async () => {
    if (!order) return;
    const confirmed = window.confirm(t('orders.confirmComplete'));
    if (!confirmed) return;

    const result = await ordersSupabaseService.completeOrder(
      order.id
    );
    if (result) {
      await loadOrderDetails();
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed' || status === 'delivered') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (status === 'cancelled') {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getOrderStep = (status: string): number => {
    const statusStepMap: Record<string, number> = {
      pending_payment: 1,
      payment_processing: 1,
      paid: 2,
      agent_accepted: 2,
      shopping_in_progress: 2,
      items_purchased: 3,
      ready_to_ship: 3,
      shipped: 4,
      in_transit: 4,
      out_for_delivery: 4,
      delivered: 5,
      completed: 5,
      cancelled: 0,
      refunded: 0,
      disputed: 0,
    };
    return statusStepMap[status] || 1;
  };

  if (loading) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 bg-background">
        <div className="p-4">
          <Button variant="ghost" onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {t('orders.orderNotFound')}
            </h3>
            <p className="text-muted-foreground">
              {t('orders.orderNotFoundDescription')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const role = getOrderRole();
  const step = getOrderStep(order.status);
  const isActive =
    order.status !== 'cancelled' && order.status !== 'completed';

  return (
    <div className="flex-1 bg-background pb-20">
      {/* Header */}
      <div className="bg-card p-4 sticky top-0 z-10 border-b">
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/orders')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold flex-1">
            {t('orders.orderDetails')}
          </h1>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t('orders.orderNumber')}: {order.orderNumber}
          </span>
          {getStatusIcon(order.status)}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              {t('orders.orderStatus')}
            </h2>
            <Badge
              variant={
                order.status === 'completed' ? 'default' : 'secondary'
              }
            >
              {order.status.replace(/_/g, ' ').toUpperCase()}
            </Badge>
          </div>

          {isActive && (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {t('orders.currentStep')}: {step} / 5
              </p>
              <ProgressSteps currentStep={step} numberOfSteps={5} />
            </>
          )}

          {order.trackingNumber && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {t('orders.trackingNumber')}
                  </span>
                </div>
                <span className="text-sm font-mono">
                  {order.trackingNumber}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Order Items */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">
            {t('orders.orderItems')}
          </h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex space-x-3">
                {item.productImageUrl && (
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <ImageWithFallback
                      src={item.productImageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-sm">
                    {item.productName}
                  </h4>
                  {item.productDescription && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {item.productDescription}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {t('orders.quantity')}: {item.quantity}
                    </span>
                    <span className="text-sm font-semibold">
                      {order.currency} {item.subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Total */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('orders.subtotal')}</span>
              <span>
                {order.currency} {order.totalAmount.toFixed(2)}
              </span>
            </div>
            {order.agentCommissionAmount && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {t('orders.agentCommission')} (
                  {order.agentCommissionRate}%)
                </span>
                <span>
                  {order.currency}{' '}
                  {order.agentCommissionAmount.toFixed(2)}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>{t('orders.total')}</span>
              <span>
                {order.currency} {order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Delivery Information */}
        {order.deliveryAddress && (
          <Card className="p-4">
            <h2 className="font-semibold mb-4 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {t('orders.deliveryAddress')}
            </h2>
            <div className="text-sm space-y-1">
              {order.deliveryAddress.street && (
                <p>{order.deliveryAddress.street}</p>
              )}
              {order.deliveryAddress.addressLine2 && (
                <p>{order.deliveryAddress.addressLine2}</p>
              )}
              <p>
                {order.deliveryAddress.city},{' '}
                {order.deliveryAddress.state}{' '}
                {order.deliveryAddress.postalCode}
              </p>
              <p>{order.deliveryAddress.country}</p>
            </div>
            <div className="mt-3 text-sm">
              <span className="text-muted-foreground">
                {t('orders.deliveryMethod')}:{' '}
              </span>
              <Badge variant="outline">{order.deliveryMethod}</Badge>
            </div>
          </Card>
        )}

        {/* Payment Information */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4 flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            {t('orders.paymentInfo')}
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('orders.paymentStatus')}
              </span>
              <Badge
                variant={
                  order.paymentStatus === 'completed'
                    ? 'default'
                    : 'secondary'
                }
              >
                {order.paymentStatus}
              </Badge>
            </div>
            {order.paymentMethod && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t('orders.paymentMethod')}
                </span>
                <span>{order.paymentMethod}</span>
              </div>
            )}
            {order.paidAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t('orders.paidAt')}
                </span>
                <span>{formatDate(order.paidAt)}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Partner Information */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">
            {role === 'client'
              ? t('orders.agentInfo')
              : t('orders.clientInfo')}
          </h2>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {(
                role === 'client'
                  ? order.agentInfo?.image
                  : order.clientInfo?.image
              ) ? (
                <ImageWithFallback
                  src={
                    role === 'client'
                      ? order.agentInfo?.image
                      : order.clientInfo?.image
                  }
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold">
                  {(role === 'client'
                    ? order.agentInfo?.nickname
                    : order.clientInfo?.nickname
                  )
                    ?.charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {role === 'client'
                  ? order.agentInfo?.nickname
                  : order.clientInfo?.nickname}
              </p>
              <p className="text-sm text-muted-foreground">
                {role === 'client'
                  ? t('orders.shoppingAgent')
                  : t('orders.client')}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleContactUser}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {t('orders.contact')}
            </Button>
          </div>
        </Card>

        {/* Order History */}
        {order.history && order.history.length > 0 && (
          <Card className="p-4">
            <h2 className="font-semibold mb-4">
              {t('orders.orderHistory')}
            </h2>
            <div className="space-y-3">
              {order.history.map(
                (entry: OrderHistoryEntry, index: number) => (
                  <div key={entry.id} className="flex space-x-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {index < order.history!.length - 1 && (
                        <div className="w-px h-full bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-3">
                      <p className="font-medium text-sm">
                        {entry.status.replace(/_/g, ' ')}
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {entry.notes}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(entry.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>
        )}

        {/* Order Dates */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">{t('orders.dates')}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('orders.created')}
              </span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            {order.estimatedDeliveryDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t('orders.estimatedDelivery')}
                </span>
                <span>{formatDate(order.estimatedDeliveryDate)}</span>
              </div>
            )}
            {order.actualDeliveryDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t('orders.actualDelivery')}
                </span>
                <span>{formatDate(order.actualDeliveryDate)}</span>
              </div>
            )}
            {order.completedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t('orders.completedAt')}
                </span>
                <span>{formatDate(order.completedAt)}</span>
              </div>
            )}
            {order.cancelledAt && (
              <div className="flex justify-between text-red-500">
                <span>{t('orders.cancelledAt')}</span>
                <span>{formatDate(order.cancelledAt)}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2">
          {role === 'agent' &&
            isActive &&
            order.status === 'payment_confirmed' && (
              <Button
                className="w-full"
                onClick={handleCompleteOrder}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('orders.markAsComplete')}
              </Button>
            )}

          {isActive && order.status === 'pending_payment' && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleCancelOrder}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {t('orders.cancelOrder')}
            </Button>
          )}

          {order.status === 'completed' && (
            <Button
              variant="default"
              className="w-full"
              onClick={() =>
                navigate(`/orders/${order.id}/leave-feedback`)
              }
            >
              {t('orders.leaveFeedback')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
