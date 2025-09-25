import { useState } from 'react';
import { ArrowLeft, Search, Filter, MapPin, Star, Heart, Clock } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useLanguage } from '../store/LanguageContext';

interface AllRequestsPageProps {
  onBack?: () => void;
  onNavigateToRequestDetails?: (request: any) => void;
}

export function AllRequestsPage({ onBack, onNavigateToRequestDetails }: AllRequestsPageProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Extended data with more requests
  const allRequests = [
    {
      id: 1,
      title: 'Office Equipment & Supplies',
      category: 'electronics',
      budget: '$5,000 - $15,000',
      location: 'New York, NY',
      urgency: 'High',
      rating: 4.8,
      reviews: 124,
      bids: 8,
      image: 'https://images.unsplash.com/photo-1542725783-079749686aaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBlcXVpcG1lbnQlMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NTg3MDU2MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'High-quality office equipment for small to medium businesses',
      clientName: 'Tech Solutions Inc.',
      postedDate: '2024-01-15',
      deadline: '2024-02-15'
    },
    {
      id: 2,
      title: 'Industrial Construction Tools',
      category: 'home',
      budget: '$2,000 - $8,000',
      location: 'Los Angeles, CA',
      urgency: 'Medium',
      rating: 4.6,
      reviews: 89,
      bids: 12,
      image: 'https://images.unsplash.com/photo-1756402664856-91a90f90b70b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0b29scyUyMGluZHVzdHJpYWwlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzU4NzA1NjE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Professional-grade construction tools for renovation project',
      clientName: 'Metro Construction',
      postedDate: '2024-01-18',
      deadline: '2024-02-10'
    },
    {
      id: 3,
      title: 'Vintage Fashion Collection',
      category: 'fashion',
      budget: '$800 - $2,500',
      location: 'London, UK',
      urgency: 'Low',
      rating: 4.9,
      reviews: 156,
      bids: 5,
      image: 'https://images.unsplash.com/photo-1575404199108-c7417489517d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBwYXJpcyUyMGx1eHVyeXxlbnwxfHx8fDE3NTg3MDU2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Authentic vintage pieces from 1970s-1990s',
      clientName: 'Vintage Boutique',
      postedDate: '2024-01-20',
      deadline: '2024-03-01'
    },
    {
      id: 4,
      title: 'Korean Beauty Products',
      category: 'beauty',
      budget: '$300 - $800',
      location: 'Seoul, South Korea',
      urgency: 'High',
      rating: 4.7,
      reviews: 98,
      bids: 15,
      image: 'https://images.unsplash.com/photo-1686831451322-8d8e234a51e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBza2luY2FyZSUyMGJlYXV0eSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODcwNTYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Latest K-beauty skincare and makeup products',
      clientName: 'Beauty Enthusiast',
      postedDate: '2024-01-22',
      deadline: '2024-02-05'
    },
    {
      id: 5,
      title: 'Smart Home Automation System',
      category: 'electronics',
      budget: '$1,500 - $5,000',
      location: 'San Francisco, CA',
      urgency: 'Medium',
      rating: 4.5,
      reviews: 67,
      bids: 9,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGhvbWUlMjBhdXRvbWF0aW9uJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTg3MDU2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Complete smart home setup for modern living',
      clientName: 'Smart Living Co.',
      postedDate: '2024-01-25',
      deadline: '2024-02-20'
    },
    {
      id: 6,
      title: 'Artisan Jewelry Collection',
      category: 'fashion',
      budget: '$500 - $1,200',
      location: 'Florence, Italy',
      urgency: 'Low',
      rating: 4.8,
      reviews: 45,
      bids: 7,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwamV3ZWxyeSUyMGhhbmRtYWRlJTIwbHV4dXJ5fGVufDF8fHx8MTc1ODcwNTYzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Handcrafted jewelry pieces from Italian artisans',
      clientName: 'Bella Jewelry',
      postedDate: '2024-01-28',
      deadline: '2024-03-15'
    }
  ];

  const categories = [
    { key: 'all', label: t('categories.all') },
    { key: 'fashion', label: t('categories.fashion') },
    { key: 'electronics', label: t('categories.electronics') },
    { key: 'home', label: t('categories.home') },
    { key: 'beauty', label: t('categories.beauty') },
    { key: 'sports', label: t('categories.sports') },
    { key: 'books', label: t('categories.books') }
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

  const filteredRequests = allRequests.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase());
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
          <h1 className="text-xl font-semibold text-foreground">{t('explore.allRequests')}</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder={t('common.searchRequests')} 
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
            {t('common.requestsFound', { count: filteredRequests.length })}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredRequests.map((item) => (
            <div 
              key={item.id} 
              className="p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => onNavigateToRequestDetails?.(item)}
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
                <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1">
                  {item.budget.split(' - ')[0]}
                </Badge>
                <Badge className="absolute bottom-2 left-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-1">
                  {t('common.request')}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm line-clamp-2 leading-tight">{item.title}</h4>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs whitespace-nowrap">
                    {t('common.offersCount', { count: item.bids })}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground truncate mr-2">{item.clientName}</span>
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    {item.urgency}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('common.noRequestsFound')}</p>
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