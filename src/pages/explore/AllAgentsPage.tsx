import AgentCard from '@/components/AgentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SupabaseUser } from '@/services/type';
import { userSupabaseService as service } from '@/services/userSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { Search, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AllAgentsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [items, setItems] = useState<SupabaseUser[]>([]);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const res = await service.getUsers();
        setItems(res);
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const specialties = [
    { value: 'all', label: t('allAgents.allSpecialties') },
    { value: 'technology', label: t('allAgents.technologyShopping') },
    { value: 'fashion', label: t('allAgents.fashionLuxury') },
    { value: 'beauty', label: t('allAgents.beautySkincare') },
    { value: 'electronics', label: t('allAgents.electronicsTech') },
    { value: 'home', label: t('allAgents.homeAppliances') },
    { value: 'gaming', label: t('allAgents.gaming') },
    { value: 'watches', label: t('allAgents.luxuryWatches') },
  ];

  const locations = [
    { value: 'all', label: t('allAgents.allLocations') },
    { value: 'north-america', label: t('allAgents.northAmerica') },
    { value: 'europe', label: t('allAgents.europe') },
    { value: 'asia', label: t('allAgents.asia') },
  ];

  const sortOptions = [
    { value: 'rating', label: t('allAgents.highestRated') },
    { value: 'reviews', label: t('allAgents.mostReviews') },
    { value: 'orders', label: t('allAgents.mostOrders') },
    { value: 'response', label: t('allAgents.fastestResponse') },
    { value: 'success', label: t('allAgents.highestSuccessRate') },
  ];

  const filteredItems = useMemo(
    () =>
      items
        .filter((item) => {
          const matchesSearch =
            searchQuery === '' ||
            (item.name ?? '')
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (item.country ?? '')
              .toLowerCase()
              .includes(searchQuery.toLowerCase());

          const matchesLocation =
            selectedLocation === 'all' ||
            (selectedLocation === 'north-america' &&
              ((item.country ?? '').includes('NY') ||
                (item.country ?? '').includes('CA') ||
                (item.country ?? '').includes('WA'))) ||
            (selectedLocation === 'europe' &&
              ((item.country ?? '').includes('France') ||
                (item.country ?? '').includes('Switzerland'))) ||
            (selectedLocation === 'asia' &&
              ((item.country ?? '').includes('Korea') ||
                (item.country ?? '').includes('Japan')));
          return matchesSearch && matchesLocation;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'rating':
              return b.rating - a.rating;
            case 'reviews':
              return b.reviews - a.reviews;
            case 'orders':
              return (
                (b.completed_orders ?? 0) - (a.completed_orders ?? 0)
              );
            case 'response':
              return (
                a.response_time?.localeCompare(
                  b.response_time || ''
                ) || 0
              );
            case 'success':
              return b.success_rate - a.success_rate;
            default:
              return b.rating - a.rating;
          }
        }),
    [searchQuery, selectedSpecialty, selectedLocation, sortBy, items]
  );

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex-1 bg-background pb-[74px]">
      <div className="px-4 pt-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t('allAgents.searchPlaceholder')}
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 bg-input-background border-0 rounded-lg"
          />
        </div>
        {/* Filters */}
        <div className="flex max-w-full overflow-scroll">
          <Select
            value={selectedSpecialty}
            onValueChange={setSelectedSpecialty}
          >
            <SelectTrigger className="bg-input-background border-0">
              <SelectValue placeholder={t('allAgents.specialty')} />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem
                  key={specialty.value}
                  value={specialty.value}
                >
                  {specialty.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedLocation}
            onValueChange={setSelectedLocation}
          >
            <SelectTrigger className="bg-input-background border-0">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem
                  key={location.value}
                  value={location.value}
                >
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-input-background border-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Content */}
        <div className="px-4 py-6">
          {/* Results count and clear filters */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-sm">
              {filteredItems.length}{' '}
              {filteredItems.length === 1
                ? t('allAgents.agent')
                : t('allAgents.agents')}{' '}
              {t('allAgents.found')}
            </span>
            {(searchQuery ||
              selectedSpecialty !== 'all' ||
              selectedLocation !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSpecialty('all');
                  setSelectedLocation('all');
                }}
              >
                {t('allAgents.clearFilters')}
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <AgentCard key={index} loading />
                ))
              : filteredItems.map((item, index) => (
                  <AgentCard
                    key={item.id}
                    item={item}
                    index={index}
                  />
                ))}
          </div>
          {/* No results */}
          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {t('allAgents.noAgentsFound')}
              </h3>
              <p className="text-muted-foreground">
                {t('allAgents.tryAdjustingFilters')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
