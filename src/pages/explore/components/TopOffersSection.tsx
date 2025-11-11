import OfferCard from '@/components/OfferCard';
import { Button } from '@/components/ui/button';
import {
  offersSupabaseService as service,
  type SupabaseOffer,
} from '@/services/offersSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Length = 8;

const TopOffersSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SupabaseOffer[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await service.getTrendingOffers(Length);
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
        <h2>{t('explore.topOffers')}</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={() => navigate('/explore/all-offers')}
        >
          {t('explore.viewAll')}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {loading
          ? // Loading skeleton
            Array.from({ length: Length }).map((_, index) => (
              <OfferCard key={index} loading />
            ))
          : items.map((item) => (
              <OfferCard key={item.id} offer={item} />
            ))}
      </div>
    </section>
  );
};

export default TopOffersSection;
