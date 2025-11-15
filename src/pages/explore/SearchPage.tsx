import OfferCard from '@/components/OfferCard';
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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

export function SearchPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<{
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

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const requests = await requestsSupabaseService.getRequests({});
      const offers = await offersSupabaseService.getOffers({});
      setResults({
        title: t('explore.searchPlaceholder'),
        description: '',
        requests,
        offers,
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const allItems = useMemo(() => {
    return [
      ...results.requests.map((item) => ({
        ...item,
        type: 'request',
        // budget: item.budget || { min: 0, max: 0 },
      })),
      ...results.offers.map((item) => ({
        ...item,
        type: 'offer',
        price: item.price || 0,
      })),
    ];
  }, [results]);

  const filteredItems = useMemo(() => {
    let items = allItems;
    if (searchQuery.trim()) {
      items = items.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }
    return items;
  }, [allItems, searchQuery]);

  return (
    <div className="flex-1 bg-background pb-[74px]">
      <div className="px-4 pt-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('explore.searchPlaceholder')}
            className="pl-10 pr-4 bg-input-background border-0 rounded-lg text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <OfferCard key={index} loading />
            ))}
          </div>
        ) : (
          <>
            {filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {t('common.noItemsFound')}
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredItems.map((item) =>
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
          </>
        )}
      </div>
    </div>
  );
}
