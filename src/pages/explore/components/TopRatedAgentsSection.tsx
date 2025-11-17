import AgentCard from '@/components/AgentCard';
import { Button } from '@/components/ui/button';
import { SupabaseUser } from '@/services/type';
import { userSupabaseService as service } from '@/services/userSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TopRatedAgentsSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SupabaseUser[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await service.getUsers(4);
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
        <h2>{t('explore.topRatedAgents')}</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={() => navigate('/explore/all-agents')}
        >
          {t('explore.viewAll')}
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <AgentCard
            key={item.id}
            index={index}
            loading={loading}
            item={item}
          />
        ))}
      </div>
    </section>
  );
};

export default TopRatedAgentsSection;
