import RequestCardA from '@/components/RequestCardA';
import { Button } from '@/components/ui/button';
import {
  requestsSupabaseService as service,
  type SupabaseRequest,
} from '@/services/requestsSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Length = 6;

const RequestsForYouSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SupabaseRequest[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await service.getTrendingRequests(Length);
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2>{t('explore.requestsForYou')}</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={() => navigate('/explore/all-requests')}
        >
          {t('explore.viewAll')}
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {loading
          ? // Loading skeleton
            Array.from({ length: Length }).map((_, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-muted/50 animate-pulse"
              >
                <div className="w-full h-32 rounded-lg bg-muted mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))
          : items.map((item) => (
              <RequestCardA key={item.id} request={item} />
            ))}
      </div>
    </section>
  );
};

export default RequestsForYouSection;
