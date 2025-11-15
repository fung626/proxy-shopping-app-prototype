import OfferCard from '@/components/OfferCard';
import { PullToRefresh } from '@/components/PullToRefresh';
import RequestCardB from '@/components/RequestCardB';
import { Input } from '@/components/ui/input';
import {
  offersSupabaseService,
  SupabaseOffer,
} from '@/services/offersSupabaseService';
import {
  requestsSupabaseService,
  SupabaseRequest,
} from '@/services/requestsSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { Package, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface CategoryPageProps {
  category: string;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<{
    title: string;
    description: string;
    requests: SupabaseRequest[];
    offers: SupabaseOffer[];
  }>({
    title: '',
    description: '',
    requests: [],
    offers: [],
  });

  const fetch = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        const requests = await requestsSupabaseService.getRequests({
          category,
        });
        const offers = await offersSupabaseService.getOffers({
          category,
        });
        setData({
          title: t(`categories.${category}`),
          description: t(`categories.${category}_description`),
          requests,
          offers,
        });
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [category, t]
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  const allItems = [
    ...data.requests.map((item) => ({
      ...item,
      type: 'request',
    })),
    ...data.offers.map((item) => ({
      ...item,
      type: 'offer',
    })),
  ].sort((a, b) => {
    // Sort by date, newest first
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return dateB.getTime() - dateA.getTime();
  });

  // Filter items based on search only
  const filteredItems = useMemo(() => {
    let items = allItems;
    if (searchQuery) {
      items = items.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (item.description || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }
    return items;
  }, [allItems, searchQuery]);

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(e.target.value);
  };

  const handleRefresh = useCallback(async () => {
    await fetch(true);
  }, [fetch]);

  // console.log('[DEBUG] CategoryPage Rendered', filteredItems);

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      refreshing={refreshing}
      className="flex-1 bg-background"
    >
      <div className="px-4 pt-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t('common.searchInCategory', {
              category: data.title,
            })}
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 bg-input-background border-0 rounded-lg text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="px-4 py-6">
        <div className="mb-4">
          <span className="text-muted-foreground text-sm">
            {t('common.itemsFound', { count: filteredItems.length })}
          </span>
        </div>
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('common.noItemsFound')}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? t('common.adjustSearchTerms')
                : t('common.noItemsInCategory')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {loading
              ? Array.from({ length: 12 }).map((_, index) => (
                  <OfferCard key={index} loading />
                ))
              : filteredItems.map((item) =>
                  item.type === 'request' ? (
                    <RequestCardB
                      key={item.id}
                      request={item as SupabaseRequest}
                    />
                  ) : (
                    <OfferCard
                      key={item.id}
                      offer={item as SupabaseOffer}
                    />
                  )
                )}
          </div>
        )}
      </div>
    </PullToRefresh>
  );
}
