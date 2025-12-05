import { chatSupabaseService } from '@/services';
import { SupabaseUser } from '@/services/type';
import { useLanguage } from '@/store/LanguageContext';
import { useAuthStore } from '@/store/zustand';
import {
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Star,
  User,
} from 'lucide-react';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface AgentCardProps {
  index?: number;
  loading?: boolean;
  item?: SupabaseUser;
}

const badges = [
  { id: 1, label: 'Top Agent' },
  { id: 2, label: 'Verified' },
  { id: 3, label: 'New' },
];

const DemoRatings = [4.5, 4.7, 4.9, 5.0];
const DemoReviews = [50, 120, 200, 300];
const DemoCompletedOrders = [100, 250, 400, 600];
const DemoServiceAreas = [
  '沙田, 新界, 香港',
  '旺角, 九龍, 香港',
  '中環, 港島, 香港',
  '銅鑼灣, 港島, 香港',
];
const DemoSpecialties = [
  'Electronics',
  'Fashion',
  'Home Appliances',
  'Books',
];
const DemoResponseTimes = ['1h', '2h', '30m', '45m'];

const AgentCard: FC<AgentCardProps> = ({
  index = 0,
  loading = false,
  item,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [contactLoading, setContactLoading] = useState(false);

  const handleContactClient = async (agent: SupabaseUser) => {
    setContactLoading(true);
    if (!user) {
      // If not authenticated, redirect to sign in
      if (!user) {
        navigate('/auth/signin');
        setContactLoading(false);
        return;
      }
      setContactLoading(false);
      return;
    }
    if (user.id === agent.id) {
      setContactLoading(false);
      return;
    }
    try {
      // Create or get existing conversation
      const conversation =
        await chatSupabaseService.getOrCreateConversation({
          participant_user_id: agent.id,
        });

      if (conversation) {
        // Navigate to the chat page
        navigate(`/messages/chat/${conversation.id}`);
      } else {
        console.error('Failed to create conversation');
        setContactLoading(false);
      }
    } catch (error) {
      console.error('Error contacting client:', error);
      setContactLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-4 p-4 rounded-xl bg-muted/50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-muted-foreground/50 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted-foreground/50 rounded animate-pulse" />
            <div className="h-3 bg-muted-foreground/30 rounded animate-pulse w-1/2" />
          </div>
        </div>
        <div className="h-4 bg-muted-foreground/50 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted-foreground/50 rounded animate-pulse w-1/2" />
        <div className="flex space-x-4">
          <div className="h-8 bg-muted-foreground/50 rounded animate-pulse flex-1" />
          <div className="h-8 bg-muted-foreground/50 rounded animate-pulse flex-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-muted/50">
      <div className="flex space-x-4">
        <div className="relative">
          {/* <div className="w-16 h-16 rounded-full overflow-hidden">
                  <ImageWithFallback
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div> */}
          <Avatar className="w-12 h-12">
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
          </Avatar>
          {true && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{item?.name}</h3>
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
              <span>{DemoRatings[index % DemoRatings.length]}</span>
              <span className="text-muted-foreground">
                ({DemoReviews[index % DemoReviews.length]})
              </span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>
              {DemoSpecialties[index % DemoSpecialties.length]}
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>
                {DemoServiceAreas[index % DemoServiceAreas.length]}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <Package className="h-3 w-3" />
                <span>
                  {
                    DemoCompletedOrders[
                      index % DemoCompletedOrders.length
                    ]
                  }{' '}
                  {t('common.orders')}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>
                  {
                    DemoResponseTimes[
                      index % DemoResponseTimes.length
                    ]
                  }
                </span>
              </div>
            </div>
          </div>
          {item?.languages && (
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
          onClick={() => item && handleContactClient(item)}
          disabled={contactLoading}
        >
          {contactLoading ? t('common.loading') : t('agents.contact')}
        </Button>
      </div>
    </div>
  );
};

export default AgentCard;
