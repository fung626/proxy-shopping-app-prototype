import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgressSteps } from '@/components/ui/progress-steps';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/store/LanguageContext';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Edit3,
  Eye,
  MapPin,
  MessageCircle,
  Package,
  PackageCheck,
  Scale,
  Search,
  Send,
  Share2,
  Star,
  Truck,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getRequestById } from '@/services/requestsSupabaseService';

interface RequestDetailsPageProps {
  request: {
    id: string;
    title: string;
    description: string;
    status: string;
    step: number;
    role: string;
    agent?: string;
    client?: string;
    location: string;
    createdDate: string;
    category: string;
    deliveryMethod?: 'ship' | 'personal';
    budget?: string;
    timeline?: string;
    requirements?: string[];
    images?: string[];
    isPurchased?: boolean;
    isShipped?: boolean;
    purchaseDate?: string;
    shippingDate?: string;
    trackingNumber?: string;
  };
  onBack?: () => void;
  onContactAgent?: () => void;
  onContactClient?: (clientId?: string) => void;
  onViewOffers?: () => void;
  onCancelRequest?: () => void;
  onShareRequest?: () => void;
  onViewFeedback?: () => void;
  onLeaveFeedback?: () => void;
  onUpdateStatus?: (
    newStatus: string,
    notes?: string,
    trackingNumber?: string
  ) => void;
  onNavigateToArbitration?: () => void;
}

