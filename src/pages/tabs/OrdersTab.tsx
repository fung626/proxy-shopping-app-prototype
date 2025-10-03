import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { useLanguage } from '@/store/LanguageContext';
import { User } from '@/types';
import {
  CheckCircle,
  Clock,
  CreditCard,
  Package,
  PackageCheck,
  Search,
  Truck,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface OrdersTabProps {
  user: User | null;
  onShowAuth: () => void;
}

export function OrdersTab({ user, onShowAuth }: OrdersTabProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showInfoBox, setShowInfoBox] = useState(true);
  const requests = [
    {
      id: 'REQ-001',
      title: 'Japanese Skincare Products',
      description:
        'Looking for specific Japanese skincare brands from Tokyo including Shiseido, SK-II, and other premium brands',
      status: 'Active',
      step: 1,
      role: 'client',
      agent: null,
      location: 'Tokyo, Japan',
      createdDate: '2024-01-15',
      category: 'Beauty & Personal Care',
      deliveryMethod: 'ship',
      budget: '$200-300',
      timeline: '7-10 days',
      isPurchased: false,
      isShipped: false,
      purchaseDate: null,
      shippingDate: null,
      trackingNumber: null,
      requirements: [
        'Must be authentic from authorized retailers',
        'Need receipt and proof of purchase',
        'Specific product list provided separately',
      ],
      images: [
        'https://images.unsplash.com/photo-1655357443031-d5e0354b56e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHNraW5jYXJlJTIwcHJvZHVjdHMlMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzU4NjQxMzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ],
    },
    {
      id: 'REQ-002',
      title: 'Limited Edition Sneakers',
      description:
        'Nike Air Jordan 1 Retro High OG from US stores - looking for size 10.5 in Chicago colorway',
      status: 'Items Purchased',
      step: 3,
      role: 'client',
      agent: 'Sarah Chen',
      location: 'New York, USA',
      createdDate: '2024-01-10',
      category: 'Fashion & Clothing',
      deliveryMethod: 'personal',
      budget: '$150-200',
      timeline: '3-5 days',
      isPurchased: true,
      isShipped: false,
      purchaseDate: '2024-01-22',
      shippingDate: null,
      trackingNumber: null,
      requirements: [
        'Size 10.5 US',
        'Must be new and unworn',
        'Original box and tags required',
        'Authentic verification needed',
      ],
      images: [
        'https://images.unsplash.com/photo-1645833889386-2782e290ee3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWtlJTIwYWlyJTIwam9yZGFuJTIwc25lYWtlcnMlMjBzaG9lc3xlbnwxfHx8fDE3NTg2NDEzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ],
    },
    {
      id: 'REQ-003',
      title: 'European Designer Handbag',
      description:
        'Authentic Louis Vuitton bag from Paris boutique - Neverfull MM in Damier Ebene',
      status: 'Completed',
      step: 5,
      role: 'client',
      agent: 'Marie Dubois',
      location: 'Paris, France',
      createdDate: '2024-01-05',
      category: 'Fashion & Clothing',
      deliveryMethod: 'ship',
      budget: '$1,200-1,500',
      timeline: '5-7 days',
      isPurchased: true,
      isShipped: true,
      purchaseDate: '2024-01-18',
      shippingDate: '2024-01-19',
      trackingNumber: 'DHL1234567890',
      requirements: [
        'Authentic from LV boutique',
        'Brand new condition',
        'Original packaging and receipt',
        'Date code verification',
      ],
      images: [
        'https://images.unsplash.com/photo-1740664651822-3a02ec12c121?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3VpcyUyMHZ1aXR0b24lMjBsdXh1cnklMjBoYW5kYmFnJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTg2NDEzNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ],
    },
    {
      id: 'REQ-004',
      title: 'Korean Beauty Products',
      description:
        'Shopping for K-beauty skincare items in Seoul - complete 10-step routine set',
      status: 'Package Shipped',
      step: 4,
      role: 'agent',
      client: 'Emma Wilson',
      location: 'Seoul, South Korea',
      createdDate: '2024-01-12',
      category: 'Beauty & Personal Care',
      deliveryMethod: 'ship',
      budget: '$300-400',
      timeline: '4-6 days',
      isPurchased: true,
      isShipped: true,
      purchaseDate: '2024-01-20',
      shippingDate: '2024-01-21',
      trackingNumber: 'KP987654321',
      requirements: [
        'Korean brands only',
        'Full-size products preferred',
        'Expiration dates must be clearly visible',
        'Shopping receipt required',
      ],
      images: [
        'https://images.unsplash.com/photo-1686831451322-8d8e234a51e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiZWF1dHklMjBwcm9kdWN0cyUyMHNraW5jYXJlfGVufDF8fHx8MTc1ODY0MTM3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ],
    },
    {
      id: 'REQ-005',
      title: 'Vintage Watches Collection',
      description:
        'Finding rare vintage timepieces in Swiss markets - 1960s Omega Speedmaster',
      status: 'Completed',
      step: 4,
      role: 'agent',
      client: 'Michael Brown',
      location: 'Geneva, Switzerland',
      createdDate: '2024-01-08',
      category: 'Luxury Goods',
      budget: '$2,000-3,000',
      timeline: '10-14 days',
      isPurchased: true,
      isShipped: true,
      purchaseDate: '2024-01-16',
      shippingDate: '2024-01-17',
      trackingNumber: 'SW123456789',
      requirements: [
        'Authentic vintage pieces only',
        'Original movement required',
        'Certificate of authenticity',
        'Professional appraisal included',
      ],
      images: [
        'https://images.unsplash.com/photo-1695528589305-5103f5c52306?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwb21lZ2ElMjB3YXRjaCUyMGx1eHVyeSUyMHRpbWVwaWVjZXxlbnwxfHx8fDE3NTg2NDEzNzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ],
    },
    {
      id: 'REQ-006',
      title: 'Italian Leather Shoes',
      description:
        'Looking for authentic Italian handmade leather dress shoes from Florence boutiques - size 42 EU',
      status: 'In Progress',
      step: 2,
      role: 'agent',
      client: 'David Martinez',
      location: 'Florence, Italy',
      createdDate: '2024-01-23',
      category: 'Fashion & Clothing',
      budget: '$400-600',
      timeline: '7-10 days',
      isPurchased: false,
      isShipped: false,
      purchaseDate: null,
      shippingDate: null,
      trackingNumber: null,
      requirements: [
        'Genuine Italian leather only',
        'Size 42 EU (size 9 US)',
        'Traditional craftsmanship preferred',
        'Black or dark brown color',
      ],
      images: [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwbGVhdGhlciUyMHNob2VzJTIwZHJlc3MlMjBmYXNoaW9ufGVufDF8fHx8MTc1ODY0MTM3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ],
    },
    {
      id: 'REQ-007',
      title: 'Japanese Anime Collectibles',
      description:
        'Shopping for limited edition anime figures and merchandise from Akihabara - Studio Ghibli collection',
      status: 'purchased',
      step: 3,
      role: 'agent',
      client: 'Lisa Thompson',
      location: 'Tokyo, Japan',
      createdDate: '2024-01-20',
      category: 'Collectibles & Hobbies',
      budget: '$300-500',
      timeline: '5-8 days',
      isPurchased: true,
      isShipped: false,
      purchaseDate: '2024-01-24',
      shippingDate: null,
      trackingNumber: null,
      requirements: [
        'Authentic licensed merchandise only',
        'Studio Ghibli collection preferred',
        'Original packaging required',
        'No damaged or opened items',
      ],
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGFuaW1lJTIwZmlndXJlcyUyMGNvbGxlY3RpYmxlc3xlbnwxfHx8fDE3NTg2NDEzODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ],
    },
  ];

  const getStepDetails = (step: number, role: string) => {
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

  const getProxyShoppingStatus = (request: any) => {
    if (request.status === 'Completed') {
      return {
        purchased: { completed: true, date: request.purchaseDate },
        shipped: {
          completed: true,
          date: request.shippingDate,
          trackingNumber: request.trackingNumber,
        },
      };
    }

    return {
      purchased: {
        completed: request.isPurchased,
        date: request.purchaseDate,
      },
      shipped: {
        completed: request.isShipped,
        date: request.shippingDate,
        trackingNumber: request.trackingNumber,
      },
    };
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === 'client' ? 'default' : 'secondary';
  };

  const getRoleLabel = (role: string) => {
    return role === 'client'
      ? t('orders.request')
      : t('orders.offer');
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Active':
        return t('orders.status.active');
      case 'In Progress':
        return t('orders.status.inProgress');
      case 'Items Purchased':
        return t('orders.status.itemsPurchased');
      case 'purchased':
        return t('orders.status.purchased');
      case 'Package Shipped':
        return t('orders.status.packageShipped');
      case 'Completed':
        return t('orders.status.completed');
      case 'Cancelled':
        return t('orders.status.cancelled');
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Items Purchased':
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'purchased':
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'Package Shipped':
        return <PackageCheck className="h-4 w-4 text-blue-500" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Active':
        return <Package className="h-4 w-4 text-yellow-500" />;
      default:
        return <Package className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'default';
      case 'Items Purchased':
        return 'default';
      case 'purchased':
        return 'default';
      case 'Package Shipped':
        return 'default';
      case 'Completed':
        return 'default';
      case 'Active':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (!user) {
    return (
      <div className="flex-1 bg-background pb-20">
        {/* Header */}
        <div className="bg-card px-4 pt-12 pb-6">
          <h1 className="text-3xl font-semibold text-foreground">
            {t('nav.orders')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('orders.description')}
          </p>
        </div>

        {/* Sign In Prompt */}
        <div className="px-4 py-8">
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t('orders.signInPrompt')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('orders.signInDescription')}
            </p>
            <Button onClick={onShowAuth} className="px-8">
              {t('profile.signIn')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background pb-20">
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
        {/* Orders Info */}
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

        {/* Request Statistics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 text-center bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1">
              {requests.length}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('orders.totalOrders')}
            </div>
          </div>
          <div className="p-4 text-center bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {
                requests.filter((r) => r.status === 'Completed')
                  .length
              }
            </div>
            <div className="text-xs text-muted-foreground">
              {t('orders.completed')}
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.map((request) => {
            const currentStepDetails = getStepDetails(
              request.step,
              request.role
            );
            return (
              <div
                key={request.id}
                className="p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex space-x-4 mb-4">
                  {/* Image Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                      <ImageWithFallback
                        src={request.images?.[0] || ''}
                        alt={request.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Status Badge - Top Right */}
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant={getRoleBadgeVariant(request.role)}
                        className="text-xs flex-shrink-0"
                      >
                        {getRoleLabel(request.role)}
                      </Badge>
                      <Badge
                        variant={getStatusVariant(request.status)}
                        className="ml-2 flex-shrink-0"
                      >
                        {getStatusLabel(request.status)}
                      </Badge>
                    </div>

                    {/* Title - Full Width */}
                    <h3 className="font-semibold text-foreground mb-3 leading-tight">
                      {request.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {request.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{request.category}</span>
                      <span>•</span>
                      <span>{request.location}</span>
                    </div>
                  </div>
                </div>

                {/* Process Steps */}
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
                        current: request.step,
                        total: 5,
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">
                    {currentStepDetails.description}
                  </p>

                  {/* Proxy Shopping Milestones */}
                  {(request.isPurchased || request.isShipped) && (
                    <div className="mb-3 p-3 shopping-progress-box rounded-lg">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-medium shopping-progress-title">
                          {t('orders.shoppingProgress')}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {request.isPurchased && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-3 w-3 text-green-600 dark:text-green-400" />
                              <span className="text-xs shopping-progress-text">
                                {t('orders.itemsPurchased')}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {request.purchaseDate}
                            </span>
                          </div>
                        )}
                        {request.isShipped && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <PackageCheck className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                              <span className="text-xs shopping-progress-blue-text">
                                {t('orders.packageShipped')}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {request.shippingDate}
                            </span>
                          </div>
                        )}
                        {request.trackingNumber && (
                          <div className="mt-2 p-2 shopping-progress-tracking rounded border">
                            <div className="flex items-center space-x-2">
                              <Truck className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs font-mono text-foreground">
                                {request.trackingNumber}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <ProgressSteps
                    currentStep={request.step}
                    numberOfSteps={5}
                    className="px-0 py-2"
                  />
                </div>

                {request.role === 'client' && request.agent && (
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground">
                      {t('orders.shoppingAgent')}
                    </p>
                    <p className="font-medium">{request.agent}</p>
                  </div>
                )}

                {request.role === 'agent' && request.client && (
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground">
                      {t('orders.client')}
                    </p>
                    <p className="font-medium">{request.client}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {request.status === 'Completed' ? (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          navigate(`/orders/${request.id}`)
                        }
                      >
                        {t('orders.details')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          navigate(`/orders/${request.id}/feedback`)
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
                          `/orders/${request.id}/leave-feedback`
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
                        navigate(`/orders/${request.id}`)
                      }
                    >
                      {t('orders.details')}
                    </Button>
                    {request.role === 'client' ? (
                      request.agent ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            navigate('/messages', {
                              state: {
                                selectedAgentId: `agent_${request.id.toLowerCase()}`,
                              },
                            })
                          }
                        >
                          {t('orders.contactAgent')}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            navigate(`/request/${request.id}/offers`)
                          }
                        >
                          {t('orders.viewOffers')}
                        </Button>
                      )
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          navigate('/messages', {
                            state: {
                              selectedAgentId: `client_${request.id.toLowerCase()}`,
                            },
                          })
                        }
                      >
                        {t('orders.contactClient')}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {requests.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('orders.noOrdersYet')}
            </h3>
            <p className="text-muted-foreground">
              {t('orders.createRequestPrompt')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
