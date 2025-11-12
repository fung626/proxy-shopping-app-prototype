import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/store/LanguageContext';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Heart,
  MapPin,
  MessageCircle,
  Package,
  Plus,
  Share2,
  Star,
  Truck,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

export function RequestDetailsPage() {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] =
    useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Mock images if none provided - matching the request category
  const sampleImages = useMemo(
    () => [
      'https://images.unsplash.com/photo-1726695716109-68a7321c0664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob3BwaW5nJTIwcHJvZHVjdHxlbnwxfHx8fDE3NTg2MzU5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1758467700917-3517eb11ec8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHMlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NTg2MzU5MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1598099947145-e85739e7ca28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTg2MTIyMDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMGJhZyUyMGZhc2hpb258ZW58MXx8fHwxNzU4NjM1OTI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    []
  );

  const displayImages = useMemo(
    () =>
      request.images && request.images.length > 0
        ? request.images
        : sampleImages,
    [request.images, sampleImages]
  );

  // Mock client data
  const clientData = {
    name: request.clientName || 'Sarah Chen',
    rating: request.clientRating || 4.8,
    reviews: request.clientReviews || 156,
    since: request.clientSince || '2023',
    verified: true,
    image:
      'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4NjE2NTgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  };

  // Mock  description with more details
  const Description =
    request.description ||
    `I'm looking for premium skincare products from Seoul, specifically K-beauty items that are popular in Korea but hard to find internationally. I need authentic products with Korean packaging and preferably from popular brands like Sulwhasoo, The History of Whoo, or similar luxury lines.

The products should be sourced directly from official retailers or department stores in Seoul to ensure authenticity. I'm particularly interested in limited edition or seasonal collections that aren't available through international shipping.

I've been following Korean beauty trends and would love to get my hands on some exclusive items. The agent should have good knowledge of popular Korean beauty stores and be able to verify product authenticity before purchase.

Please include original receipts and any promotional materials or samples that come with the purchase. I'm willing to pay premium prices for genuine, high-quality products.`;

  // Mock specific requirements from create request form
  const specificRequirements = request.specificRequirements || [
    'Must be authentic products with original packaging',
    'Purchase from official retailers or department stores only',
    'Include original receipt for authenticity verification',
    'Products should have at least 12 months shelf life remaining',
    'Include any promotional samples or gifts with purchase',
    'Provide photos of products before shipping',
    'Use protective packaging for fragile items',
  ];

  // Mock similar offers/agents
  const similarOffers = [
    {
      id: 1,
      agentName: 'Rio Mays',
      price: '$89.99',
      rating: 4.8,
      reviews: 67,
      timeframe: '5-7 days',
      image:
        'https://images.unsplash.com/photo-1575404199108-c7417489517d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBwYXJpcyUyMGx1eHVyeXxlbnwxfHx8fDE3NTg3MDU2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 2,
      agentName: 'Marie Dubois',
      price: '$124.50',
      rating: 4.9,
      reviews: 123,
      timeframe: '3-5 days',
      image:
        'https://images.unsplash.com/photo-1586985564150-5e2f8c5b3c06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4NjE2NjAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ];

  const requestFeatures = [
    {
      icon: MapPin,
      title: 'Shopping Location',
      description: request.location,
    },
    {
      icon: Calendar,
      title: 'Posted Date',
      description: request.createdDate || 'Recently',
    },
    {
      icon: Package,
      title: 'Category',
      description: request.category,
    },
    {
      icon: Truck,
      title: 'Delivery Method',
      description:
        request.deliveryMethod === 'personal'
          ? 'Personal delivery preferred'
          : 'Ship to client',
    },
  ];

  const truncatedDescription = (request.description || '').slice(
    0,
    200
  );
  const needsTruncation = (request.description || '').length > 200;

  // Touch handlers for image carousel - memoized to prevent re-renders
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < displayImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  }, [touchStart, touchEnd, currentImageIndex, displayImages.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* Image Carousel */}
      <div className="relative">
        {/* Header overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 safe-area-inset-top">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-900" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onShareRequest}
              className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full"
            >
              <Share2 className="h-5 w-5 text-gray-900" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorited(!isFavorited)}
              className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full"
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

        {/* Image display */}
        <div
          className="aspect-[4/3] relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ImageWithFallback
            src={displayImages[currentImageIndex]}
            alt={`${request.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300"
          />

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {displayImages.length}
          </div>

          {/* Navigation dots */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'bg-white'
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Left/Right navigation arrows for larger screens */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={() =>
                  currentImageIndex > 0 &&
                  setCurrentImageIndex(currentImageIndex - 1)
                }
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center transition-opacity ${
                  currentImageIndex === 0
                    ? 'opacity-30'
                    : 'opacity-70 hover:opacity-90'
                }`}
                disabled={currentImageIndex === 0}
              >
                ‹
              </button>
              <button
                onClick={() =>
                  currentImageIndex < displayImages.length - 1 &&
                  setCurrentImageIndex(currentImageIndex + 1)
                }
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center transition-opacity ${
                  currentImageIndex === displayImages.length - 1
                    ? 'opacity-30'
                    : 'opacity-70 hover:opacity-90'
                }`}
                disabled={
                  currentImageIndex === displayImages.length - 1
                }
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-40">
        {/* Title Section */}
        <div className="py-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-semibold text-foreground pr-4">
              {request.title}
            </h1>
            {request.urgency === 'High' && (
              <Badge className="bg-primary text-white">Hot</Badge>
            )}
          </div>

          <p className="text-muted-foreground mb-4">
            {request.category} in {request.location}
          </p>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Posted {request.createdDate || 'Recently'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{request.bids || 0} offers</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Client Info */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            Requested by {clientData.name}
          </h3>

          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <ImageWithFallback
                src={clientData.image}
                alt={clientData.name}
                className="w-full h-full object-cover"
              />
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {clientData.rating}
                  </span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {clientData.reviews} reviews
                </span>
                {clientData.verified && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 text-sm">
                        Verified
                      </span>
                    </div>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Member since {clientData.since}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Request Features */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">Request details</h3>

          <div className="space-y-4">
            {requestFeatures.map((feature, index) => (
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

        {/* Description */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">About this request</h3>
          <div className="space-y-4">
            <p className="text-foreground leading-relaxed">
              {showFullDescription
                ? Description
                : Description.slice(0, 300)}
              {Description.length > 300 &&
                !showFullDescription &&
                '...'}
            </p>

            {Description.length > 300 && (
              <Button
                variant="ghost"
                onClick={() =>
                  setShowFullDescription(!showFullDescription)
                }
                className="p-0 h-auto font-medium text-foreground hover:bg-transparent"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
                <ChevronDown
                  className={`h-4 w-4 ml-1 transition-transform ${
                    showFullDescription ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Specific Requirements */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">
            Specific requirements
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {specificRequirements.map((requirement, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30"
              >
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">
                  {requirement}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Similar Offers */}
        <div className="py-6">
          <h3 className="font-semibold mb-4">Other agent offers</h3>

          <div className="space-y-4">
            {similarOffers.map((offer) => (
              <div
                key={offer.id}
                className="p-4 rounded-lg bg-muted/30"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <ImageWithFallback
                      src={offer.image}
                      alt={offer.agentName}
                      className="w-full h-full object-cover"
                    />
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">
                        {offer.agentName}
                      </h4>
                      <span className="font-semibold text-primary">
                        {offer.price}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{offer.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{offer.reviews} reviews</span>
                      <span>•</span>
                      <span>{offer.timeframe}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-inset-bottom">
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-semibold text-foreground">
                {(() => {
                  // Handle budget object with min, max, currency
                  if (
                    typeof request.budget === 'object' &&
                    request.budget &&
                    'min' in request.budget
                  ) {
                    return `${request.budget.min} - ${request.budget.max}`;
                  }
                  // Handle budget string
                  return request.budget || '$100 - $500';
                })()}
              </span>
              <span className="text-sm text-muted-foreground">
                budget range
              </span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => onContactAgent('client_default')}
              className="flex-1"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button
              onClick={() => onNavigateToMakeOffer(request)}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Make Offer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