export function RequestDetailsPage({
  onBack,
  onShareRequest,
  onContactAgent,
  onContactClient,
  onViewOffers,
  onCancelRequest,
  onLeaveFeedback,
  onViewFeedback,
  onUpdateStatus,
  onNavigateToArbitration,
}: Omit<RequestDetailsPageProps, 'request'>) {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();

  const [request, setRequest] = useState<
    RequestDetailsPageProps['request'] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Move hooks to the top of the component
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchRequest = async () => {
      try {
        setLoading(true);
        const data = await getRequestById(id);
        setRequest(data);
      } catch (err) {
        setError(t('requestDetails.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id, t]);

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!request) {
    return <div>{t('requestDetails.noRequestData')}</div>;
  }

  const getStepDetails = (step: number, role: string) => {
    if (role === 'client') {
      const steps = [
        {
          icon: Search,
          label: t('requestSteps.client.requestPosted'),
          description: t('requestSteps.client.waitingForAgents'),
        },
        {
          icon: Package,
          label: t('requestSteps.client.agentAssigned'),
          description: t('requestSteps.client.shoppingInProgress'),
        },
        {
          icon: CreditCard,
          label: t('requestSteps.client.itemsPurchased'),
          description: t('requestSteps.client.itemsBoughtByAgent'),
        },
        {
          icon: PackageCheck,
          label: t('requestSteps.client.packageShipped'),
          description: t('requestSteps.client.packageSentOut'),
        },
        {
          icon: Truck,
          label: t('requestSteps.client.delivered'),
          description: t('requestSteps.client.orderComplete'),
        },
      ];
      return steps[step - 1] || steps[0];
    } else {
      const steps = [
        {
          icon: Search,
          label: t('requestSteps.agent.requestAccepted'),
          description: t('requestSteps.agent.startingShopping'),
        },
        {
          icon: Package,
          label: t('requestSteps.agent.shoppingStarted'),
          description: t('requestSteps.agent.findingItems'),
        },
        {
          icon: CreditCard,
          label: t('requestSteps.agent.itemsPurchased'),
          description: t(
            'requestSteps.agent.itemsBoughtSuccessfully'
          ),
        },
        {
          icon: PackageCheck,
          label: t('requestSteps.agent.packageShipped'),
          description: t('requestSteps.agent.packageSentToClient'),
        },
        {
          icon: Truck,
          label: t('requestSteps.agent.delivered'),
          description: t('requestSteps.agent.successfullyCompleted'),
        },
      ];
      return steps[step - 1] || steps[0];
    }
  };

  const getStatusVariant = (status: string) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'in progress':
        return 'secondary';
      case 'completed':
        return 'outline';
      default:
        return 'default';
    }
  };

  const currentStepDetails = getStepDetails(
    request.step,
    request.role
  );

  // Available status options based on current status and role
  const getAvailableStatusOptions = () => {
    if (request.role !== 'agent') return [];

    const isPersonalDelivery = request.deliveryMethod === 'personal';

    const statusMap: {
      [key: string]: { value: string; label: string }[];
    } = {
      Active: [
        {
          value: 'shopping',
          label: t('requestStatus.shoppingStarted'),
        },
        {
          value: 'purchased',
          label: t('requestStatus.itemsPurchased'),
        },
      ],
      'In Progress': [
        {
          value: 'purchased',
          label: t('requestStatus.itemsPurchased'),
        },
        ...(isPersonalDelivery
          ? [
              {
                value: 'ready-for-pickup',
                label: t('requestStatus.readyForPickup'),
              },
            ]
          : [
              {
                value: 'shipped',
                label: t('requestStatus.packageShipped'),
              },
            ]),
        {
          value: 'delivered',
          label: isPersonalDelivery
            ? t('requestStatus.deliveredPersonally')
            : t('requestStatus.packageDelivered'),
        },
      ],
      shopping: [
        {
          value: 'purchased',
          label: t('requestStatus.itemsPurchased'),
        },
        ...(isPersonalDelivery
          ? [
              {
                value: 'ready-for-pickup',
                label: t('requestStatus.readyForPickup'),
              },
            ]
          : [
              {
                value: 'shipped',
                label: t('requestStatus.packageShipped'),
              },
            ]),
      ],
      purchased: [
        ...(isPersonalDelivery
          ? [
              {
                value: 'ready-for-pickup',
                label: t('requestStatus.readyForPickup'),
              },
            ]
          : [
              {
                value: 'shipped',
                label: t('requestStatus.packageShipped'),
              },
            ]),
        {
          value: 'delivered',
          label: isPersonalDelivery
            ? t('requestStatus.deliveredPersonally')
            : t('requestStatus.packageDelivered'),
        },
      ],
      shipped: [
        {
          value: 'delivered',
          label: t('requestStatus.packageDelivered'),
        },
      ],
      'ready-for-pickup': [
        {
          value: 'delivered',
          label: t('requestStatus.deliveredPersonally'),
        },
      ],
    };

    return statusMap[request.status] || [];
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !onUpdateStatus) return;

    // Validate tracking number for shipping status
    if (selectedStatus === 'shipped' && !trackingNumber.trim()) {
      return; // Don't proceed if tracking number is required but not provided
    }

    setIsUpdatingStatus(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      onUpdateStatus(
        selectedStatus,
        statusNotes,
        trackingNumber.trim() || undefined
      );
      setShowStatusUpdate(false);
      setSelectedStatus('');
      setStatusNotes('');
      setTrackingNumber('');
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Mock images if none provided - showing more for better demonstration
  const sampleImages = [
    'https://images.unsplash.com/photo-1726695716109-68a7321c0664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob3BpaW5nJTIwcHJvZHVjdHxlbnwxfHx8fDE3NTg2MzU5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1758467700917-3517eb11ec8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHMlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NTg2MzU5MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1598099947145-e85739e7ca28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTg2MTIyMDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMGJhZyUyMGZhc2hpb258ZW58MXx8fHwxNzU4NjM1OTI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzU4NjM1OTMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMGNlbnRlcnxlbnwxfHx8fDE3NTg2MzU5MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  ];

  const displayImages =
    request.images && request.images.length > 0
      ? request.images
      : sampleImages;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                {request.role === 'client'
                  ? t('requestDetails.title')
                  : t('requestDetails.offerDetails')}
              </h1>
              <Badge
                variant={getStatusVariant(request.status)}
                className="text-xs"
              >
                {request.status}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onShareRequest}
            className="rounded-full"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Main Request Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {request.title}
          </h2>
          <p className="text-muted-foreground mb-4">
            {request.description}
          </p>
        </div>

        <div className="space-y-6">
          {/* Reference Images */}
          {displayImages && displayImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  {t('requestDetails.referenceImages')}
                </h3>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                  {displayImages.length}{' '}
                  {displayImages.length === 1
                    ? t('requestDetails.image')
                    : t('requestDetails.images')}
                </span>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                {/* <Carousel
                  className="w-full"
                  opts={{
                    align: 'start',
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {displayImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                          <ImageWithFallback
                            src={image}
                            alt={`Request reference ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {displayImages.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2 bg-background/80 hover:bg-background border-0" />
                      <CarouselNext className="right-2 bg-background/80 hover:bg-background border-0" />
                    </>
                  )}
                </Carousel> */}
              </div>
            </div>
          )}

          {/* Request Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              {t('requestDetails.details')}
            </h3>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                {/* Location */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      {t('requestDetails.location')}
                    </p>
                    <p className="font-medium text-sm truncate">
                      {request.location}
                    </p>
                  </div>
                </div>

                {/* Date Posted */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      {t('requestDetails.datePosted')}
                    </p>
                    <p className="font-medium text-sm truncate">
                      {request.createdDate}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      {t('requestDetails.category')}
                    </p>
                    <p className="font-medium text-sm truncate">
                      {request.category}
                    </p>
                  </div>
                </div>

                {/* Delivery Method */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center flex-shrink-0">
                    {request.deliveryMethod === 'personal' ? (
                      <User className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Truck className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      {t('requestDetails.deliveryMethod')}
                    </p>
                    <p className="font-medium text-sm truncate">
                      {request.deliveryMethod === 'personal'
                        ? t('requestDetails.deliverPersonally')
                        : t('requestDetails.shipToMe')}
                    </p>
                    <Badge
                      variant={
                        request.deliveryMethod === 'personal'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="text-xs px-2 py-0.5 mt-1 inline-block"
                    >
                      {request.deliveryMethod === 'personal'
                        ? t('requestDetails.inPerson')
                        : t('requestDetails.shipping')}
                    </Badge>
                  </div>
                </div>

                {/* Budget */}
                {request.budget && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">
                        {t('requestDetails.budget')}
                      </p>
                      <p className="font-semibold text-sm text-primary truncate">
                        {request.budget}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {request.role === 'client' && request.agent && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                {t('requestDetails.shoppingAgent')}
              </h3>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{request.agent}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            4.8
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          •
                        </span>
                        <span className="text-xs text-muted-foreground">
                          156 {t('requestDetails.orders')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          •
                        </span>
                        <div className="flex items-center space-x-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600">
                            {t('requestDetails.verified')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {request.role === 'agent' && request.client && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                {t('requestDetails.client')}
              </h3>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{request.client}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('requestDetails.memberSince')} 2023
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                {t('requestDetails.progressStatus')}
              </h3>
              <div className="flex items-center space-x-2">
                {/* Status Update Button for Agents */}
                {request.role === 'agent' &&
                  request.status !== 'Completed' &&
                  getAvailableStatusOptions().length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setShowStatusUpdate(!showStatusUpdate)
                      }
                      className="text-xs"
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      {t('requestDetails.updateStatus')}
                    </Button>
                  )}
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <currentStepDetails.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {currentStepDetails.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentStepDetails.description}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full flex-shrink-0">
                  {t('requestDetails.stepOf', {
                    current: request.step,
                    total: 5,
                  })}
                </span>
              </div>

              {/* Proxy Shopping Milestones */}
              {(request.isPurchased || request.isShipped) && (
                <div className="p-3 shopping-progress-box rounded-lg">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-medium shopping-progress-title">
                      {t('requestDetails.shoppingProgress')}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {request.isPurchased && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-3 w-3 text-green-600" />
                          <span className="text-xs shopping-progress-text">
                            {t('requestDetails.itemsPurchased')}
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
                          <PackageCheck className="h-3 w-3 shopping-progress-blue-text" />
                          <span className="text-xs shopping-progress-blue-text">
                            {t('requestDetails.packageShipped')}
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

              <Separator />

              {/* Progress Steps */}
              <div className="space-y-3">
                <ProgressSteps
                  currentStep={request.step}
                  numberOfSteps={5}
                  className="px-0 py-1"
                />
              </div>
            </div>

            {/* Status Update Form for Agents */}
            {showStatusUpdate && request.role === 'agent' && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      {t('requestDetails.updateRequestStatus')}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowStatusUpdate(false)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <AlertCircle className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="status-select">
                        {t('requestDetails.newStatus')}
                      </Label>
                      <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              'requestDetails.selectNewStatus'
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableStatusOptions().map(
                            (option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status-notes">
                        {t('requestDetails.notes')}
                      </Label>
                      <Textarea
                        id="status-notes"
                        value={statusNotes}
                        onChange={(e) =>
                          setStatusNotes(e.target.value)
                        }
                        placeholder={t(
                          'requestDetails.notesPlaceholder'
                        )}
                        className="min-h-[80px]"
                      />
                    </div>

                    {/* Tracking Number Input for Shipping Status */}
                    {selectedStatus === 'shipped' && (
                      <div className="space-y-2">
                        <Label htmlFor="tracking-number">
                          {t('requestDetails.trackingNumber')}{' '}
                          <span className="text-destructive">
                            {t('requestDetails.required')}
                          </span>
                        </Label>
                        <Input
                          id="tracking-number"
                          value={trackingNumber}
                          onChange={(e) =>
                            setTrackingNumber(e.target.value)
                          }
                          placeholder={t(
                            'requestDetails.trackingNumberPlaceholder'
                          )}
                          className="font-mono"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          {t('requestDetails.trackingNumberHelper')}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Button
                        onClick={handleStatusUpdate}
                        disabled={
                          !selectedStatus ||
                          isUpdatingStatus ||
                          (selectedStatus === 'shipped' &&
                            !trackingNumber.trim())
                        }
                        size="sm"
                        className="flex-1"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        {isUpdatingStatus
                          ? t('requestDetails.updating')
                          : t('requestDetails.updateStatus')}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowStatusUpdate(false)}
                        size="sm"
                      >
                        {t('common.cancel')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Requirements (if available) */}
          {request.requirements &&
            request.requirements.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">
                  {t('requestDetails.specificRequirements')}
                </h3>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <ul className="space-y-3">
                    {request.requirements.map((req, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 pb-8">
            {request.status === 'Completed' ? (
              /* Feedback Buttons for Completed Requests */
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={onViewFeedback}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {t('requestDetails.viewFeedback')}
                  </Button>
                  <Button
                    onClick={onLeaveFeedback}
                    size="lg"
                    className="flex-1"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('requestDetails.leaveFeedback')}
                  </Button>
                </div>

                {/* Contact buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {request.role === 'client' && onContactAgent && (
                    <Button
                      onClick={onContactAgent}
                      variant="outline"
                      size="lg"
                      className="flex-1"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t('requestDetails.contactAgent')}
                    </Button>
                  )}
                  {request.role === 'agent' && onContactClient && (
                    <Button
                      onClick={() => onContactClient?.()}
                      variant="outline"
                      size="lg"
                      className="flex-1"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t('requestDetails.contactClient')}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              /* Standard Action Buttons for Active Requests */
              <div className="space-y-3">
                {/* Primary actions based on role */}
                {request.role === 'client' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {request.status === 'Active' && (
                      <Button
                        onClick={onViewOffers}
                        size="lg"
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {t('requestDetails.viewOffers')}
                      </Button>
                    )}
                    {request.agent && onContactAgent && (
                      <Button
                        onClick={onContactAgent}
                        variant="outline"
                        size="lg"
                        className="flex-1"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {t('requestDetails.contactAgent')}
                      </Button>
                    )}
                    {request.status === 'Active' && (
                      <Button
                        onClick={onCancelRequest}
                        variant="destructive"
                        size="lg"
                        className="flex-1"
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {t('requestDetails.cancelRequest')}
                      </Button>
                    )}
                  </div>
                ) : (
                  /* Agent view buttons */
                  <div className="space-y-3">
                    {onContactClient && (
                      <Button
                        onClick={() => onContactClient?.()}
                        variant="outline"
                        size="lg"
                        className="w-full"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {t('requestDetails.contactClient')}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Arbitration Centre Button - Available for all requests */}
            <div className="pt-3">
              <Button
                onClick={onNavigateToArbitration}
                variant="destructive"
                size="lg"
                className="w-full"
              >
                <Scale className="h-4 w-4 mr-2" />
                {t('requestDetails.arbitrationCentre')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { RequestDetailsPageProps };
