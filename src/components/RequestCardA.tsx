import { Badge } from '@/components/ui/badge';
import { SupabaseRequest } from '@/services/requestsSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useWishlistStore } from '@/store/zustand';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

interface RequestCardAProps {
  loading?: boolean;
  request?: SupabaseRequest;
}

const RequestCardA = ({ loading, request }: RequestCardAProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isWishlistItem, toggleWishlistItem } = useWishlistStore();

  if (loading) {
    return (
      <div className="p-3 rounded-xl bg-muted/50 animate-pulse">
        <div className="w-full h-32 rounded-lg bg-muted mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
      onClick={() => {
        if (request) {
          navigate(`/requests/${request.id}`);
        }
      }}
    >
      <div className="relative mb-3">
        <div className="w-full h-32 rounded-lg overflow-hidden">
          <ImageWithFallback
            src={request?.images?.[0] || ''}
            alt={request?.title}
            className="w-full h-full object-cover"
          />
        </div>
        <Button
          size="sm"
          variant="ghost"
          className={`absolute top-2 right-2 h-8 w-8 p-0 bg-card/80 hover:bg-card rounded-full ${
            request && isWishlistItem(request.id)
              ? 'text-primary'
              : 'text-muted-foreground'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (request) toggleWishlistItem(request.id, 'request');
          }}
        >
          <Heart
            className={`h-4 w-4 ${
              request && isWishlistItem(request.id)
                ? 'fill-current'
                : ''
            }`}
          />
        </Button>
        <Badge
          className={`absolute top-2 left-2 text-white text-xs px-2 py-1 bg-blue-600`}
        >
          {request?.budget_min} - {request?.budget_max}{' '}
          {request?.currency}
        </Badge>
        <Badge
          className={`absolute bottom-2 left-2 text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300`}
        >
          {t('common.request')}
        </Badge>
      </div>
      <div className="space-y-2">
        <h4 className="text-sm line-clamp-2 leading-tight">
          {request?.title}
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            {request?.user_name}
          </span>
          <Badge variant="secondary" className="text-xs">
            {request?.expected_delivery?.start} -{' '}
            {request?.expected_delivery?.end}{' '}
            {request?.expected_delivery?.unit}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default RequestCardA;
