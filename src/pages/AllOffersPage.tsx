import { useState } from 'react';
import { ArrowLeft, Search, Filter, MapPin, Star, Heart } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useLanguage } from '../store/LanguageContext';

interface AllOffersPageProps {
  onBack?: () => void;
  onContactAgent?: (agentId: string) => void;
  onNavigateToOfferDetails?: (offer: any) => void;
}

export function AllOffersPage({ onBack, onContactAgent, onNavigateToOfferDetails }: AllOffersPageProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Extended data with more shopping offers
  const allOffers = [
    {
      id: 1,
      title: 'Korean K-Beauty Skincare Set',
      category: 'beauty',
      price: 89.99,
      currency: 'USD',
      agentName: 'Rio Mays',
      agentRating: 4.8,
      agentReviews: 67,
      location: 'Seoul, South Korea',
      shoppingLocation: 'Myeongdong District',
      estimatedDelivery: '5-7 days',
      tags: ['authentic', 'trending', 'k-beauty'],
      status: 'active' as const,
      image: 'https://images.unsplash.com/photo-1686831451322-8d8e234a51e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBza2luY2FyZSUyMGJlYXV0eSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODcwNTYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_rio_mays'
    },
    {
      id: 2,
      title: 'Japanese Tech Gadgets Bundle',
      category: 'electronics',
      price: 299.99,
      currency: 'USD',
      agentName: 'Ethan O\'Neill',
      agentRating: 4.9,
      agentReviews: 123,
      location: 'Tokyo, Japan',
      shoppingLocation: 'Akihabara Electronics District',
      estimatedDelivery: '3-5 days',
      tags: ['exclusive', 'limited-edition', 'tech'],
      status: 'active' as const,
      image: 'https://images.unsplash.com/photo-1584658645175-90788b3347b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGVsZWN0cm9uaWNzJTIwdGVjaCUyMGdhZGdldHN8ZW58MXx8fHwxNzU4NzA1NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_ethan_oneill'
    },
    {
      id: 3,
      title: 'European Fashion Accessories',
      category: 'fashion',
      price: 159.99,
      currency: 'EUR',
      agentName: 'Marie Dubois',
      agentRating: 4.7,
      agentReviews: 89,
      location: 'Paris, France',
      shoppingLocation: 'Galeries Lafayette',
      estimatedDelivery: '7-10 days',
      tags: ['luxury', 'authentic', 'designer'],
      status: 'active' as const,
      image: 'https://images.unsplash.com/photo-1575404199108-c7417489517d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBwYXJpcyUyMGx1eHVyeXxlbnwxfHx8fDE3NTg3MDU2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_marie_dubois'
    },
    {
      id: 4,
      title: 'American Streetwear Collection',
      category: 'fashion',
      price: 199.99,
      currency: 'USD',
      agentName: 'Alex Thompson',
      agentRating: 4.6,
      agentReviews: 45,
      location: 'Los Angeles, CA',
      shoppingLocation: 'Melrose Avenue',
      estimatedDelivery: '2-4 days',
      tags: ['streetwear', 'limited', 'trendy'],
      status: 'active' as const,
      image: 'https://images.unsplash.com/flagged/photo-1564723150667-e0c8d8ea3246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwZmFzaGlvbiUyMGNsb3RoaW5nJTIwdXJiYW58ZW58MXx8fHwxNzU4NzA1NjI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_alex_thompson'
    },
    {
      id: 5,
      title: 'Italian Luxury Handbags',
      category: 'fashion',
      price: 450.00,
      currency: 'EUR',
      agentName: 'Isabella Romano',
      agentRating: 4.9,
      agentReviews: 156,
      location: 'Milan, Italy',
      shoppingLocation: 'Quadrilatero della Moda',
      estimatedDelivery: '5-8 days',
      tags: ['luxury', 'authentic', 'italian'],
      status: 'active' as const,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnJTIwaXRhbGlhbiUyMGxlYXRoZXJ8ZW58MXx8fHwxNzU4NzA1NjMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_isabella_romano'
    },
    {
      id: 6,
      title: 'British Tea & Specialty Foods',
      category: 'food',
      price: 75.00,
      currency: 'GBP',
      agentName: 'James Mitchell',
      agentRating: 4.5,
      agentReviews: 78,
      location: 'London, UK',
      shoppingLocation: 'Harrods Food Halls',
      estimatedDelivery: '4-6 days',
      tags: ['authentic', 'traditional', 'gourmet'],
      status: 'active' as const,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicml0aXNoJTIwdGVhJTIwZ291cm1ldCUyMGZvb2R8ZW58MXx8fHwxNzU4NzA1NjM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      agentId: 'agent_james_mitchell'
    }
  ];

  const categories = [
    { key: 'all', label: t('categories.all') },
    { key: 'fashion', label: t('categories.fashion') },
    { key: 'electronics', label: t('categories.electronics') },
    { key: 'beauty', label: t('categories.beauty') },
    { key: 'food', label: t('categories.food') },
    { key: 'home', label: t('categories.home') },
    { key: 'sports', label: t('categories.sports') }
  ];

  const toggleFavorite = (id: number) => {
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

  const filteredOffers = allOffers.filter(offer => {
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="bg-card px-4 pt-8 pb-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">{t('explore.allOffers')}</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder={t('common.searchOffers')} 
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 bg-input-background border-0 rounded-lg text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Category Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Badge 
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "secondary"}
              className="whitespace-nowrap cursor-pointer px-4 py-2 rounded-full"
              onClick={() => setSelectedCategory(category.key)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-6">
        <div className="mb-4">
          <span className="text-muted-foreground text-sm">
            {t('common.offersFound', { count: filteredOffers.length })}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredOffers.map((offer) => (
            <div 
              key={offer.id} 
              className="p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => onNavigateToOfferDetails?.(offer)}
            >
              <div className="relative mb-3">
                <div className="w-full h-32 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className={`absolute top-2 right-2 h-8 w-8 p-0 bg-card/80 hover:bg-card rounded-full ${
                    favorites.has(offer.id) ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(offer.id);
                  }}
                >
                  <Heart className={`h-4 w-4 ${favorites.has(offer.id) ? 'fill-current' : ''}`} />
                </Button>
                <Badge className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1">
                  {offer.currency === 'USD' ? '$' : offer.currency === 'EUR' ? '€' : offer.currency === 'GBP' ? '£' : '¥'}{offer.price}
                </Badge>
                <Badge className="absolute bottom-2 left-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-1">
                  {t('common.offer')}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm line-clamp-2 leading-tight">{offer.title}</h4>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {offer.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground truncate mr-2">{offer.agentName}</span>
                  <Badge variant="secondary" className="text-xs whitespace-nowrap">
                    {offer.estimatedDelivery}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('common.noOffersFound')}</p>
            <Button variant="outline" className="mt-4" onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}>
              {t('common.clearFilters')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}