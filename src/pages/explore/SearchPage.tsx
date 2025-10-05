import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/store/LanguageContext';
import { CATEGORIES, getCategoryName } from '@/utils/categories';
import {
  Clock,
  Heart,
  MapPin,
  Package,
  Search,
  Star,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchPageProps {
  onBack: () => void;
  initialQuery?: string;
}

export function SearchPage({
  onBack,
  initialQuery = '',
}: SearchPageProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] =
    useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set<number>());

  // Focus the search input when page loads
  useEffect(() => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      setTimeout(() => {
        searchInput.focus();
      }, 100);
    }
  }, []);

  // Mock data for search results
  const allResults = [
    // Requests
    {
      id: 1,
      type: 'request' as const,
      title: 'Designer Winter Coat from Paris',
      description:
        'Looking for a premium winter coat from a luxury Parisian boutique',
      budget: { min: 300, max: 500, currency: 'USD' },
      location: 'Paris, France',
      timeAgo: '2 hours ago',
      user: 'Emily Chen',
      offers: 12,
      category: 'fashion',
      image:
        'https://images.unsplash.com/photo-1645633090316-bcaafbfd4c4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGVycGElMjBjb2F0JTIwd2ludGVyJTIwamFja2V0fGVufDF8fHx8MTc1ODcxMjE3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      type: 'request' as const,
      title: 'Latest iPhone from Japan',
      description:
        'Looking for the latest iPhone model with Japanese exclusive features',
      budget: { min: 800, max: 1200, currency: 'USD' },
      location: 'Tokyo, Japan',
      timeAgo: '1 hour ago',
      user: 'David Park',
      offers: 15,
      category: 'electronics',
      image:
        'https://images.unsplash.com/photo-1667178173387-7e0cb51c0b4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHMlMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc1ODYwNjc1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    // Offers
    {
      id: 3,
      type: 'offer' as const,
      title: 'Korean K-Beauty Skincare Set',
      description: 'Authentic K-beauty products from Seoul',
      price: 89.99,
      currency: 'USD',
      agentName: 'Rio Mays',
      agentRating: 4.8,
      agentReviews: 67,
      location: 'Seoul, South Korea',
      estimatedDelivery: '5-7 days',
      category: 'beauty',
      image:
        'https://images.unsplash.com/photo-1686831451322-8d8e234a51e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBza2luY2FyZSUyMGJlYXV0eSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODcwNTYxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      agentId: 'agent_rio_mays',
    },
    {
      id: 4,
      type: 'offer' as const,
      title: 'Japanese Tech Gadgets Bundle',
      description:
        'Latest tech gadgets from Tokyo electronics district',
      price: 299.99,
      currency: 'USD',
      agentName: "Ethan O'Neill",
      agentRating: 4.9,
      agentReviews: 123,
      location: 'Tokyo, Japan',
      estimatedDelivery: '3-5 days',
      category: 'electronics',
      image:
        'https://images.unsplash.com/photo-1584658645175-90788b3347b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGVsZWN0cm9uaWNzJTIwdGVjaCUyMGdhZGdldHN8ZW58MXx8fHwxNzU4NzA1NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      agentId: 'agent_ethan_oneill',
    },
    {
      id: 5,
      type: 'offer' as const,
      title: 'European Fashion Accessories',
      description: 'Luxury fashion accessories from Paris boutiques',
      price: 159.99,
      currency: 'EUR',
      agentName: 'Marie Dubois',
      agentRating: 4.7,
      agentReviews: 89,
      location: 'Paris, France',
      estimatedDelivery: '7-10 days',
      category: 'fashion',
      image:
        'https://images.unsplash.com/photo-1575404199108-c7417489517d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBwYXJpcyUyMGx1eHVyeXxlbnwxfHx8fDE3NTg3MDU2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      agentId: 'agent_marie_dubois',
    },
    {
      id: 6,
      type: 'request' as const,
      title: 'Luxury Watch from Switzerland',
      description: 'Seeking authentic Swiss luxury timepiece',
      budget: { min: 2000, max: 5000, currency: 'USD' },
      location: 'Geneva, Switzerland',
      timeAgo: '30 minutes ago',
      user: 'Alexandra Smith',
      offers: 6,
      category: 'accessories',
      image:
        'https://images.unsplash.com/photo-1664764966090-e5d93ae48dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0b3RlJTIwYmFnJTIwaGFuZGJhZ3xlbnwxfHx8fDE3NTg3MTIxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  // Filter and sort results
  const filteredResults = useMemo(() => {
    let results = allResults;

    // Filter by search query
    if (searchQuery.trim()) {
      results = results.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (item.type === 'request' &&
            item.user
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (item.type === 'offer' &&
            item.agentName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(
        (item) => item.category === selectedCategory
      );
    }

    // Sort results
    switch (sortBy) {
      case 'newest':
        results = results.sort((a, b) => {
          const timeA =
            a.type === 'request' ? new Date(a.timeAgo) : new Date();
          const timeB =
            b.type === 'request' ? new Date(b.timeAgo) : new Date();
          return timeB.getTime() - timeA.getTime();
        });
        break;
      case 'price-low':
        results = results.sort((a, b) => {
          const priceA =
            a.type === 'request' ? a.budget.min : a.price;
          const priceB =
            b.type === 'request' ? b.budget.min : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        results = results.sort((a, b) => {
          const priceA =
            a.type === 'request' ? a.budget.max : a.price;
          const priceB =
            b.type === 'request' ? b.budget.max : b.price;
          return priceB - priceA;
        });
        break;
      case 'popular':
        results = results.sort((a, b) => {
          const popularityA =
            a.type === 'request' ? a.offers : a.agentReviews;
          const popularityB =
            b.type === 'request' ? b.offers : b.agentReviews;
          return popularityB - popularityA;
        });
        break;
    }

    return results;
  }, [searchQuery, selectedCategory, sortBy]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const handleFilter = () => {
    setShowFilters(!showFilters);
  };

  const headerContent = (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          id="search-input"
          placeholder={t('explore.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 bg-input-background border-0 rounded-lg text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-3">
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-auto min-w-[120px] h-9 bg-input-background border-0 rounded-lg">
            <SelectValue placeholder={t('common.category')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('categories.all')}</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {getCategoryName(category.id, t)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-auto min-w-[120px] h-9 bg-input-background border-0 rounded-lg">
            <SelectValue placeholder={t('common.sort')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              {t('search.sortNewest')}
            </SelectItem>
            <SelectItem value="price-low">
              {t('search.sortPriceLow')}
            </SelectItem>
            <SelectItem value="price-high">
              {t('search.sortPriceHigh')}
            </SelectItem>
            <SelectItem value="popular">
              {t('search.sortPopular')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-background pb-20">
      {/* Results */}
      <div className="px-4 py-6">
        <div className="mb-4">
          <span className="text-muted-foreground text-sm">
            {t('common.itemsFound', {
              count: filteredResults.length,
            })}
          </span>
        </div>

        {filteredResults.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('common.noItemsFound')}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? t('common.adjustSearchTerms')
                : t('search.tryDifferentTerms')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredResults.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => {
                  if (item.type === 'request') {
                    navigate(`/requests/${item.id}`);
                  } else {
                    navigate(`/offers/${item.id}`);
                  }
                }}
              >
                <div className="relative mb-3">
                  <div className="w-full h-32 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className={`absolute top-2 right-2 h-8 w-8 p-0 bg-card/80 hover:bg-card rounded-full ${
                      favorites.has(item.id)
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.has(item.id) ? 'fill-current' : ''
                      }`}
                    />
                  </Button>

                  {item.type === 'request' ? (
                    <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1">
                      {item.budget.currency === 'USD'
                        ? '$'
                        : item.budget.currency === 'EUR'
                        ? '€'
                        : '¥'}
                      {item.budget.min}-{item.budget.max}
                    </Badge>
                  ) : (
                    <Badge className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1">
                      {item.currency === 'USD'
                        ? '$'
                        : item.currency === 'EUR'
                        ? '€'
                        : '¥'}
                      {item.price}
                    </Badge>
                  )}

                  <Badge
                    className={`absolute bottom-2 left-2 text-xs px-2 py-1 ${
                      item.type === 'request'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    }`}
                  >
                    {item.type === 'request'
                      ? t('common.request')
                      : t('common.offer')}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm line-clamp-2 leading-tight">
                    {item.title}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {item.location}
                      </span>
                    </div>
                    {item.type === 'request' ? (
                      <Badge
                        variant="secondary"
                        className="text-xs whitespace-nowrap"
                      >
                        {item.offers} offers
                      </Badge>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="whitespace-nowrap">
                          {item.agentRating}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate mr-2">
                      {item.type === 'request'
                        ? item.user
                        : item.agentName}
                    </span>
                    {item.type === 'request' ? (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs whitespace-nowrap">
                          {item.timeAgo}
                        </span>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs whitespace-nowrap"
                      >
                        {item.agentReviews} reviews
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
