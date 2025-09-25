import { useState, useMemo } from 'react';
import { ArrowLeft, Search, Filter, MapPin, Clock, Users, Star, Package, Eye, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useLanguage } from '../store/LanguageContext';

interface CategoryPageProps {
  category: string;
  onBack: () => void;
  onNavigateToRequestDetails?: (request: any) => void;
  onContactAgent?: (agentId: string) => void;
}

export function CategoryPage({ category, onBack, onNavigateToRequestDetails, onContactAgent }: CategoryPageProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Category-specific data
  const categoryData = {
    'fashion': {
      title: t('categories.fashion'),
      description: t('categories.fashionDescription'),
      requests: [
        {
          id: 'fashion-req-1',
          title: 'Designer Winter Coat from Paris',
          budget: { min: 300, max: 500, currency: 'USD' },
          location: 'Paris, France',
          timeAgo: '2 hours ago',
          description: 'Looking for a premium winter coat from a luxury Parisian boutique',
          user: 'Emily Chen',
          offers: 12,
          image: 'https://images.unsplash.com/photo-1645633090316-bcaafbfd4c4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGVycGElMjBjb2F0JTIwd2ludGVyJTIwamFja2V0fGVufDF8fHx8MTc1ODcxMjE3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        },
        {
          id: 'fashion-req-2',
          title: 'Vintage Leather Jacket',
          budget: { min: 150, max: 250, currency: 'USD' },
          location: 'Tokyo, Japan',
          timeAgo: '5 hours ago',
          description: 'Seeking authentic vintage leather jacket from Tokyo vintage stores',
          user: 'Marcus Johnson',
          offers: 8,
          image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbGVhdGhlciUyMGphY2tldHxlbnwxfHx8fDE3NTg3MTIxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        }
      ],
      offers: [
        {
          id: 'fashion-offer-1',
          title: 'Italian Designer Handbags',
          price: 320,
          currency: 'USD',
          agent: 'Isabella Rossi',
          location: 'Milan, Italy',
          rating: 4.9,
          reviews: 127,
          timeAgo: '1 hour ago',
          description: 'Authentic designer handbags from Milan fashion district',
          image: 'https://images.unsplash.com/photo-1664764966090-e5d93ae48dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0b3RlJTIwYmFnJTIwaGFuZGJhZ3xlbnwxfHx8fDE3NTg3MTIxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        },
        {
          id: 'fashion-offer-2',
          title: 'Korean Streetwear Collection',
          price: 85,
          currency: 'USD',
          agent: 'Rio Mays',
          location: 'Seoul, South Korea',
          rating: 4.8,
          reviews: 94,
          timeAgo: '3 hours ago',
          description: 'Trendy streetwear from Seoul fashion districts',
          image: 'https://images.unsplash.com/photo-1737666636073-f15d9762cf83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWNrZXQlMjBoYXQlMjBjYXAlMjBzdHJlZXR3ZWFyfGVufDF8fHx8MTc1ODcxMjE4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        }
      ]
    },
    'electronics': {
      title: t('categories.electronics'),
      description: t('categories.electronicsDescription'),
      requests: [
        {
          id: 'tech-req-1',
          title: 'Latest iPhone from Japan',
          budget: { min: 800, max: 1200, currency: 'USD' },
          location: 'Tokyo, Japan',
          timeAgo: '1 hour ago',
          description: 'Looking for the latest iPhone model with Japanese exclusive features',
          user: 'David Park',
          offers: 15,
          image: 'https://images.unsplash.com/photo-1667178173387-7e0cb51c0b4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHMlMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc1ODYwNjc1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        }
      ],
      offers: [
        {
          id: 'tech-offer-1',
          title: 'Premium Audio Gear',
          price: 450,
          currency: 'USD',
          agent: 'Ethan O\'Neill',
          location: 'Tokyo, Japan',
          rating: 4.9,
          reviews: 156,
          timeAgo: '2 hours ago',
          description: 'High-end audio equipment from Japan',
          image: 'https://images.unsplash.com/photo-1667178173387-7e0cb51c0b4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHMlMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc1ODYwNjc1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        }
      ]
    },
    'accessories': {
      title: t('categories.accessories'),
      description: t('categories.accessoriesDescription'),
      requests: [
        {
          id: 'acc-req-1',
          title: 'Luxury Watch from Switzerland',
          budget: { min: 2000, max: 5000, currency: 'USD' },
          location: 'Geneva, Switzerland',
          timeAgo: '30 minutes ago',
          description: 'Seeking authentic Swiss luxury timepiece',
          user: 'Alexandra Smith',
          offers: 6,
          image: 'https://images.unsplash.com/photo-1664764966090-e5d93ae48dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0b3RlJTIwYmFnJTIwaGFuZGJhZ3xlbnwxfHx8fDE3NTg3MTIxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        }
      ],
      offers: [
        {
          id: 'acc-offer-1',
          title: 'Designer Handbag Collection',
          price: 890,
          currency: 'USD',
          agent: 'Marie Dubois',
          location: 'Paris, France',
          rating: 4.7,
          reviews: 89,
          timeAgo: '1 hour ago',
          description: 'Luxury handbags from Parisian boutiques',
          image: 'https://images.unsplash.com/photo-1664764966090-e5d93ae48dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0b3RlJTIwYmFnJTIwaGFuZGJhZ3xlbnwxfHx8fDE3NTg3MTIxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        }
      ]
    },
    'beauty': {
      title: t('categories.beauty'),
      description: t('categories.beautyDescription'),
      requests: [],
      offers: []
    }
  };

  const currentCategory = categoryData[category as keyof typeof categoryData] || categoryData.fashion;
  const allItems = [...currentCategory.requests.map(item => ({ ...item, type: 'request' })), 
                   ...currentCategory.offers.map(item => ({ ...item, type: 'offer' }))];

  // Filter items based on search only
  const filteredItems = useMemo(() => {
    let items = allItems;
    
    if (searchQuery) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return items;
  }, [allItems, searchQuery]);

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex-1 bg-background pb-20">
      {/* Header */}
      <div className="bg-card px-4 pt-8 pb-4 border-b border-border">
        <div className="flex items-center space-x-4 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{currentCategory.title}</h1>
            <p className="text-sm text-muted-foreground">{currentCategory.description}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder={t('common.searchInCategory', { category: currentCategory.title })} 
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 bg-input-background border-0 rounded-lg text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="mb-4">
          <span className="text-muted-foreground text-sm">
            {t('common.itemsFound', { count: filteredItems.length })}
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">{t('common.noItemsFound')}</h3>
            <p className="text-muted-foreground">
              {searchQuery ? t('common.adjustSearchTerms') : t('common.noItemsInCategory')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => {
                  if (item.type === 'request') {
                    onNavigateToRequestDetails?.(item);
                  } else {
                    onContactAgent?.(item.agent);
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
                      favorites.has(item.id) ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
                  </Button>
                  
                  {item.type === 'request' ? (
                    <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1">
                      {item.budget.currency === 'USD' ? '$' : item.budget.currency === 'EUR' ? '€' : item.budget.currency === 'GBP' ? '£' : '¥'}{item.budget.min}-{item.budget.max}
                    </Badge>
                  ) : (
                    <Badge className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1">
                      {item.currency === 'USD' ? '$' : item.currency === 'EUR' ? '€' : item.currency === 'GBP' ? '£' : '¥'}{item.price}
                    </Badge>
                  )}
                  
                  <Badge className={`absolute bottom-2 left-2 text-xs px-2 py-1 ${
                    item.type === 'request' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  }`}>
                    {item.type === 'request' ? 'Request' : 'Offer'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm line-clamp-2 leading-tight">{item.title}</h4>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    {item.type === 'request' ? (
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        {item.offers} offers
                      </Badge>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="whitespace-nowrap">{item.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate mr-2">
                      {item.type === 'request' ? item.user : item.agent}
                    </span>
                    {item.type === 'request' ? (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs whitespace-nowrap">{item.timeAgo}</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {item.reviews} reviews
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