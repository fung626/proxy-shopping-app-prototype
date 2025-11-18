import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { Separator } from '@/components/ui/separator';
import { chatSupabaseService } from '@/services/chatSupabaseService';
import { offersSupabaseService } from '@/services/offersSupabaseService';
import { ordersSupabaseService } from '@/services/ordersSupabaseService';
import { requestsSupabaseService } from '@/services/requestsSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useAuthStore } from '@/store/zustand';
import {
  DeliveryMethod,
  DetailedOrder,
  OrderHistory,
} from '@/types/order';
import {
  getOrderRole,
  getOrderStep,
  getPaymentStatusLabel,
  getStatusLabel,
  getStatusVariant,
  getStepDetails,
} from '@/utils/orders';
import {
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  MessageSquare,
  Package,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrderDetailsSkeleton } from './OrderDetailsSkeleton';

export function OrderDetailsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<DetailedOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetch();
    }
  }, [orderId]);

  const fetch = async () => {
    try {
      setLoading(true);
      const orderData = await ordersSupabaseService.getOrderById(
        orderId!
      );

      if (!orderData) {
        setOrder(null);
        return;
      }

      // Enrich order with request/offer details
      let additionalData: any = {};

      // Fetch request details if exists
      if (orderData.requestId) {
        const request = await requestsSupabaseService.getRequestById(
          orderData.requestId
        );
        if (request) {
          additionalData.request = request;
        }
      }

      // Fetch offer details if exists
      if (orderData.offerId) {
        const offer = await offersSupabaseService.getOfferById(
          orderData.offerId
        );
        if (offer) {
          additionalData.offer = offer;
        }
      }

      setOrder({
        ...orderData,
        ...additionalData,
      });
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async () => {
    if (!order || !user) return;
    const role = getOrderRole(user, order);
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
      await fetch();
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
      await fetch();
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

  if (loading) {
    return <OrderDetailsSkeleton />;
  }

  if (!order) {
    return (
      <div className="flex-1 bg-background">
        <div className="p-4">
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

  const role = getOrderRole(user, order);

  // Use the delivery method from the order
  const deliveryMethod: DeliveryMethod = order.deliveryMethod;

  const step = getOrderStep(order.status, deliveryMethod);
  const currentStepDetails = getStepDetails(
    step,
    role,
    deliveryMethod
  );
  const isActive =
    order.status !== 'cancelled' && order.status !== 'completed';

  console.log('[DBEUG] OrderDetailsPage Rendered', order);

  // return null;

  return (
    <div className="flex-1 bg-background pb-20">
      {/* Header */}
      <div className="bg-background p-4 sticky top-0 z-10 border-b">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t('orders.orderNumber')}: {order.orderNumber}
          </span>
          {getStatusIcon(order.status)}
        </div>
      </div>
      <div className="p-4 space-y-4">
        {/* Order Items */}
        <div className="p-4 rounded-xl bg-muted/50">
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
        </div>
        {/* Status Card */}
        <div className="p-4 rounded-xl bg-muted/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              {t('orders.orderStatus')}
            </h2>
            <Badge variant={getStatusVariant(order.status)}>
              {t(getStatusLabel(order.status))}
            </Badge>
          </div>
          {isActive && (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <currentStepDetails.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {t(currentStepDetails.label)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t('orders.stepOf', {
                    current: step,
                    total: 5,
                  })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {t(currentStepDetails.description)}
              </p>
              <ProgressSteps currentStep={step} numberOfSteps={5} />
            </>
          )}
          {deliveryMethod !== 'personal_handoff' &&
            order.trackingNumber && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
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
        </div>
        {/* Delivery Information */}
        {order.deliveryAddress && (
          <div className="p-4 rounded-xl bg-muted/50">
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
          </div>
        )}
        {/* Payment Information */}
        <div className="p-4 rounded-xl bg-muted/50">
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
                {t(getPaymentStatusLabel(order.paymentStatus))}
              </Badge>
            </div>
            {order.paymentMethod && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t('orders.paymentMethod')}
                </span>
                <span>
                  {t(`paymentMethod.${order.paymentMethod}`)}
                </span>
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
        </div>
        {/* Partner Information */}
        <div className="p-4 rounded-xl bg-muted/50">
          <h2 className="font-semibold mb-4">
            {role === 'client'
              ? t('orders.agentInfo')
              : t('orders.clientInfo')}
          </h2>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {(
                role === 'client'
                  ? order.agent?.avatar
                  : order.client?.avatar
              ) ? (
                <ImageWithFallback
                  src={
                    role === 'client'
                      ? order.agent?.avatar
                      : order.client?.avatar
                  }
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold">
                  {(role === 'client'
                    ? order.agent?.nickname
                    : order.client?.nickname
                  )
                    ?.charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {role === 'client'
                  ? order.agent?.nickname
                  : order.client?.nickname}
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
              onClick={handleContact}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {t('orders.contact')}
            </Button>
          </div>
        </div>
        {/* Order History */}
        {order.history && order.history.length > 0 && (
          <div className="p-4 rounded-xl bg-muted/50">
            <h2 className="font-semibold mb-4">
              {t('orders.orderHistory')}
            </h2>
            <div className="space-y-3">
              {order.history.map(
                (entry: OrderHistory, index: number) => (
                  <div key={entry.id} className="flex space-x-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {index < order.history!.length - 1 && (
                        <div className="w-px h-full bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-3">
                      <p className="font-medium text-sm">
                        {t(getStatusLabel(entry.status))}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(entry.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
        {/* Order Dates */}
        <div className="p-4 rounded-xl bg-muted/50">
          <h2 className="font-semibold mb-4">{t('orders.dates')}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('orders.created')}
              </span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            {order.deliveryMethod === 'personal_handoff' ? (
              <></>
            ) : (
              order.estimatedDeliveryDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('orders.estimatedDelivery')}
                  </span>
                  <span>
                    {formatDate(order.estimatedDeliveryDate)}
                  </span>
                </div>
              )
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
        </div>
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
