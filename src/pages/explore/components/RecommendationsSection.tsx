import OfferCard from '@/components/OfferCard';
import RequestCardA from '@/components/RequestCardA';
import { Button } from '@/components/ui/button';
import { offersSupabaseService } from '@/services/offersSupabaseService';
import { requestsSupabaseService } from '@/services/requestsSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { getDefaultImage } from '@/utils/common';
import { useEffect, useState } from 'react';

const RecommendationsSection: React.FC = () => {
  const { t } = useLanguage();

  const [visibleItems, setVisibleItems] = useState(8);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offers, requests] = await Promise.all([
          offersSupabaseService.getOffers({ limit: 8, offset }),
          requestsSupabaseService.getRequests({ limit: 8, offset }),
        ]);
        const combined = [
          ...offers.map((item) => ({
            ...item,
            type: 'offer' as const,
            displayPrice: `${item.price} ${item.currency}`,
            displayName: item.location || 'Offer',
            displayDelivery: `${
              item.estimated_delivery?.start || 'TBD'
            } - ${item.estimated_delivery?.end || 'TBD'} ${
              item.estimated_delivery?.type || ''
            }`,
            image:
              item.images?.[0] ||
              getDefaultImage(item.category || 'default'),
          })),
          ...requests.map((item) => ({
            ...item,
            type: 'request' as const,
            displayPrice: `${item.budget_min || 0} - ${
              item.budget_max || 0
            }`,
            displayName:
              item.expected_delivery_location ||
              item.designated_purchasing_location ||
              'Request',
            displayDelivery: item.delivery_method || 'TBD',
            image: getDefaultImage(item.category || 'default'),
          })),
        ];
        setItems((prev) => [...prev, ...combined]);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchData();
  }, [offset]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setOffset((prev) => prev + 8);
      setLoading(false);
    }, 500);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>{t('recommendations.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('recommendations.forYou')}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items
          .slice(0, visibleItems)
          .map((item) =>
            item.type === 'offer' ? (
              <OfferCard key={item.id} offer={item} />
            ) : (
              <RequestCardA key={item.id} request={item} />
            )
          )}
      </div>
      {visibleItems < items.length && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-2"
          >
            {loading ? (
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
  );
};

export default RecommendationsSection;
