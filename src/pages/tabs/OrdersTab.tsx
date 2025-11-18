import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { offersSupabaseService } from '@/services/offersSupabaseService';
import { ordersSupabaseService } from '@/services/ordersSupabaseService';
import { requestsSupabaseService } from '@/services/requestsSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useAuthStore } from '@/store/zustand';
import { DetailedOrder } from '@/types/order';
import {
  getOrderRole,
  getOrderStep,
  getRoleBadgeVariant,
  getRoleLabel,
  getStatusLabel,
  getStatusVariant,
  getStepDetails,
} from '@/utils/orders';
import { Package, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrdersTabSkeleton } from '../orders/OrdersTabSkeleton';

export function OrdersTab() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [orders, setOrders] = useState<DetailedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'client' | 'agent'>(
    'all'
  );

  useEffect(() => {
    if (user) {
      fetch();
    }
  }, [user, filter]);

  const fetch = async () => {
    try {
      setLoading(true);
      let fetchedOrders: DetailedOrder[] = [];
      if (filter === 'all') {
        fetchedOrders = await ordersSupabaseService.getOrders();
      } else {
        fetchedOrders = await ordersSupabaseService.getOrders({
          role: filter,
        });
      }
      // Enrich orders with request/offer details
      const Orders = await Promise.all(
        fetchedOrders.map(async (order) => {
          let additionalData: any = {};
          // Fetch request details if exists
          if (order.requestId) {
            const request =
              await requestsSupabaseService.getRequestById(
                order.requestId
              );
            if (request) {
              additionalData.request = request;
              additionalData.requestDeliveryMethod =
                request.delivery_method;
            }
          }
          // Fetch offer details if exists
          if (order.offerId) {
            const offer = await offersSupabaseService.getOfferById(
              order.offerId
            );
            if (offer) {
              additionalData.offer = offer;
            }
          }

          return {
            ...order,
            ...additionalData,
          };
        })
      );

      setOrders(Orders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactUser = (order: DetailedOrder) => {
    const role = getOrderRole(user, order);
    const otherUserId =
      role === 'client' ? order.agentUserId : order.clientUserId;
    navigate('/messages', {
      state: {
        selectedUserId: otherUserId,
        orderId: order.id,
      },
    });
  };

  if (!user) {
    return (
      <div className="flex-1 bg-background pb-[74px]">
        <div className="bg-card px-4 pt-12 pb-6">
          <h1 className="text-3xl font-semibold text-foreground">
            {t('nav.orders')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('orders.description')}
          </p>
        </div>
        <div className="px-4 py-8">
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t('orders.signInPrompt')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('orders.signInDescription')}
            </p>
            <Button
              onClick={() => navigate('/auth/signin')}
              className="px-8"
            >
              {t('profile.signIn')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  console.log('[DEBUG] OrdersTab Rendered', orders);

  return (
    <div className="flex-1 bg-background pb-[74px]">
      {/* Header */}
      <div className="bg-card px-4 pt-12 pb-6">
        <h1 className="text-3xl font-semibold text-foreground">
          {t('nav.orders')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('orders.description')}
        </p>
      </div>
      <div className="px-4 py-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            {t('orders.allOrders')}
          </Button>
          <Button
            variant={filter === 'client' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('client')}
          >
            {t('orders.myRequests')}
          </Button>
          <Button
            variant={filter === 'agent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('agent')}
          >
            {t('orders.myOffers')}
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 text-center bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1">
              {orders.length}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('orders.totalOrders')}
            </div>
          </div>
          <div className="p-4 text-center bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {orders.filter((o) => o.status === 'completed').length}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('orders.completed')}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <OrdersTabSkeleton />
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('orders.noOrdersYet')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('orders.createRequestPrompt')}
            </p>
            <Button onClick={() => navigate('/create')}>
              {t('orders.createRequest')}
            </Button>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4">
            {orders.map((order) => {
              const role = getOrderRole(user, order);
              const step = getOrderStep(
                order.status,
                order.deliveryMethod
              );
              const currentStepDetails = getStepDetails(
                step,
                role,
                order.deliveryMethod
              );
              const title =
                order.request?.title ||
                order.offer?.title ||
                t('orders.order');
              const category =
                order.request?.category ||
                order.offer?.category ||
                '';
              const images =
                order.request?.images || order.offer?.images || [];
              return (
                <div
                  key={order.id}
                  className="p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex space-x-4 mb-4">
                    {/* Image */}
                    {images && images.length > 0 && (
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <ImageWithFallback
                            src={images[0]}
                            alt={title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <Badge
                          variant={getRoleBadgeVariant(role)}
                          className="text-xs flex-shrink-0"
                        >
                          {t(getRoleLabel(role))}
                        </Badge>
                        <Badge
                          variant={getStatusVariant(order.status)}
                          className="ml-2 flex-shrink-0"
                        >
                          {t(getStatusLabel(order.status))}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-foreground mb-2 leading-tight">
                        {title}
                      </h3>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>{category}</span>
                        <span className="font-semibold text-foreground">
                          {order.currency}{' '}
                          {order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  {order.status !== 'cancelled' &&
                    order.status !== 'refunded' && (
                      <div className="mb-4">
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
                        {order.deliveryMethod !==
                          'personal_handoff' &&
                          order.trackingNumber && (
                            <div className="mb-3 p-3 bg-background rounded-lg border">
                              <div className="flex items-center space-x-2">
                                <Truck className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs font-mono text-foreground">
                                  {order.trackingNumber}
                                </span>
                              </div>
                            </div>
                          )}
                        <ProgressSteps
                          currentStep={step}
                          numberOfSteps={5}
                          className="px-0 py-2"
                        />
                      </div>
                    )}

                  {/* Partner Info */}
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground">
                      {role === 'client'
                        ? t('orders.shoppingAgent')
                        : t('orders.client')}
                    </p>
                    <p className="font-medium">
                      {role === 'client'
                        ? order.agent?.nickname || 'Agent'
                        : order.client?.nickname || 'Client'}
                    </p>
                  </div>

                  {/* Actions */}
                  {order.status === 'completed' ? (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            navigate(`/orders/${order.id}`)
                          }
                        >
                          {t('orders.details')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            navigate(`/orders/${order.id}/feedback`)
                          }
                        >
                          {t('orders.viewFeedback')}
                        </Button>
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          navigate(
                            `/orders/${order.id}/leave-feedback`
                          )
                        }
                      >
                        {t('orders.leaveFeedback')}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          navigate(`/orders/${order.id}`)
                        }
                      >
                        {t('orders.details')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleContactUser(order)}
                      >
                        {role === 'client'
                          ? t('orders.contactAgent')
                          : t('orders.contactClient')}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
