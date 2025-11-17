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
import { SupabaseUser } from '@/services/type';
import { userSupabaseService as service } from '@/services/userSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import {
  Award,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Search,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AllAgentsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [allAgents, setAllAgents] = useState<SupabaseUser[]>([]);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const agents = await service.getUsers();
        setAllAgents(agents);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    }

    fetchAgents();
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

  const filteredAgents = useMemo(
    () =>
      allAgents
        .filter((agent) => {
          const matchesSearch =
            searchQuery === '' ||
            (agent.name ?? '')
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (agent.country ?? '')
              .toLowerCase()
              .includes(searchQuery.toLowerCase());

          const matchesLocation =
            selectedLocation === 'all' ||
            (selectedLocation === 'north-america' &&
              ((agent.country ?? '').includes('NY') ||
                (agent.country ?? '').includes('CA') ||
                (agent.country ?? '').includes('WA'))) ||
            (selectedLocation === 'europe' &&
              ((agent.country ?? '').includes('France') ||
                (agent.country ?? '').includes('Switzerland'))) ||
            (selectedLocation === 'asia' &&
              ((agent.country ?? '').includes('Korea') ||
                (agent.country ?? '').includes('Japan')));
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
    [
      searchQuery,
      selectedSpecialty,
      selectedLocation,
      sortBy,
      allAgents,
    ]
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
        <div className="grid grid-cols-1 gap-3 mb-4">
          <div className="grid grid-cols-3 gap-2">
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
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          {/* Results count and clear filters */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-sm">
              {filteredAgents.length}{' '}
              {filteredAgents.length === 1
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
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="p-4 rounded-xl bg-card border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <ImageWithFallback
                        src={agent.image}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {agent.verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {agent.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {agent.bio || t('allAgents.agentBio')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">
                          {agent.rating}
                        </span>
                        <span className="text-muted-foreground">
                          ({agent.reviews})
                        </span>
                      </div>
                    </div>

                    {/* Badges */}
                    {agent.verified && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-1"
                        >
                          {t('allAgents.verifiedAgent')}
                        </Badge>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-muted-foreground">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{agent.country || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Package className="h-3 w-3" />
                          <span>
                            {agent.completed_orders ?? 0}{' '}
                            {t('allAgents.ordersCompleted')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-3 w-3" />
                          <span>
                            {agent.success_rate}%{' '}
                            {t('allAgents.successRate')}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {t('allAgents.responds')}{' '}
                            {agent.response_time || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Zap className="h-3 w-3" />
                          <span>
                            {t('allAgents.avgDelivery')}: {'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>
                            {t('allAgents.joined')}{' '}
                            {new Date(agent.since).getFullYear()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Languages */}
                    {agent.languages && (
                      <div className="text-xs text-muted-foreground mb-3">
                        <span className="font-medium">
                          {t('allAgents.languages')}:
                        </span>{' '}
                        {agent.languages.join(', ')}
                      </div>
                    )}

                    {/* Contact Button */}
                    <Button
                      className="w-full rounded-lg"
                      size="sm"
                      onClick={() =>
                        navigate(`/messages/agent/${agent.id}`)
                      }
                    >
                      {t('allAgents.contactAgent')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No results */}
          {filteredAgents.length === 0 && (
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
