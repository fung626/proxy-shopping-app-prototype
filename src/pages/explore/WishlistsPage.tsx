import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { offersSupabaseService } from '@/services/offersSupabaseService';
import { requestsSupabaseService } from '@/services/requestsSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useWishlistStore } from '@/store/zustand/wishlistStore';
import {
  Heart,
  MapPin,
  Package,
  Search,
  Share2,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Combined interface for display
interface WishlistDisplayItem {
  id: string;
  type: 'offer' | 'request';
  title: string;
  price?: number;
  currency?: string;
  budget_min?: number;
  budget_max?: number;
  location?: string;
  images?: string[];
  agentName?: string;
  clientName?: string;
  rating?: number;
  reviews?: number;
}

export function WishlistsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'offer' | 'request'
  >('all');
  const [wishlistItems, setWishlistItems] = useState<
    WishlistDisplayItem[]
  >([]);
  const [loading, setLoading] = useState(true);

  const { getWishlist, removeWishlistItem } = useWishlistStore();
  const wishlistIds = useMemo(() => getWishlist(), [getWishlist]);

  // Fetch full data for wishlist items
  useEffect(() => {
    const fetchWishlistData = async () => {
      setLoading(true);
      const items: WishlistDisplayItem[] = [];
      for (const item of wishlistIds) {
        try {
          // Try to fetch as offer first
          const offer = await offersSupabaseService.getOfferById(
            item.id
          );
          if (offer) {
            items.push({
              id: offer.id,
              type: 'offer',
              title: offer.title,
              price: offer.price,
              currency: offer.currency,
              location: offer.location,
              images: offer.images,
              agentName: offer.agent_details?.name,
              rating: offer.agent_details?.rating,
              reviews: offer.agent_details?.reviews,
            });
            continue;
          }
          // Try to fetch as request
          const request =
            await requestsSupabaseService.getRequestById(item.id);
          if (request) {
            items.push({
              id: request.id,
              type: 'request',
              title: request.title,
              budget_min: request.budget_min,
              budget_max: request.budget_max,
              currency: request.currency,
              location: request.expected_delivery_location,
              images: request.images,
              clientName: request.user_name,
            });
          }
        } catch (error) {
          console.error(
            'Error fetching wishlist item:',
            item.id,
            error
          );
        }
      }
      setWishlistItems(items);
      setLoading(false);
    };

    fetchWishlistData();
  }, [wishlistIds]);

  // Filter and search functionality
  const filteredItems = useMemo(() => {
    let filtered = wishlistItems;
    // Filter by type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(
        (item) => item.type === selectedFilter
      );
    }
    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (item.type === 'offer' ? item.agentName : item.clientName)
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [wishlistItems, selectedFilter, searchQuery]);

  const handleItemClick = (item: WishlistDisplayItem) => {
    if (item.type === 'offer') {
      navigate(`/offers/${item.id}`);
    } else {
      navigate(`/requests/${item.id}`);
    }
  };

  const handleRemoveItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeWishlistItem(itemId);
  };

  const handleShare = (
    item: WishlistDisplayItem,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    console.log('Share item:', item);
  };

  const onBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="safe-area-inset-top">
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
              variant={
                selectedFilter === 'all' ? 'default' : 'outline'
              }
              size="sm"
              onClick={() => setSelectedFilter('all')}
              className="flex-1"
            >
              {t('common.all')} ({wishlistItems.length})
            </Button>
            <Button
              variant={
                selectedFilter === 'offer' ? 'default' : 'outline'
              }
              size="sm"
              onClick={() => setSelectedFilter('offer')}
              className="flex-1"
            >
              {t('common.offers')} (
              {
                wishlistItems.filter((item) => item.type === 'offer')
                  .length
              }
              )
            </Button>
            <Button
              variant={
                selectedFilter === 'request' ? 'default' : 'outline'
              }
              size="sm"
              onClick={() => setSelectedFilter('request')}
              className="flex-1"
            >
              {t('common.requests')} (
              {
                wishlistItems.filter(
                  (item) => item.type === 'request'
                ).length
              }
              )
            </Button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 pb-20">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-xl border border-border p-4 animate-pulse"
              >
                <div className="flex space-x-4">
                  <div className="w-20 h-20 rounded-lg bg-muted"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {wishlistItems.length === 0
                ? t('wishlist.emptyWishlist')
                : t('wishlist.noItemsFound')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {wishlistItems.length === 0
                ? t('wishlist.startAdding')
                : t('wishlist.tryAdjusting')}
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
                      src={item.images?.[0] || ''}
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
                            variant={
                              item.type === 'offer'
                                ? 'default'
                                : 'secondary'
                            }
                            className="text-xs"
                          >
                            {item.type === 'offer'
                              ? t('common.offer')
                              : t('common.request')}
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
                          onClick={(e) =>
                            handleRemoveItem(item.id, e)
                          }
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
                                {item.currency === 'USD'
                                  ? '$'
                                  : item.currency === 'EUR'
                                  ? '€'
                                  : '¥'}
                                {item.price}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {t('common.by')} {item.agentName}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{item.location}</span>
                            </div>
                            {item.rating && (
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-500">
                                  ★
                                </span>
                                <span>
                                  {item.rating} ({item.reviews})
                                </span>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <span className="font-semibold text-sm">
                                {item.budget_min} - {item.budget_max}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {t('common.by')} {item.clientName}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs">
                              <Package className="h-3 w-3 text-blue-500" />
                              <span>{t('common.request')}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{item.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-muted-foreground">
                                {item.currency}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {t('wishlist.addedToWishlist')}
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
