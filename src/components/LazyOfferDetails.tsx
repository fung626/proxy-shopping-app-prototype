import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Package, MapPin, Clock, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LazyOfferDetailsProps {
  offer: any;
  onBack: () => void;
  onContactAgent: (agentId: string) => void;
  onCreateOrder?: (offer: any) => void;
}

export const LazyOfferDetails = React.memo(function LazyOfferDetails({ 
  offer, 
  onBack, 
  onContactAgent, 
  onCreateOrder 
}: LazyOfferDetailsProps) {
  const [imageLoading, setImageLoading] = useState(true);

  // Simplified offer data with defaults
  const offerData = {
    title: 'Korean K-Beauty Skincare Set',
    price: 89.99,
    currency: 'USD',
    agentName: 'Rio Mays',
    agentId: 'agent_rio_mays',
    agentRating: 4.8,
    agentReviews: 67,
    location: 'Seoul, South Korea',
    estimatedDelivery: '5-7 days',
    description: 'Authentic Korean skincare products from top K-beauty brands.',
    image: 'https://images.unsplash.com/photo-1686831451322-8d8e234a51e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBza2luY2FyZSUyMGJlYXV0eSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODcwNTYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ...offer
  };

  const currencySymbol = offerData.currency === 'USD' ? '$' : 
                        offerData.currency === 'EUR' ? '€' : 
                        offerData.currency === 'GBP' ? '£' : '¥';

  const handleContactAgent = () => {
    onContactAgent(offerData.agentId);
  };

  const handleCreateOrder = () => {
    if (onCreateOrder) {
      onCreateOrder(offerData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold truncate flex-1 mx-4">Offer Details</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="pb-32">
        {/* Main Image */}
        <div className="relative aspect-square w-full bg-muted">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <ImageWithFallback
            src={offerData.image}
            alt={offerData.title}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoading(false)}
          />
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-6">
          {/* Title and Price */}
          <div>
            <h2 className="text-xl font-semibold mb-2">{offerData.title}</h2>
            <div className="flex items-baseline space-x-1 mb-2">
              <span className="text-2xl font-bold text-primary">
                {currencySymbol}{offerData.price}
              </span>
              <span className="text-sm text-muted-foreground">total</span>
            </div>
          </div>

          {/* Agent Info */}
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {offerData.agentName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{offerData.agentName}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-current text-yellow-500" />
                <span>{offerData.agentRating}</span>
                <span>•</span>
                <span>{offerData.agentReviews} reviews</span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{offerData.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{offerData.estimatedDelivery}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {offerData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-inset-bottom">
        <div className="p-4">
          <div className="mb-3">
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-semibold">
                {currencySymbol}{offerData.price}
              </span>
              <span className="text-sm text-muted-foreground">total</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {offerData.estimatedDelivery} delivery
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleContactAgent}
              className="flex-1"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button
              onClick={handleCreateOrder}
              className="flex-1"
              disabled={!onCreateOrder}
            >
              <Package className="h-4 w-4 mr-2" />
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});