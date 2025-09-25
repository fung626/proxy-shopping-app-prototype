import { ArrowLeft, MapPin, Clock, MessageCircle, Shield, User, Package, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar } from '../components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { AgentFeedbackModal } from '../components/AgentFeedbackModal';
import { useLanguage } from '../store/LanguageContext';

interface AgentOffer {
  id: string;
  agentName: string;
  agentAvatar?: string;
  rating: number;
  agentRating?: number; // Alternative rating field for compatibility
  totalOrders: number;
  agentReviews?: number; // Alternative reviews field for compatibility
  completedOrders: number;
  location: string;
  estimatedTime: string;
  estimatedDelivery?: string; // Alternative delivery field for compatibility
  estimatedCost: string | number; // Support both string and number formats
  price?: number; // Direct number format
  serviceFee: string | number; // Support both string and number formats
  totalCost: string | number; // Support both string and number formats
  totalAmount?: number; // Direct number format
  currency?: string; // Currency field
  description: string;
  specialties: string[];
  isVerified: boolean;
  responseTime: string;
}

interface ViewOffersPageProps {
  requestTitle: string;
  offers: AgentOffer[];
  onBack: () => void;
  onContactAgent: (agentId: string) => void;
  onAcceptOffer: (offer: any) => void;
}

