import OfferCard from '@/components/OfferCard';
import RequestCardB from '@/components/RequestCardB';
import { Input } from '@/components/ui/input';
import { offersSupabaseService } from '@/services/offersSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { Package, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CategoryPageProps {
  category: string;
  onBack: () => void;
}

export function CategoryPage({
  category,
  onBack,
}: CategoryPageProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [categoryData, setCategoryData] = useState<{
    title: string;
    description: string;
    requests: any[];
    offers: any[];
  }>({
    title: '',
    description: '',
    requests: [],
    offers: [],
  });

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const offers = await offersSupabaseService.getOffers({
          category,
        });
        setCategoryData({
          title: t(`categories.${category}`),
          description: t(`categories.${category}Description`),
          requests: [], // Adjust if requests are fetched differently
          offers,
        });
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchCategoryData();
  }, [category, t]);

  const allItems = [
    ...categoryData.requests.map((item) => ({
      ...item,
      type: 'request',
    })),
    ...categoryData.offers.map((item) => ({
      ...item,
      type: 'offer',
    })),
  ];

  // Filter items based on search only
  const filteredItems = useMemo(() => {
    let items = allItems;
    if (searchQuery) {
      items = items.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
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

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(e.target.value);
  };

  console.log('[DEBUG] CategoryPage Rendered', filteredItems);

  return (
    <div className="flex-1 bg-background pb-20">
      {/* Header */}
      <div className="px-4 pt-4 pb-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t('common.searchInCategory', {
              category: categoryData.title,
            })}
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
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('common.noItemsFound')}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? t('common.adjustSearchTerms')
                : t('common.noItemsInCategory')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item) =>
              item.type === 'request' ? (
                <RequestCardB key={item.id} request={item} />
              ) : (
                <OfferCard key={item.id} offer={item} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
