import { Badge } from '@/components/ui/badge';
import { SupabaseOffer } from '@/services/offersSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useWishlistStore } from '@/store/zustand';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

interface OfferCardProps {
  loading?: boolean;
  offer?: SupabaseOffer;
}

const OfferCard = ({ loading, offer }: OfferCardProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { wishlist, toggleWishlistItem } = useWishlistStore();

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

  console.log('[DEBUG] OfferCard', offer, wishlist);

  return (
    <div
      className="p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
      onClick={() => offer && navigate(`/offers/${offer.id}`)}
    >
      <div className="relative mb-3">
        <div className="w-full h-32 rounded-lg overflow-hidden">
          <ImageWithFallback
            src={offer?.images?.[0] || ''}
            alt={offer?.title}
            className="w-full h-full object-cover"
          />
        </div>
        <Button
          size="sm"
          variant="ghost"
          className={`absolute top-2 right-2 h-8 w-8 p-0 bg-card/80 hover:bg-card rounded-full ${
            offer && wishlist.has(offer.id)
              ? 'text-primary'
              : 'text-muted-foreground'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (offer) toggleWishlistItem(offer.id);
          }}
        >
          <Heart
            className={`h-4 w-4 ${
              offer && wishlist.has(offer.id) ? 'fill-current' : ''
            }`}
          />
        </Button>
        <Badge className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1">
          {offer?.currency === 'USD'
            ? '$'
            : offer?.currency === 'EUR'
            ? '€'
            : offer?.currency === 'GBP'
            ? '£'
            : '¥'}
          {offer?.price}
        </Badge>
        <Badge className="absolute bottom-2 left-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-1">
          {t('common.offer')}
        </Badge>
      </div>
      <div className="space-y-2">
        <h4 className="text-sm line-clamp-2 leading-tight">
          {offer?.title}
        </h4>
        <div className="grid grid-cols-2 gap-1 overflow-hidden">
          <span className="text-xs text-muted-foreground text-ellipsis line-clamp-1">
            {offer?.location}
          </span>
          <Badge className="text-xs">
            {offer?.estimated_delivery
              ? `${offer.estimated_delivery.start} - ${offer.estimated_delivery.end} ${offer.estimated_delivery.type}`
              : 'TBD'}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
