import { useState } from 'react';
import { Search, MapPin, Star, Heart, Clock, Package, CheckCircle } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useLanguage } from '../store/LanguageContext';
import { CATEGORIES, getCategoryName } from '../config/categories';

interface ExploreTabProps {
  user?: any;
  onNavigateToRequestDetails?: (request: any) => void;
  onContactAgent?: (agentId: string) => void;
  onViewAllRequests?: () => void;
  onViewAllOffers?: () => void;
  onViewAllAgents?: () => void;
  onNavigateToCategory?: (category: string) => void;
  onNavigateToOfferDetails?: (offer: any) => void;
  onNavigateToWishlist?: () => void;
  onNavigateToSearch?: (query?: string) => void;
  favorites?: Set<number>;
  onToggleFavorite?: (itemId: number) => void;
}

export function ExploreTab({ user, onNavigateToRequestDetails, onContactAgent, onViewAllRequests, onViewAllOffers, onViewAllAgents, onNavigateToCategory, onNavigateToOfferDetails, onNavigateToWishlist, onNavigateToSearch, favorites = new Set(), onToggleFavorite }: ExploreTabProps) {
  const { t } = useLanguage();

  const [visibleRecommendations, setVisibleRecommendations] = useState(8);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Enhanced data with images and better structure
  const trendingItems = [
    {
      id: 1,
      title: 'Office Equipment & Supplies',
      category: 'electronics',
      budget: '$5,000 - $15,000',
      location: 'New York, NY',
      urgency: 'High',
      rating: 4.8,
      reviews: 124,
      bids: 8,
      image: 'https://images.unsplash.com/photo-1542725783-079749686aaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBlcXVpcG1lbnQlMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NTg3MDU2MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'High-quality office equipment for small to medium businesses',
      clientName: 'Tech Solutions Inc.',
      postedDate: '2024-01-15',
      deadline: '2024-02-15'
    },
    {
      id: 2,
      title: 'Industrial Construction Tools',
      category: 'home',
      budget: '$2,000 - $8,000',
      location: 'Los Angeles, CA',
      urgency: 'Medium',
      rating: 4.6,
      reviews: 89,
      bids: 12,
      image: 'https://images.unsplash.com/photo-1756402664856-91a90f90b70b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0b29scyUyMGluZHVzdHJpYWwlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzU4NzA1NjE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Professional-grade construction tools for renovation project',
      clientName: 'Metro Construction',
      postedDate: '2024-01-18',
      deadline: '2024-02-10'
    },
    {
      id: 3,
      title: 'Vintage Fashion Collection',
      category: 'fashion',
      budget: '$800 - $2,500',
      location: 'London, UK',
      urgency: 'Low',
      rating: 4.9,
      reviews: 156,
      bids: 5,
      image: 'https://images.unsplash.com/photo-1575404199108-c7417489517d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBwYXJpcyUyMGx1eHVyeXxlbnwxfHx8fDE3NTg3MDU2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Authentic vintage pieces from 1970s-1990s',
      clientName: 'Vintage Boutique',
      postedDate: '2024-01-20',
      deadline: '2024-03-01'
    },
    {
      id: 4,
      title: 'Korean Beauty Products',
      category: 'beauty',
      budget: '$300 - $800',
      location: 'Seoul, South Korea',
      urgency: 'High',
      rating: 4.7,
      reviews: 98,
      bids: 15,
      image: 'https://images.unsplash.com/photo-1686831451322-8d8e234a51e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBza2luY2FyZSUyMGJlYXV0eSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODcwNTYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Latest K-beauty skincare and makeup products',
      clientName: 'Beauty Enthusiast',
      postedDate: '2024-01-22',
      deadline: '2024-02-05'
    }
  ];

  const shoppingOffers = [
    {
      id: 1,
      title: 'Korean K-Beauty Skincare Set',
      category: 'beauty',
      price: 89.99,
      currency: 'USD',
      agentName: 'Rio Mays',
      agentRating: 4.8,
      agentReviews: 67,
      location: 'Seoul, South Korea',
      shoppingLocation: 'Myeongdong District',
      estimatedDelivery: '5-7 days',
      tags: ['authentic', 'trending', 'k-beauty'],
      status: 'active' as const,
      image: 'https://images.unsplash.com/photo-1686831451322-8d8e234a51e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBza2luY2FyZSUyMGJlYXV0eSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODcwNTYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_rio_mays'
    },
    {
      id: 2,
      title: 'Japanese Tech Gadgets Bundle',
      category: 'electronics',
      price: 299.99,
      currency: 'USD',
      agentName: 'Ethan O\'Neill',
      agentRating: 4.9,
      agentReviews: 123,
      location: 'Tokyo, Japan',
      shoppingLocation: 'Akihabara Electronics District',
      estimatedDelivery: '3-5 days',
      tags: ['exclusive', 'limited-edition', 'tech'],
      status: 'active' as const,
      image: 'https://images.unsplash.com/photo-1584658645175-90788b3347b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGVsZWN0cm9uaWNzJTIwdGVjaCUyMGdhZGdldHN8ZW58MXx8fHwxNzU4NzA1NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_ethan_oneill'
    },
    {
      id: 3,
      title: 'European Fashion Accessories',
      category: 'fashion',
      price: 159.99,
      currency: 'EUR',
      agentName: 'Marie Dubois',
      agentRating: 4.7,
      agentReviews: 89,
      location: 'Paris, France',
      shoppingLocation: 'Galeries Lafayette',
      estimatedDelivery: '7-10 days',
      tags: ['luxury', 'authentic', 'designer'],
      status: 'active' as const,
      image: 'https://images.unsplash.com/photo-1575404199108-c7417489517d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBwYXJpcyUyMGx1eHVyeXxlbnwxfHx8fDE3NTg3MDU2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_marie_dubois'
    },
    {
      id: 4,
      title: 'American Streetwear Collection',
      category: 'fashion',
      price: 199.99,
      currency: 'USD',
      agentName: 'Alex Thompson',
      agentRating: 4.6,
      agentReviews: 45,
      location: 'Los Angeles, CA',
      shoppingLocation: 'Melrose Avenue',
      estimatedDelivery: '2-4 days',
      tags: ['streetwear', 'limited', 'trendy'],
      status: 'active' as const,
      image: 'https://images.unsplash.com/flagged/photo-1564723150667-e0c8d8ea3246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwZmFzaGlvbiUyMGNsb3RoaW5nJTIwdXJiYW58ZW58MXx8fHwxNzU4NzA1NjI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_alex_thompson'
    }
  ];

  const agents = [
    {
      id: 'agent_sarah_johnson',
      name: 'Sarah Johnson',
      rating: 4.9,
      reviews: 156,
      specialty: 'Technology Shopping',
      serviceArea: 'New York, NJ, CT',
      completedOrders: 89,
      responseTime: '< 2 hours',
      verified: true,
      image: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4NjE2NTgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      languages: ['English', 'Spanish'],
      badges: ['Top Rated', 'Fast Response']
    },
    {
      id: 'agent_marie_dubois',
      name: 'Marie Dubois',
      rating: 4.7,
      reviews: 89,
      specialty: 'Fashion & Luxury',
      serviceArea: 'Paris, France & EU',
      completedOrders: 67,
      responseTime: '< 3 hours',
      verified: true,
      image: 'https://images.unsplash.com/photo-1575404199108-c7417489517d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBwYXJpcyUyMGx1eHVyeXxlbnwxfHx8fDE3NTg3MDU2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      languages: ['French', 'English'],
      badges: ['Luxury Expert', 'Verified Agent']
    }
  ];

  // System Recommendations - 40+ diverse items
  const systemRecommendations = [
    {
      id: 101,
      title: 'Swiss Luxury Watches Collection',
      category: 'fashion',
      price: 1299.99,
      currency: 'USD',
      agentName: 'Isabella Rossi',
      location: 'Geneva, Switzerland',
      estimatedDelivery: '10-14 days',
      tags: ['luxury', 'authentic', 'swiss-made'],
      image: 'https://images.unsplash.com/photo-1598099947145-e85739e7ca28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTg2MTIyMDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_isabella_rossi'
    },
    {
      id: 102,
      title: 'Professional Kitchen Appliances Set',
      category: 'home',
      price: 899.99,
      currency: 'USD',
      agentName: 'David Chen',
      location: 'New York, NY',
      estimatedDelivery: '5-7 days',
      tags: ['professional', 'kitchen', 'appliances'],
      image: 'https://images.unsplash.com/photo-1642979427252-13d5fd18bb61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwYXBwbGlhbmNlcyUyMG1vZGVybnxlbnwxfHx8fDE3NTg2MTg1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_david_chen'
    },
    {
      id: 103,
      title: 'Gaming Headphones Premium',
      category: 'electronics',
      price: 199.99,
      currency: 'USD',
      agentName: 'Alex Johnson',
      location: 'Seattle, WA',
      estimatedDelivery: '3-5 days',
      tags: ['gaming', 'audio', 'premium'],
      image: 'https://images.unsplash.com/photo-1715356434396-4a09652383b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBoZWFkcGhvbmVzJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzU4NzEwMzAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_alex_johnson'
    },
    {
      id: 104,
      title: 'Fitness Equipment Bundle',
      category: 'sports',
      price: 599.99,
      currency: 'USD',
      agentName: 'Maria Santos',
      location: 'Los Angeles, CA',
      estimatedDelivery: '7-10 days',
      tags: ['fitness', 'workout', 'home-gym'],
      image: 'https://images.unsplash.com/photo-1677417281771-2a861ce553ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBlcXVpcG1lbnQlMjBmaXRuZXNzfGVufDF8fHx8MTc1ODYxOTU5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_maria_santos'
    },
    {
      id: 105,
      title: 'Professional Art Supplies Kit',
      category: 'books',
      price: 149.99,
      currency: 'USD',
      agentName: 'Sophie Williams',
      location: 'Paris, France',
      estimatedDelivery: '8-12 days',
      tags: ['art', 'creative', 'professional'],
      image: 'https://images.unsplash.com/photo-1683905761552-ccc9d133b092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBzdXBwbGllcyUyMGNyZWF0aXZlfGVufDF8fHx8MTc1ODcwNjk1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_sophie_williams'
    },
    {
      id: 106,
      title: 'Modern Furniture Collection',
      category: 'home',
      price: 1599.99,
      currency: 'USD',
      agentName: 'James Miller',
      location: 'Chicago, IL',
      estimatedDelivery: '14-21 days',
      tags: ['furniture', 'modern', 'designer'],
      image: 'https://images.unsplash.com/photo-1753103461856-352241a33626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXR1cmUlMjBtb2Rlcm4lMjBob21lfGVufDF8fHx8MTc1ODcxMDMxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_james_miller'
    }
  ];

  // Helper functions
  const toggleFavorite = (id: number) => {
    onToggleFavorite?.(id);
  };

  // Combined recommendations including both requests and offers
  const combinedRecommendations = [
    // Add requests with type indicator
    ...trendingItems.slice(1).map(item => ({
      ...item,
      type: 'request' as const,
      displayPrice: item.budget.split(' - ')[0],
      displayName: item.clientName,
      displayDelivery: `${item.bids} offers`
    })),
    // Add offers with type indicator  
    ...systemRecommendations.map(item => ({
      ...item,
      type: 'offer' as const,
      displayPrice: `${item.currency === 'USD' ? '$' : item.currency === 'EUR' ? '€' : '¥'}${item.price}`,
      displayName: item.agentName,
      displayDelivery: item.estimatedDelivery
    })),
    // Add more offers from shopping offers
    ...shoppingOffers.slice(1).map(item => ({
      ...item,
      type: 'offer' as const,
      displayPrice: `${item.currency === 'USD' ? '$' : item.currency === 'EUR' ? '€' : '¥'}${item.price}`,
      displayName: item.agentName,
      displayDelivery: item.estimatedDelivery
    }))
  ];

  const loadMoreRecommendations = () => {
    setLoadingMore(true);
    // Simulate loading time
    setTimeout(() => {
      setVisibleRecommendations(prev => Math.min(prev + 8, combinedRecommendations.length));
      setLoadingMore(false);
    }, 500);
  };

  return (
    <div className="flex-1 bg-background pb-20">
      {/* Header - iOS Style */}
      <div className="bg-card px-4 pt-12 pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-foreground">{t('nav.explore')}</h1>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNavigateToWishlist}
              className="relative rounded-full h-10 w-10"
            >
              <Heart className={`h-6 w-6 ${favorites.size > 0 ? 'text-primary fill-current' : 'text-muted-foreground'}`} />
              {favorites.size > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{favorites.size}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
        
        {/* Search Bar - Button that looks like Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
          <Button
            variant="ghost"
            onClick={() => onNavigateToSearch?.()}
            className="w-full h-12 pl-10 pr-4 bg-input-background border-0 rounded-lg text-muted-foreground hover:bg-input-background/70 transition-colors justify-start font-normal"
          >
            {t('explore.searchPlaceholder')}
          </Button>
        </div>

      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Popular Categories */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2>{t('explore.popularCategories')}</h2>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-3 pb-2">
              {CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button 
                    key={category.id}
                    onClick={() => onNavigateToCategory?.(category.id)}
                    className="flex-shrink-0 p-3 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors text-center w-25"
                  >
                    <div className="w-10 h-10 rounded-lg mb-2 bg-primary/10 flex items-center justify-center mx-auto">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-medium text-xs leading-tight">{getCategoryName(category.id, t)}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Top Shopping Offers */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2>{t('explore.topShoppingOffers')}</h2>
            <Button variant="ghost" size="sm" className="text-primary" onClick={onViewAllOffers}>{t('explore.viewAll')}</Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {shoppingOffers
              .slice(0, 4)
              .map((offer) => (
              <div 
                key={offer.id} 
                className="p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => onNavigateToOfferDetails?.(offer)}
              >
                <div className="relative mb-3">
                  <div className="w-full h-32 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className={`absolute top-2 right-2 h-8 w-8 p-0 bg-card/80 hover:bg-card rounded-full ${
                      favorites.has(offer.id) ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(offer.id);
                    }}
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(offer.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Badge className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1">
                    {offer.currency === 'USD' ? '$' : offer.currency === 'EUR' ? '€' : '¥'}{offer.price}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm line-clamp-2 leading-tight">{offer.title}</h4>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{offer.agentName}</span>
                    <Badge variant="secondary" className="text-xs">
                      {offer.estimatedDelivery}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Requests For You */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2>{t('explore.requestsForYou')}</h2>
            <Button variant="ghost" size="sm" className="text-primary" onClick={onViewAllRequests}>{t('explore.viewAll')}</Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {trendingItems
              .slice(0, 4)
              .map((item) => (
              <div 
                key={item.id} 
                className="p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => onNavigateToRequestDetails?.(item)}
              >
                <div className="relative mb-3">
                  <div className="w-full h-32 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className={`absolute top-2 right-2 h-8 w-8 p-0 bg-card/80 hover:bg-card rounded-full ${
                      favorites.has(item.id) ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Badge className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1">
                    {item.budget.split(' - ')[0]}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm line-clamp-2 leading-tight">{item.title}</h4>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">{item.clientName}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.bids} {t('common.offers')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Rated Agents */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2>{t('explore.topRatedAgents')}</h2>
            <Button variant="ghost" size="sm" className="text-primary" onClick={onViewAllAgents}>{t('explore.viewAll')}</Button>
          </div>
          
          <div className="space-y-3">
            {agents.map((agent) => (
              <div key={agent.id} className="p-4 rounded-xl bg-muted/50">
                <div className="flex space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <ImageWithFallback
                        src={agent.image}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {agent.verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{agent.name}</h3>
                        {agent.badges && agent.badges.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {agent.badges.slice(0, 2).map((badge, index) => (
                              <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-xs">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{agent.rating}</span>
                        <span className="text-muted-foreground">({agent.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>{agent.specialty}</div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{agent.serviceArea}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <Package className="h-3 w-3" />
                          <span>{agent.completedOrders} {t('common.orders')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{agent.responseTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    {agent.languages && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">{t('common.languages')}:</span> {agent.languages.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border">
                  <Button 
                    className="w-full rounded-lg" 
                    size="sm"
                    onClick={() => onContactAgent?.(agent.id)}
                  >
                    {t('agents.contact')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2>{t('recommendations.title')}</h2>
              <p className="text-sm text-muted-foreground">{t('recommendations.forYou')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {combinedRecommendations
              .slice(0, visibleRecommendations)
              .map((item) => (
              <div 
                key={`${item.type}-${item.id}`} 
                className="p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => {
                  if (item.type === 'request') {
                    onNavigateToRequestDetails?.(item);
                  } else {
                    onContactAgent?.(item.agentId);
                  }
                }}
              >
                <div className="relative mb-3">
                  <div className="w-full h-32 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className={`absolute top-2 right-2 h-8 w-8 p-0 bg-card/80 hover:bg-card rounded-full ${
                      favorites.has(item.id) ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Badge className={`absolute top-2 left-2 text-white text-xs px-2 py-1 ${
                    item.type === 'request' ? 'bg-blue-600' : 'bg-primary'
                  }`}>
                    {item.displayPrice}
                  </Badge>
                  {/* Type indicator */}
                  <Badge className={`absolute bottom-2 left-2 text-xs px-2 py-1 ${
                    item.type === 'request' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  }`}>
                    {item.type === 'request' ? t('common.request') : t('common.offer')}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm line-clamp-2 leading-tight">{item.title}</h4>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">{item.displayName}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.displayDelivery}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleRecommendations < combinedRecommendations.length && (
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                onClick={loadMoreRecommendations}
                disabled={loadingMore}
                className="px-8 py-2"
              >
                {loadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    {t('recommendations.loading')}
                  </>
                ) : (
                  t('recommendations.loadMore')
                )}
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}