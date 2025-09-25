import { useState, useMemo } from 'react';
import { ArrowLeft, Heart, Search, Filter, Star, MapPin, Package, Calendar, Trash2, Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useLanguage } from '../store/LanguageContext';

interface WishlistsPageProps {
  onBack: () => void;
  onNavigateToOfferDetails?: (offer: any) => void;
  onNavigateToRequestDetails?: (request: any) => void;
  onContactAgent?: (agentId: string) => void;
  favoriteItems?: Set<number>;
  onRemoveFromWishlist?: (itemId: number) => void;
}

export function WishlistsPage({ 
  onBack, 
  onNavigateToOfferDetails, 
  onNavigateToRequestDetails, 
  onContactAgent,
  favoriteItems = new Set(),
  onRemoveFromWishlist 
}: WishlistsPageProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'offers' | 'requests'>('all');

  // Mock wishlist data - in a real app, this would come from your state/API
  const mockWishlistItems = [
    {
      id: 1,
      type: 'offer',
      title: 'Korean K-Beauty Skincare Set',
      price: 89.99,
      currency: 'USD',
      agentName: 'Rio Mays',
      location: 'Seoul, South Korea',
      estimatedDelivery: '5-7 days',
      rating: 4.8,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1686831451322-8d8e234a51e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBza2luY2FyZSUyMGJlYXV0eSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODcwNTYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      dateAdded: '2024-01-20',
      agentId: 'agent_rio_mays',
      category: 'Beauty & Health'
    },
    {
      id: 2,
      type: 'offer',
      title: 'Japanese Tech Gadgets Bundle',
      price: 299.99,
      currency: 'USD',
      agentName: 'Ethan O\'Neill',
      location: 'Tokyo, Japan',
      estimatedDelivery: '3-5 days',
      rating: 4.9,
      reviews: 123,
      image: 'https://images.unsplash.com/photo-1584658645175-90788b3347b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGVsZWN0cm9uaWNzJTIwdGVjaCUyMGdhZGdldHN8ZW58MXx8fHwxNzU4NzA1NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      dateAdded: '2024-01-18',
      agentId: 'agent_ethan_oneill',
      category: 'Electronics'
    },
    {
      id: 3,
      type: 'request',
      title: 'Vintage Fashion Collection',
      budget: '$800 - $2,500',
      clientName: 'Vintage Boutique',
      location: 'London, UK',
      bids: 5,
      rating: 4.9,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1575404199108-c7417489517d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBwYXJpcyUyMGx1eHVyeXxlbnwxfHx8fDE3NTg3MDU2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      dateAdded: '2024-01-15',
      deadline: '2024-03-01',
      category: 'Fashion'
    },
    {
      id: 4,
      type: 'offer',
      title: 'European Fashion Accessories',
      price: 159.99,
      currency: 'EUR',
      agentName: 'Marie Dubois',
      location: 'Paris, France',
      estimatedDelivery: '7-10 days',
      rating: 4.7,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1575404199108-c7417489517d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBwYXJpcyUyMGx1eHVyeXxlbnwxfHx8fDE3NTg3MDU2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      dateAdded: '2024-01-12',
      agentId: 'agent_marie_dubois',
      category: 'Fashion'
    }
  ];

  // Filter items based on favorites
  const wishlistItems = useMemo(() => {
    return mockWishlistItems.filter(item => favoriteItems.has(item.id));
  }, [favoriteItems]);

  // Filter and search functionality
  const filteredItems = useMemo(() => {
    let filtered = wishlistItems;

    // Filter by type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(item => item.type === selectedFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.type === 'offer' ? item.agentName : item.clientName).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [wishlistItems, selectedFilter, searchQuery]);

  const handleItemClick = (item: any) => {
    if (item.type === 'offer') {
      onNavigateToOfferDetails?.(item);
    } else {
      onNavigateToRequestDetails?.(item);
    }
  };

  const handleRemoveItem = (itemId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveFromWishlist?.(itemId);
  };

  const handleShare = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement share functionality
    console.log('Share item:', item);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border safe-area-inset-top">
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
              <h1 className="text-xl font-semibold">{t('wishlist.myWishlist')}</h1>
              <p className="text-sm text-muted-foreground">
                {filteredItems.length} {filteredItems.length === 1 ? t('wishlist.item') : t('wishlist.items')}
              </p>
            </div>
          </div>
          <Heart className="h-6 w-6 text-primary fill-current" />
        </div>

        {/* Search and Filter */}
        <div className="px-4 pb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('wishlist.searchWishlist')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background border-0"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('all')}
              className="flex-1"
            >
              {t('common.all')} ({wishlistItems.length})
            </Button>
            <Button
              variant={selectedFilter === 'offers' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('offers')}
              className="flex-1"
            >
              {t('common.offers')} ({wishlistItems.filter(item => item.type === 'offer').length})
            </Button>
            <Button
              variant={selectedFilter === 'requests' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('requests')}
              className="flex-1"
            >
              {t('common.requests')} ({wishlistItems.filter(item => item.type === 'request').length})
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {wishlistItems.length === 0 ? t('wishlist.emptyWishlist') : t('wishlist.noItemsFound')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {wishlistItems.length === 0 
                ? t('wishlist.startAdding')
                : t('wishlist.tryAdjusting')
              }
            </p>
            {wishlistItems.length === 0 && (
              <Button onClick={onBack} variant="outline">
                {t('wishlist.exploreItems')}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-xl border border-border p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => handleItemClick(item)}
              >
                <div className="flex space-x-4">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge 
                            variant={item.type === 'offer' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {item.type === 'offer' ? t('common.offer') : t('common.request')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <h3 className="font-medium line-clamp-2 text-sm leading-tight mb-1">
                          {item.title}
                        </h3>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => handleShare(item, e)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => handleRemoveItem(item.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      {item.type === 'offer' ? (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <span className="font-semibold text-sm">
                                {item.currency === 'USD' ? '$' : item.currency === 'EUR' ? '€' : '¥'}{item.price}
                              </span>
                              <span className="text-xs text-muted-foreground">{t('common.by')} {item.agentName}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span>{item.rating}</span>
                              <span className="text-muted-foreground">({item.reviews})</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{item.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Package className="h-3 w-3" />
                              <span>{item.estimatedDelivery}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <span className="font-semibold text-sm">{item.budget}</span>
                              <span className="text-xs text-muted-foreground">{t('common.by')} {item.clientName}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs">
                              <Package className="h-3 w-3 text-blue-500" />
                              <span>{item.bids} {t('common.offers')}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{item.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{t('request.deadline')}: {new Date(item.deadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        {t('wishlist.added')} {new Date(item.dateAdded).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}