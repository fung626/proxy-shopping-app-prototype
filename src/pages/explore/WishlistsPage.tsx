import OfferCard from '@/components/OfferCard';
import RequestCardB from '@/components/RequestCardB';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { offersSupabaseService } from '@/services/offersSupabaseService';
import { requestsSupabaseService } from '@/services/requestsSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useAuthStore } from '@/store/zustand/authStore';
import { useWishlistStore } from '@/store/zustand/wishlistStore';
import { Heart, Search } from 'lucide-react';
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
  const [cardMap, setCardMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const { getWishlist, removeWishlistItem } = useWishlistStore();
  const wishlistIds = useMemo(() => getWishlist(), [getWishlist]);
  const { user } = useAuthStore();

  // If user is signed in, sync local wishlist with remote server
  useEffect(() => {
    if (user) {
      const fetchRemote = async () => {
        try {
          await useWishlistStore.getState().fetchRemoteWishlist();
        } catch (err) {
          console.warn('Failed to fetch remote wishlist', err);
        }
      };
      fetchRemote();
    }
  }, [user]);

  // Fetch full data for wishlist items
  useEffect(() => {
    const fetchWishlistData = async () => {
      setLoading(true);
      // If user is authenticated, fetch enriched items in batch
      if (user) {
        try {
          const enriched = await (
            await import('@/services/wishlistSupabaseService')
          ).wishlistSupabaseService.getWishlistByUser(user.id);
          const items: WishlistDisplayItem[] = [];
          const map: Record<string, any> = {};
          for (const r of enriched) {
            if (r.item_type === 'offer' && r.offer) {
              items.push({
                id: r.item_id,
                type: 'offer',
                title: r.offer.title,
                price: r.offer.price,
                currency: r.offer.currency,
                location: r.offer.location,
                images: r.offer.images,
                agentName: r.offer.agent_details?.name,
                rating: r.offer.agent_details?.rating,
                reviews: r.offer.agent_details?.reviews,
              });
              map[r.item_id] = r.offer;
            } else if (r.item_type === 'request' && r.request) {
              items.push({
                id: r.item_id,
                type: 'request',
                title: r.request.title,
                budget_min: r.request.budget_min,
                budget_max: r.request.budget_max,
                currency: r.request.currency,
                location: r.request.expected_delivery_location,
                images: r.request.images,
                clientName: r.request.user_name,
              });
              map[r.item_id] = r.request;
            }
          }

          setWishlistItems(items);
          setCardMap(map);
        } catch (err) {
          console.warn(
            'Failed to fetch enriched wishlist, falling back',
            err
          );
        }
      }

      // Fallback: for unauthenticated users or if enriched fetch failed
      if (!user) {
        const items: WishlistDisplayItem[] = [];
        const map: Record<string, any> = {};
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
              map[offer.id] = offer;
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
              map[request.id] = request;
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
        setCardMap(map);
      }
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
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <OfferCard key={index} loading />
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
          <div className="grid grid-cols-2 gap-3">
            {loading
              ? Array.from({ length: 12 }).map((_, index) => (
                  <OfferCard key={index} loading />
                ))
              : filteredItems.map((item) =>
                  item.type === 'request' ? (
                    cardMap[item.id] ? (
                      <RequestCardB
                        key={item.id}
                        request={cardMap[item.id]}
                      />
                    ) : (
                      <RequestCardB
                        key={item.id}
                        request={
                          { id: item.id, title: item.title } as any
                        }
                      />
                    )
                  ) : cardMap[item.id] ? (
                    <OfferCard
                      key={item.id}
                      offer={cardMap[item.id]}
                    />
                  ) : (
                    <OfferCard
                      key={item.id}
                      offer={
                        { id: item.id, title: item.title } as any
                      }
                    />
                  )
                )}
          </div>
        )}
      </div>
    </div>
  );
}
