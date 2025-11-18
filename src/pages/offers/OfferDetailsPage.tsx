import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Carousel from '@/components/ui/carousel/carousel';
import { Separator } from '@/components/ui/separator';
import { chatSupabaseService } from '@/services/chatSupabaseService';
import {
  offersSupabaseService as offerService,
  SupabaseOffer,
} from '@/services/offersSupabaseService';
import { ordersSupabaseService } from '@/services/ordersSupabaseService';
import { SupabaseUser } from '@/services/type';
import { userSupabaseService as userService } from '@/services/userSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useAuthStore } from '@/store/zustand/authStore';
import { CreateOrderRequest, DeliveryAddress } from '@/types/order';
import { getCurrencySymbol } from '@/utils/common';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Package,
  Share2,
  Shield,
  Star,
  Truck,
  User,
  Zap,
} from 'lucide-react';
import moment from 'moment';
import { memo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OfferDetailsSkeleton } from './OfferDetailsSkeleton';

export const OfferDetailsPage = memo(function OfferDetailsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  const [offerData, setOfferData] = useState<SupabaseOffer | null>(
    null
  );
  const [agentData, setAgentData] = useState<SupabaseUser | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isContactingAgent, setIsContactingAgent] = useState(false);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    };
    setTimeout(() => {
      scrollToTop();
    }, 100);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const offer = await offerService.getOfferById(id);
        if (offer) {
          setOfferData(offer);
          const agent = await userService.getUserById(offer.user_id);
          if (agent) {
            setAgentData({
              ...agent,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching offer data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const offerFeatures = [
    {
      icon: MapPin,
      title: t('offerDetails.shoppingLocation'),
      description: `${offerData?.location || t('common.unknown')} • ${
        offerData?.shopping_location ||
        t('offerDetails.variousLocations')
      }`,
    },
    {
      icon: Clock,
      title: t('offerDetails.deliveryTime'),
      description: `${
        `${offerData?.estimated_delivery?.start} - ${offerData?.estimated_delivery?.end} ${offerData?.estimated_delivery?.type}` ||
        t('common.tbd')
      } • ${
        offerData?.processing_time ||
        t('offerDetails.defaultProcessing')
      } ${t('offerDetails.processing')}`,
    },
    {
      icon: Package,
      title: t('common.category'),
      description:
        t(`categories.${offerData?.category}`) || t('common.general'),
    },
    {
      icon: Shield,
      title: t('offerDetails.authenticity'),
      description: t('offerDetails.authenticityGuarantee'),
    },
  ];

  const currencySymbol = getCurrencySymbol(offerData?.currency);

  const onBack = () => {
    navigate(-1);
  };

  // const handleImageClick = useCallback(
  //   (image: string, index: number) => {
  //     setSelectedImageIndex(index);
  //     setIsImageModalOpen(true);
  //   },
  //   []
  // );

  // const carouselImages = useMemo(() => {
  //   return displayImages.map((imageUrl, index) => ({
  //     id: `image-${index}`,
  //     imageUrl,
  //     title: `${offerData?.title} - Image ${index + 1}`,
  //     description:
  //       index === 0
  //         ? offerData?.description?.substring(0, 100) + '...'
  //         : undefined,
  //   }));
  // }, [displayImages, offerData?.title, offerData?.description]);

  const handleContactAgent = async () => {
    if (!user || !offerData?.user_id || !id) {
      // If not authenticated, redirect to sign in
      if (!user) {
        navigate('/auth/signin');
        return;
      }
      return;
    }

    setIsContactingAgent(true);
    try {
      // Create or get existing conversation
      const conversation =
        await chatSupabaseService.getOrCreateConversation({
          participant_user_id: offerData.user_id,
          offer_id: id,
        });

      if (conversation) {
        // Navigate to the chat page
        navigate(`/messages/chat/${conversation.id}`);
      } else {
        console.error('Failed to create conversation');
      }
    } catch (error) {
      console.error('Error contacting agent:', error);
    } finally {
      setIsContactingAgent(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!user || !offerData) {
      // If not authenticated, redirect to sign in
      if (!user) {
        navigate('/auth/signin');
        return;
      }
      return;
    }
    const deliveryAddress: DeliveryAddress = {
      fullName:
        user.user_metadata?.full_name || user.email || 'Customer',
      phone: user.user_metadata?.phone || '',
      street: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: offerData.location || 'HK',
    };
    setLoading(true);
    try {
      const orderData: CreateOrderRequest = {
        agentUserId: offerData.user_id,
        clientUserId: user.id,
        offerId: offerData.id,
        currency: offerData.currency || 'HKD',
        deliveryMethod: 'personal_handoff',
        expectedMeetingLocation: offerData.location || 'Hong Kong',
        deliveryAddress: deliveryAddress,
        paymentMethod: 'credit_card',
        items: [
          {
            productName: offerData.title,
            productDescription: offerData.description || '',
            productImageUrl: offerData.images?.[0] || '',
            quantity: 1,
            unitPrice: offerData.price || 0,
            offerId: offerData.id,
          },
        ],
      };
      const order = await ordersSupabaseService.createOrder(
        orderData
      );
      if (order) {
        navigate(`/orders/${order.id}`);
      } else {
        console.error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    console.log('Share offer:', offerData?.id);
  };

  if (loading) {
    return <OfferDetailsSkeleton />;
  }

  const translatedInclusions = [
    t('offerDetails.professionalShoppingService'),
    t('offerDetails.productAuthenticityVerification'),
    t('offerDetails.securePackagingHandling'),
    t('offerDetails.realTimeOrderUpdates'),
    t('offerDetails.qualityInspectionBeforeShipping'),
  ];

  const memberSince = agentData?.created_at
    ? moment(agentData.created_at).fromNow()
    : t('common.unknown');

  return (
    <div className="min-h-screen bg-background">
      {/* Image Carousel */}
      <div className="relative">
        {/* Header overlay */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 safe-area-inset-top">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-900" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg"
            >
              <Share2 className="h-5 w-5 text-gray-900" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorited(!isFavorited)}
              className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorited
                    ? 'fill-primary text-primary'
                    : 'text-gray-900'
                }`}
              />
            </Button>
          </div>
        </div>
        {/* Product Image Carousel */}
        <div className="aspect-[4/3]">
          <Carousel slides={offerData?.images || []} />
        </div>
      </div>
      {/* Content */}
      <div className="px-4 pb-40">
        {/* Title Section */}
        <div className="py-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-semibold text-foreground pr-4">
              {offerData?.title || 'Product'}
            </h1>
            {offerData?.availability === 'In Stock' && (
              <Badge className="bg-green-500 text-white">
                <Zap className="h-3 w-3 mr-1" />
                {t('offerDetails.available')}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mb-4">
            {offerData?.category
              ? t(`categories.${offerData.category}`)
              : t('common.general')}{' '}
            •{' '}
            {offerData?.location ||
              t('offerDetails.variousLocations')}
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {t('offerDetails.updated')} {t('common.recently')}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="h-4 w-4" />
              <span>0 {t('offerDetails.ordersCompleted')}</span>
            </div>
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(offerData?.tags || []).map(
              (tag: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs"
                >
                  #{tag}
                </Badge>
              )
            )}
          </div>
        </div>

        <Separator />

        {/* Agent Info */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            {t('offerDetails.offeredBy')} {agentData?.nickname}
          </h3>
          <div className="flex items-center space-x-4">
            <Avatar className="flex items-center justify-center w-16 h-16 bg-slate-50">
              {agentData?.image ? (
                <ImageWithFallback
                  src={agentData?.image}
                  alt={agentData?.nickname || 'Agent Avatar'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-muted-foreground" />
              )}
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {agentData?.rating || t('offerDetails.noRatings')}
                  </span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {`${agentData?.reviews ?? 0} ${t(
                    'common.reviews'
                  )}` || t('common.noReviews')}
                </span>
                {agentData?.verified && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 text-sm">
                        {t('common.verified')}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {`${t('common.memberSince')} ${memberSince} • ${
                  agentData?.success_rate ?? 0
                }% ${t('offerDetails.successRate')}`}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Offer Features */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            {t('offerDetails.offerDetails')}
          </h3>

          <div className="space-y-4">
            {offerFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* About This Offer */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            {t('offerDetails.aboutThisOffer')}
          </h3>
          <div className="space-y-4">
            {/* Main Description */}
            <div className="space-y-3">
              <p className="text-foreground leading-relaxed">
                {offerData?.description ||
                  'Our experienced shopping agent will carefully source and purchase the requested items for you. We specialize in finding authentic, high-quality products while providing excellent customer service throughout the entire shopping process.'}
              </p>
              {/* Additional offer highlights */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-lg offer-details-authenticity-box">
                  <div className="flex items-center space-x-2 mb-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium offer-details-authenticity-text">
                      {t('offerDetails.authenticity')}
                    </span>
                  </div>
                  <p className="text-xs offer-details-authenticity-subtext">
                    {t('offerDetails.authenticityGuarantee')}
                  </p>
                </div>

                <div className="p-3 rounded-lg offer-details-fast-shipping-box">
                  <div className="flex items-center space-x-2 mb-1">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium offer-details-fast-shipping-text">
                      {t('offerDetails.fastShipping')}
                    </span>
                  </div>
                  <p className="text-xs offer-details-fast-shipping-subtext">
                    {t('offerDetails.expressDelivery')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* What's Included */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            {t('offerDetails.whatsIncluded')}
          </h3>

          <div className="space-y-4">
            {/* Service Inclusions */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {t('offerDetails.serviceInclusions')}
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {translatedInclusions.map(
                  (feature: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Additional Benefits */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {t('offerDetails.additionalBenefits')}
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">
                      {t('offerDetails.freeCommunication')}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('offerDetails.freeCommunicationDesc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle2 className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">
                      {t('offerDetails.purchaseReceipt')}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('offerDetails.purchaseReceiptDesc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">
                      {t('offerDetails.trackingInformation')}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('offerDetails.trackingInformationDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            {/* <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {t('offerDetails.priceBreakdown')}
              </h4>
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>
                      {t('offerDetails.shoppingServiceFee')}
                    </span>
                    <span className="font-medium">
                      {currencySymbol}
                      {(offerData?.price ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {t('offerDetails.platformHandlingFee')}
                    </span>
                    <span className="font-medium">
                      {currencySymbol}
                      {(offerData?.price ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {t('offerDetails.insuranceProtection')}
                    </span>
                    <span className="font-medium">
                      {currencySymbol}
                      {(offerData?.price ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>{t('offerDetails.totalServiceCost')}</span>
                    <span>
                      {currencySymbol}
                      {offerData?.price}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('offerDetails.productCostNote')}
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <Separator />

        {/* Agent Stats */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            {agentData?.nickname}
            {t('offerDetails.agentStats')}
          </h3>

          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {agentData?.total_orders ?? 0}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('common.orders')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {agentData?.success_rate ?? 0}%
              </div>
              <div className="text-xs text-muted-foreground">
                {t('common.successRate')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {agentData?.rating ?? 0}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('common.rating')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="max-w-4xl max-h-full">
            {/* <ProductDetailsCarousel
              images={carouselImages}
              onImageClick={() => {}} // Prevent nested modals
              className="max-h-[80vh]"
            /> */}
          </div>
        </div>
      )}

      {/* Sticky Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-inset-bottom">
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-semibold text-foreground">
                {currencySymbol}
                {offerData?.price || '0.00'}
              </span>
              <span className="text-sm text-muted-foreground">
                {t('common.total')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('offerDetails.allFeesIncluded')}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleContactAgent}
              className="flex-1"
              disabled={
                isContactingAgent ||
                !offerData?.user_id ||
                offerData.agent_id === user?.id
              }
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {isContactingAgent
                ? t('common.loading')
                : t('offerDetails.contactAgent')}
            </Button>
            <Button
              onClick={handleCreateOrder}
              className="flex-1"
              disabled={
                loading ||
                !offerData ||
                offerData.agent_id === user?.id
              }
              // disabled={!onCreateOrder}
            >
              <Package className="h-4 w-4 mr-2" />
              {t('offerDetails.orderNow')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
