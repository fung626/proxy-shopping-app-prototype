import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { userSupabaseService as service } from '@/services/userSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { User } from '@/types';
import {
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const badges = [
  { id: 1, label: 'Top Agent' },
  { id: 2, label: 'Verified' },
  { id: 3, label: 'New' },
];

// Added demo values for agent details
const demoRatings = [4.5, 4.7, 4.9, 5.0];
const demoReviews = [50, 120, 200, 300];
const demoCompletedOrders = [100, 250, 400, 600];
const demoServiceAreas = [
  'New York, USA',
  'Los Angeles, USA',
  'London, UK',
  'Tokyo, Japan',
];
const demoSpecialties = [
  'Electronics',
  'Fashion',
  'Home Appliances',
  'Books',
];
const demoResponseTimes = ['1h', '2h', '30m', '45m'];

const TopRatedAgentsSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await service.getUsers(2);
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
          <div key={item.id} className="p-4 rounded-xl bg-muted/50">
            <div className="flex space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <ImageWithFallback
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {true && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    {badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {badges.slice(0, 2).map((badge, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs px-1.5 py-0.5"
                          >
                            {badge.label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span>
                      {demoRatings[index % demoRatings.length]}
                    </span>
                    <span className="text-muted-foreground">
                      ({demoReviews[index % demoReviews.length]})
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    {demoSpecialties[index % demoSpecialties.length]}
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {
                        demoServiceAreas[
                          index % demoServiceAreas.length
                        ]
                      }
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <Package className="h-3 w-3" />
                      <span>
                        {
                          demoCompletedOrders[
                            index % demoCompletedOrders.length
                          ]
                        }{' '}
                        {t('common.orders')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {
                          demoResponseTimes[
                            index % demoResponseTimes.length
                          ]
                        }
                      </span>
                    </div>
                  </div>
                </div>
                {item.languages && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">
                      {t('common.languages')}:
                    </span>{' '}
                    {item.languages.join(', ')}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <Button
                className="w-full rounded-lg"
                size="sm"
                onClick={() => navigate(`/messages/agent/${item.id}`)}
              >
                {t('agents.contact')}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopRatedAgentsSection;
