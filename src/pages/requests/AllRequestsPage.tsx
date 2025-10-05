import RequestCardB from '@/components/RequestCardB';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CATEGORIES } from '@/config/categories';
import {
  requestsSupabaseService as service,
  SupabaseRequest,
} from '@/services/requestsSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AllRequestsPage() {
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<SupabaseRequest[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const requests = await service.getRequests();
        setItems(requests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      item.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="px-4 pt-4 pb-4">
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
          {CATEGORIES.map((category) => (
            <Badge
              key={category.id}
              variant={
                selectedCategory === category.id
                  ? 'default'
                  : 'secondary'
              }
              className="whitespace-nowrap cursor-pointer px-4 py-2 rounded-full"
              onClick={() => setSelectedCategory(category.id)}
            >
              {t(category.translationKey)}
            </Badge>
          ))}
        </div>
      </div>
      {/* Results */}
      <div className="px-4 py-6">
        <div className="mb-4">
          <span className="text-muted-foreground text-sm">
            {t('common.requestsFound', {
              count: filteredItems.length,
            })}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <RequestCardB key={index} loading />
              ))
            : filteredItems.map((item) => (
                <RequestCardB key={item.id} request={item} />
              ))}
        </div>
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t('common.noRequestsFound')}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              {t('common.clearFilters')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
