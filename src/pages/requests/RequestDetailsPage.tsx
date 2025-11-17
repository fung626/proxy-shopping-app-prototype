import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Carousel from '@/components/ui/carousel/carousel';
import { chatSupabaseService } from '@/services/chatSupabaseService';
import {
  requestsSupabaseService as requestService,
  SupabaseRequest,
} from '@/services/requestsSupabaseService';
import { SupabaseUser } from '@/services/type';
import { userSupabaseService as userService } from '@/services/userSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useAuthStore } from '@/store/zustand/authStore';
import { capitalize, getCurrencySymbol } from '@/utils/common';
import { Separator } from '@radix-ui/react-select';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  Package,
  Share2,
  Shield,
  Star,
  User,
  Zap,
} from 'lucide-react';
import moment from 'moment';
import 'moment/dist/locale/ja';
import 'moment/dist/locale/ko';
import 'moment/dist/locale/zh-cn';
import 'moment/dist/locale/zh-tw';
import { memo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RequestDetailsSkeleton } from './RequestDetailsSkeleton';

export const RequestDetailsPage = memo(function RequestDetailsPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  const [requestData, setRequestData] =
    useState<SupabaseRequest | null>(null);
  const [clientData, setClientData] = useState<SupabaseUser | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isContactingClient, setIsContactingClient] = useState(false);

  const onBack = () => navigate(-1);

  const memberSince = clientData?.created_at
    ? moment(clientData.created_at).fromNow()
    : t('common.unknown');

  const handleContactClient = async () => {
    if (!user || !requestData?.user_id || !id) {
      // If not authenticated, redirect to sign in
      if (!user) {
        navigate('/auth/signin');
        return;
      }
      return;
    }

    setIsContactingClient(true);
    try {
      // Create or get existing conversation
      const conversation =
        await chatSupabaseService.getOrCreateConversation({
          participant_user_id: requestData.user_id,
          request_id: id,
        });

      if (conversation) {
        // Navigate to the chat page
        navigate(`/messages/chat/${conversation.id}`);
      } else {
        console.error('Failed to create conversation');
      }
    } catch (error) {
      console.error('Error contacting client:', error);
    } finally {
      setIsContactingClient(false);
    }
  };

  const handleMakeOffer = () => {
    console.log('Make offer for request:', requestData?.id);
  };

  const handleShare = () => {
    console.log('Share request:', requestData?.id);
  };

  const currencySymbol = getCurrencySymbol(requestData?.currency);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    };
    scrollToTop();
  }, []);

  useEffect(() => {
    moment.locale(language);
  }, [language]);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const request = await requestService.getRequestById(id);
        if (request) {
          setRequestData(request);
          const client = await userService.getUserById(
            request.user_id
          );
          setClientData(client);
        }
      } catch (error) {
        console.error('Error fetching offer data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return <RequestDetailsSkeleton />;
  }

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
          <Carousel slides={requestData?.images || []} />
        </div>
      </div>
      {/* Content */}
      <div className="px-4 pb-40">
        {/* Title Section */}
        <div className="py-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-foreground pr-4 mb-2">
                {requestData?.title || t('requestDetails.request')}
              </h1>
              {/* Status and Urgency Badges */}
              <div className="flex items-center space-x-2 mb-3">
                {/* Status Badge */}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    requestData?.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : requestData?.status === 'fulfilled'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {requestData?.status
                    ? t(`requestDetails.${requestData.status}`)
                    : t('requestDetails.active')}
                </div>

                {/* Urgency Badge */}
                {requestData?.urgency && (
                  <div
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                      requestData.urgency === 'urgent'
                        ? 'bg-red-100 text-red-700'
                        : requestData.urgency === 'normal'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {requestData.urgency === 'urgent' && (
                      <Zap className="h-3 w-3" />
                    )}
                    <span>
                      {t(
                        `common.urgency${capitalize(
                          requestData.urgency
                        )}`
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            {requestData?.category
              ? t(`categories.${requestData.category}`)
              : t('common.general')}
            {requestData?.product_origin && (
              <> • {t(`countries.${requestData.product_origin}`)}</>
            )}
          </p>
          {/* Request Stats */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {t('requestDetails.postedDate')}{' '}
                {moment(requestData?.created_at).fromNow()}
              </span>
            </div>
            {requestData?.offers && requestData.offers.length > 0 && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>
                  {requestData.offers.length}{' '}
                  {requestData.offers.length === 1
                    ? t('common.offer')
                    : t('common.offers')}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>0 {t('requestDetails.views')}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Client Info */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            {t('requestDetails.requestedBy')} {clientData?.nickname}
          </h3>
          <div className="flex items-center space-x-4">
            <Avatar className="flex items-center justify-center w-16 h-16 bg-slate-50">
              {clientData?.image ? (
                <ImageWithFallback
                  src={clientData?.image}
                  alt={clientData?.nickname || 'Client Avatar'}
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
                    {clientData?.rating ||
                      t('offerDetails.noRatings')}
                  </span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {`${clientData?.reviews ?? 0} ${t(
                    'common.reviews'
                  )}` || t('common.noReviews')}
                </span>
                {clientData?.verified && (
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
                  clientData?.success_rate ?? 0
                }% ${t('offerDetails.successRate')}`}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Request Details */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            {t('requestDetails.requestFeatures')}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {/* Budget */}
            {(requestData?.budget_min || requestData?.budget_max) && (
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">
                    {t('requestDetails.budgetRange')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {currencySymbol}
                    {requestData?.budget_min?.toFixed(2) ||
                      '0.00'} - {currencySymbol}
                    {requestData?.budget_max?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            )}

            {/* Purchase Location */}
            {requestData?.designated_purchasing_location && (
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">
                    {t('requestDetails.purchaseLocation')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {requestData.designated_purchasing_location}
                  </p>
                </div>
              </div>
            )}

            {/* Delivery Location */}
            {requestData?.expected_delivery_location && (
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">
                    {t('requestDetails.deliveryLocation')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {requestData.expected_delivery_location}
                  </p>
                </div>
              </div>
            )}

            {/* Delivery Method */}
            {requestData?.delivery_method && (
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">
                    {t('requestDetails.deliveryMethod')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {requestData.delivery_method === 'ship'
                      ? t('requestDetails.shipToAddress')
                      : t('requestDetails.deliverInPerson')}
                  </p>
                </div>
              </div>
            )}

            {/* Expected Delivery */}
            {requestData?.expected_delivery && (
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">
                    {t('requestDetails.expectedDelivery')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {requestData.expected_delivery.start} -{' '}
                    {requestData.expected_delivery.end}{' '}
                    {requestData.expected_delivery.unit}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* About This Request */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            {t('requestDetails.aboutThisRequest')}
          </h3>
          <div className="space-y-4">
            {/* Main Description */}
            <div className="space-y-3">
              <p className="text-foreground leading-relaxed">
                {requestData?.description ||
                  t('requestDetails.noRequirements')}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Specific Requirements */}
        {requestData?.specific_requirements &&
          requestData.specific_requirements.length > 0 && (
            <>
              <div className="py-6">
                <h3 className="font-semibold mb-4">
                  {t('requestDetails.specificRequirements')}
                </h3>
                <div className="space-y-3">
                  {requestData.specific_requirements.map(
                    (requirement, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30"
                      >
                        <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">
                          {requirement}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

        {/* Trust & Protection */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            {t('requestDetails.buyerProtection')}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
              <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100 text-sm">
                  {t('requestDetails.buyerProtection')}
                </h4>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  {t('requestDetails.buyerProtectionDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                  {t('requestDetails.securePayment')}
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  {t('requestDetails.securePaymentDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
              <Star className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100 text-sm">
                  {t('requestDetails.verifiedAgents')}
                </h4>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  {t('requestDetails.verifiedAgentsDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Client Stats */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            {clientData?.nickname}
            {t('requestDetails.clientStats')}
          </h3>

          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {clientData?.total_orders ?? 0}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('requestDetails.totalRequests')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {clientData?.success_rate ?? 0}%
              </div>
              <div className="text-xs text-muted-foreground">
                {t('common.successRate')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {clientData?.rating ?? 0}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('common.rating')}
              </div>
            </div>
          </div>
        </div>

        {/* Offers Section */}
        {requestData?.offers && requestData.offers.length > 0 && (
          <div className="py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {t('requestDetails.offerCount')} (
                {requestData.offers.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(`/requests/${requestData.id}/offers`)
                }
              >
                {t('requestDetails.viewOffers')}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {requestData.offers.length}{' '}
              {requestData.offers.length === 1
                ? t('common.agent')
                : t('common.agents')}{' '}
              {requestData.offers.length === 1 ? 'has' : 'have'}{' '}
              offered to help with this request
            </p>
          </div>
        )}
      </div>
      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 safe-area-inset-bottom">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleContactClient}
            disabled={isContactingClient || !requestData?.user_id}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {isContactingClient
              ? t('common.loading')
              : t('requestDetails.contactClient')}
          </Button>
          <Button className="flex-1" onClick={handleMakeOffer}>
            {t('requestDetails.makeOffer')}
          </Button>
        </div>
      </div>
    </div>
  );
});
