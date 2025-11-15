import { Button } from '@/components/ui/button';
import { useLanguage } from '@/store/LanguageContext';
import { useWishlistStore } from '@/store/zustand';
import { Heart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PopularCategoriesSection from '../explore/components/PopularCategoriesSection';
import RecommendationsSection from '../explore/components/RecommendationsSection';
import RequestsForYouSection from '../explore/components/RequestsForYouSection';
import TopOffersSection from '../explore/components/TopOffersSection';
import TopRatedAgentsSection from '../explore/components/TopRatedAgentsSection';

export function ExploreTab() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { getWishlistCount } = useWishlistStore();

  return (
    <div className="flex-1 bg-background pb-[74px]">
      <div className="bg-card px-4 pt-12 pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-foreground">
            {t('nav.explore')}
          </h1>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/explore/wishlist')}
              className="relative rounded-full h-10 w-10"
            >
              <Heart
                className={`h-6 w-6 ${
                  getWishlistCount() > 0
                    ? 'text-primary fill-current'
                    : 'text-muted-foreground'
                }`}
              />
              {getWishlistCount() > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {getWishlistCount()}
                  </span>
                </div>
              )}
            </Button>
          </div>
        </div>
        {/* Search Bar - Button that looks like Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
          <Button
            variant="ghost"
            onClick={() => navigate('/explore/search')}
            className="w-full h-12 pl-10 pr-4 bg-input-background border-0 rounded-lg text-muted-foreground hover:bg-input-background/70 transition-colors justify-start font-normal"
          >
            {t('explore.searchPlaceholder')}
          </Button>
        </div>
      </div>
      <div className="px-4 py-6 space-y-6">
        <PopularCategoriesSection />
        <TopOffersSection />
        <RequestsForYouSection />
        <TopRatedAgentsSection />
        <RecommendationsSection />
      </div>
    </div>
  );
}