export function ViewOffersPage({
  requestTitle,
  offers,
  onBack,
  onContactAgent,
  onAcceptOffer
}: ViewOffersPageProps) {
  const { t } = useLanguage();

  const handleAcceptOffer = (offer: AgentOffer) => {
    // Helper function to parse cost - handles both string and number formats
    const parseCost = (cost: any): number => {
      if (typeof cost === 'number') return cost;
      if (typeof cost === 'string') return parseFloat(cost.replace(/[^\d.]/g, ''));
      return 0;
    };

    // Convert AgentOffer to payment format
    const paymentOffer = {
      id: offer.id,
      agentName: offer.agentName,
      agentAvatar: offer.agentAvatar,
      agentRating: offer.rating || offer.agentRating,
      agentReviews: offer.totalOrders || offer.agentReviews,
      price: offer.price || parseCost(offer.estimatedCost),
      serviceFee: offer.serviceFee || parseCost(offer.serviceFee),
      totalAmount: offer.totalAmount || parseCost(offer.totalCost),
      estimatedDelivery: offer.estimatedTime || offer.estimatedDelivery,
      description: offer.description,
      currency: offer.currency || 'USD'
    };
    onAcceptOffer(paymentOffer);
  };

  // Mock feedback data for agents
  const getAgentFeedback = (agentId: string) => {
    const feedbackData: { [key: string]: any[] } = {
      '1': [
        {
          id: 'fb-001',
          rating: 5,
          comment: 'Sarah was amazing! She found the exact sneakers I wanted and even got them at a discount. Communication was excellent throughout.',
          clientName: 'Alex Martinez',
          createdDate: '2024-01-15',
          requestType: 'Sneakers',
          isVerified: true
        },
        {
          id: 'fb-002',
          rating: 5,
          comment: 'Perfect service! Got authentic Jordan 1s in perfect condition. Will definitely use Sarah again.',
          clientName: 'Jessica Wong',
          createdDate: '2024-01-12',
          requestType: 'Fashion',
          isVerified: true
        },
        {
          id: 'fb-003',
          rating: 4,
          comment: 'Great agent, very professional. Only minor issue was shipping took a day longer than expected.',
          clientName: 'David Kim',
          createdDate: '2024-01-08',
          requestType: 'Electronics',
          isVerified: true
        },
        {
          id: 'fb-004',
          rating: 5,
          comment: 'Sarah knows her stuff! She helped me authenticate the items and provided excellent photos.',
          clientName: 'Maria Santos',
          createdDate: '2024-01-05',
          requestType: 'Sneakers',
          isVerified: true
        }
      ],
      '2': [
        {
          id: 'fb-005',
          rating: 5,
          comment: 'Mike is super fast and reliable. Found my items within hours and kept me updated the whole time.',
          clientName: 'Jennifer Li',
          createdDate: '2024-01-18',
          requestType: 'Electronics',
          isVerified: true
        },
        {
          id: 'fb-006',
          rating: 4,
          comment: 'Good service overall. Mike found good deals and the items arrived quickly.',
          clientName: 'Robert Chen',
          createdDate: '2024-01-14',
          requestType: 'Home & Garden',
          isVerified: true
        },
        {
          id: 'fb-007',
          rating: 5,
          comment: 'Excellent agent! Mike went above and beyond to find exactly what I needed.',
          clientName: 'Sarah Johnson',
          createdDate: '2024-01-10',
          requestType: 'Fashion',
          isVerified: true
        }
      ],
      '3': [
        {
          id: 'fb-008',
          rating: 5,
          comment: 'Emma is incredibly detail-oriented. She caught issues with quality that I would have missed.',
          clientName: 'Michael Brown',
          createdDate: '2024-01-16',
          requestType: 'Beauty',
          isVerified: true
        },
        {
          id: 'fb-009',
          rating: 4,
          comment: 'Very thorough agent. Emma takes her time to ensure everything is perfect.',
          clientName: 'Lisa Taylor',
          createdDate: '2024-01-11',
          requestType: 'Luxury Goods',
          isVerified: true
        },
        {
          id: 'fb-010',
          rating: 5,
          comment: 'Outstanding service! Emma found luxury items I thought were impossible to get.',
          clientName: 'Amanda Davis',
          createdDate: '2024-01-07',
          requestType: 'Fashion',
          isVerified: true
        }
      ]
    };
    return feedbackData[agentId] || [];
  };

  // Mock offers data if none provided
  const defaultOffers: AgentOffer[] = [
    {
      id: '1',
      agentName: 'Sarah Chen',
      rating: 4.9,
      totalOrders: 142,
      completedOrders: 127,
      location: 'New York, USA',
      estimatedTime: '3-5 days',
      estimatedCost: '$240',
      serviceFee: '$25',
      totalCost: '$265',
      description: 'Specialized in sneaker authentication and limited edition releases. I have connections with major retailers and can source hard-to-find items.',
      specialties: ['Sneakers', 'Fashion', 'Electronics'],
      isVerified: true,
      responseTime: '< 1 hour'
    },
    {
      id: '2',
      agentName: 'Mike Johnson',
      rating: 4.7,
      totalOrders: 98,
      completedOrders: 89,
      location: 'Los Angeles, USA',
      estimatedTime: '2-4 days',
      estimatedCost: '$235',
      serviceFee: '$20',
      totalCost: '$255',
      description: 'Fast and reliable shopping agent with extensive knowledge of retail locations and discount opportunities.',
      specialties: ['Electronics', 'Fashion', 'Home & Garden'],
      isVerified: true,
      responseTime: '< 2 hours'
    },
    {
      id: '3',
      agentName: 'Emma Davis',
      rating: 4.8,
      totalOrders: 173,
      completedOrders: 156,
      location: 'Chicago, USA',
      estimatedTime: '4-6 days',
      estimatedCost: '$242',
      serviceFee: '$18',
      totalCost: '$260',
      description: 'Detail-oriented agent with focus on quality verification and customer satisfaction. Great for complex requests.',
      specialties: ['Beauty', 'Fashion', 'Luxury Goods'],
      isVerified: false,
      responseTime: '< 3 hours'
    }
  ];

  const displayOffers = offers.length > 0 ? offers : defaultOffers;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center space-x-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{t('offers.agentOffers')}</h1>
            <p className="text-sm text-muted-foreground">{requestTitle}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Offers Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {displayOffers.length} {displayOffers.length === 1 ? t('offers.agentHas') : t('offers.agentsHave')} {t('offers.offeredToHelp')}
          </p>
        </div>

        {/* Offers List */}
        <div className="space-y-4">
          {displayOffers.map((offer) => (
            <div key={offer.id} className="p-4 bg-muted/50 rounded-lg">
              {/* Agent Header */}
              <div className="flex items-start space-x-3 mb-4">
                <Avatar className="w-12 h-12">
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold">{offer.agentName}</h3>
                    {offer.isVerified && (
                      <div className="flex items-center space-x-1">
                        <Shield className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600">{t('common.verified')}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs mb-2">
                    <div className="flex items-center space-x-1">
                      <Package className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium text-foreground">{offer.totalOrders}</span>
                      <span className="text-muted-foreground">{t('agent.totalOrders')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Check className="h-3 w-3 text-green-500" />
                      <span className="font-medium text-foreground">{offer.completedOrders}</span>
                      <span className="text-muted-foreground">{t('agent.completed')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{offer.location}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-semibold text-primary">{offer.totalCost}</div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <div>{t('payment.cost')}: {offer.estimatedCost}</div>
                    <div>{t('payment.fee')}: {offer.serviceFee}</div>
                  </div>
                </div>
              </div>

              {/* Offer Details */}
              <div className="space-y-3 mb-4">
                <p className="text-sm text-muted-foreground">{offer.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{offer.estimatedTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <span>{t('agent.respondsIn')} {offer.responseTime}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                  {offer.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onContactAgent(offer.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('common.message')}
                  </Button>
                  
                  <AgentFeedbackModal
                    agentName={offer.agentName}
                    agentId={offer.id}
                    overallRating={offer.rating}
                    completedOrders={offer.completedOrders}
                    recentFeedback={getAgentFeedback(offer.id)}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <User className="h-4 w-4 mr-2" />
                        {t('agent.reviews')}
                      </Button>
                    }
                  />
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="w-full"
                    >
                      {t('offers.acceptOffer')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('offers.acceptOffer')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('offers.acceptOfferConfirmation', { 
                          agentName: offer.agentName, 
                          totalCost: offer.totalCost,
                          estimatedCost: offer.estimatedCost,
                          serviceFee: offer.serviceFee
                        })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleAcceptOffer(offer)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {t('offers.acceptOffer')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>

        {/* No Offers State */}
        {displayOffers.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('offers.noOffersYet')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('offers.requestIsLive')}
            </p>
            <Button variant="outline">{t('request.shareRequest')}</Button>
          </div>
        )}

        <div className="pb-8" />
      </div>
    </div>
  );
}