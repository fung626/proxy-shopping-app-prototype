import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { offersSupabaseService } from '@/services/offersSupabaseService';
import { ordersSupabaseService } from '@/services/ordersSupabaseService';
import { requestsSupabaseService } from '@/services/requestsSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useAuthStore } from '@/store/zustand';
import { OrderStatus, OrderWithDetails } from '@/types/order';
import {
  CreditCard,
  Loader2,
  Package,
  PackageCheck,
  Search,
  Truck,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Extended order type with enriched data
interface EnrichedOrder extends OrderWithDetails {
  requestTitle?: string;
  requestCategory?: string;
  requestImages?: string[];
  offerTitle?: string;
  offerCategory?: string;
  offerImages?: string[];
}

export function OrdersTab() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [showInfoBox, setShowInfoBox] = useState(true);
  const [orders, setOrders] = useState<EnrichedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'client' | 'agent'>(
    'all'
  );

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user, filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      let fetchedOrders: OrderWithDetails[] = [];

      if (filter === 'all') {
        fetchedOrders = await ordersSupabaseService.getOrders();
      } else {
        fetchedOrders = await ordersSupabaseService.getOrders({
          role: filter,
        });
      }

      // Enrich orders with request/offer details
      const enrichedOrders = await Promise.all(
        fetchedOrders.map(async (order) => {
          let additionalData: any = {};

          // Fetch request details if exists
          if (order.requestId) {
            const request =
              await requestsSupabaseService.getRequestById(
                order.requestId
              );
            if (request) {
              additionalData.requestTitle = request.title;
              additionalData.requestCategory = request.category;
              additionalData.requestImages = request.images;
            }
          }

          // Fetch offer details if exists
          if (order.offerId) {
            const offer = await offersSupabaseService.getOfferById(
              order.offerId
            );
            if (offer) {
              additionalData.offerTitle = offer.title;
              additionalData.offerCategory = offer.category;
              additionalData.offerImages = offer.images;
            }
          }

          return {
            ...order,
            ...additionalData,
          };
        })
      );

      setOrders(enrichedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderRole = (
    order: OrderWithDetails
  ): 'client' | 'agent' => {
    return order.clientUserId === user?.id ? 'client' : 'agent';
  };

  const getOrderStep = (status: OrderStatus): number => {
    const statusStepMap: Record<string, number> = {
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
    return statusStepMap[status] || 1;
  };

  const getStepDetails = (step: number, role: 'client' | 'agent') => {
    if (role === 'client') {
      const steps = [
        {
          icon: Search,
          label: t('orders.steps.requestPosted'),
          description: t('orders.steps.waitingForAgents'),
        },
        {
          icon: Package,
          label: t('orders.steps.agentAssigned'),
          description: t('orders.steps.shoppingInProgress'),
        },
        {
          icon: CreditCard,
          label: t('orders.steps.itemsPurchased'),
          description: t('orders.steps.itemsBoughtByAgent'),
        },
        {
          icon: PackageCheck,
          label: t('orders.steps.packageShipped'),
          description: t('orders.steps.packageSentOut'),
        },
        {
          icon: Truck,
          label: t('orders.steps.delivered'),
          description: t('orders.steps.orderComplete'),
        },
      ];
      return steps[step - 1] || steps[0];
    } else {
      const steps = [
        {
          icon: Search,
          label: t('orders.steps.requestAccepted'),
          description: t('orders.steps.startingShopping'),
        },
        {
          icon: Package,
          label: t('orders.steps.shoppingStarted'),
          description: t('orders.steps.findingRequestedItems'),
        },
        {
          icon: CreditCard,
          label: t('orders.steps.itemsPurchased'),
          description: t('orders.steps.itemsBoughtSuccessfully'),
        },
        {
          icon: PackageCheck,
          label: t('orders.steps.packageShipped'),
          description: t('orders.steps.packageSentToClient'),
        },
        {
          icon: Truck,
          label: t('orders.steps.delivered'),
          description: t('orders.steps.successfullyCompleted'),
        },
      ];
      return steps[step - 1] || steps[0];
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    const statusMap: Record<string, string> = {
      pending_payment: t('orders.status.pending_payment'),
      payment_confirmed: t('orders.status.paid'),
      processing: t('orders.status.shopping'),
      shipped: t('orders.status.shipped'),
      in_transit: t('orders.status.in_transit'),
      delivered: t('orders.status.delivered'),
      completed: t('orders.status.completed'),
      cancelled: t('orders.status.cancelled'),
      refunded: t('orders.status.refunded'),
      disputed: t('orders.status.cancelled'),
    };
    return statusMap[status] || status;
  };

  const getStatusVariant = (
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

  const getRoleBadgeVariant = (role: 'client' | 'agent') => {
    return role === 'client' ? 'default' : 'secondary';
  };

  const getRoleLabel = (role: 'client' | 'agent') => {
    return role === 'client'
      ? t('orders.request')
      : t('orders.offer');
  };

  const handleContactUser = (order: OrderWithDetails) => {
    const role = getOrderRole(order);
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
        {/* Info Box */}
        {showInfoBox && (
          <div className="mb-6 p-4 bg-muted/50 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">
                    {t('orders.orderManagement')}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('orders.orderManagementDescription')}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground ml-2"
                onClick={() => setShowInfoBox(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

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
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">
              {t('common.loading')}
            </p>
          </div>
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
              const role = getOrderRole(order);
              const step = getOrderStep(order.status);
              const currentStepDetails = getStepDetails(step, role);
              const title =
                order.requestTitle ||
                order.offerTitle ||
                t('orders.order');
              const category =
                order.requestCategory || order.offerCategory || '';
              const images =
                order.requestImages || order.offerImages || [];

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
                          {getRoleLabel(role)}
                        </Badge>
                        <Badge
                          variant={getStatusVariant(order.status)}
                          className="ml-2 flex-shrink-0"
                        >
                          {getStatusLabel(order.status)}
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
                              {currentStepDetails.label}
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
                          {currentStepDetails.description}
                        </p>

                        {order.trackingNumber && (
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
                        ? order.agentInfo?.nickname || 'Agent'
                        : order.clientInfo?.nickname || 'Client'}
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
