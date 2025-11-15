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
import {
  ArrowLeft,
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
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AllAgentsPageProps {}

export function AllAgentsPage({ onBack }: AllAgentsPageProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  // Extended agents data
  const allAgents = [
    {
      id: 'agent_sarah_johnson',
      name: 'Sarah Johnson',
      rating: 4.9,
      reviews: 156,
      specialty: 'Technology Shopping',
      serviceArea: 'New York, NJ, CT',
      completedOrders: 89,
      responseTime: '< 2 hours',
      verified: true,
      image:
        'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4NjE2NTgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      languages: ['English', 'Spanish'],
      badges: ['Top Rated', 'Fast Response'],
      joinDate: '2023-01-15',
      successRate: 98,
      averageDelivery: '3-5 days',
    },
    {
      id: 'agent_marie_dubois',
      name: 'Marie Dubois',
      rating: 4.7,
      reviews: 89,
      specialty: 'Fashion & Luxury',
      serviceArea: 'Paris, France & EU',
      completedOrders: 67,
      responseTime: '< 3 hours',
      verified: true,
      image:
        'https://images.unsplash.com/photo-1575404199108-c7417489517d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBwYXJpcyUyMGx1eHVyeXxlbnwxfHx8fDE3NTg3MDU2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      languages: ['French', 'English'],
      badges: ['Luxury Expert', 'Verified Agent'],
      joinDate: '2023-03-20',
      successRate: 96,
      averageDelivery: '7-10 days',
    },
    {
      id: 'agent_rio_mays',
      name: 'Rio Mays',
      rating: 4.8,
      reviews: 67,
      specialty: 'K-Beauty & Skincare',
      serviceArea: 'Seoul, South Korea',
      completedOrders: 45,
      responseTime: '< 1 hour',
      verified: true,
      image:
        'https://images.unsplash.com/photo-1686831451322-8d8e234a51e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBza2luY2FyZSUyMGJlYXV0eSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODcwNTYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      languages: ['Korean', 'English'],
      badges: ['K-Beauty Expert', 'Super Fast'],
      joinDate: '2023-05-10',
      successRate: 99,
      averageDelivery: '5-7 days',
    },
    {
      id: 'agent_ethan_oneill',
      name: "Ethan O'Neill",
      rating: 4.9,
      reviews: 123,
      specialty: 'Japanese Electronics & Tech',
      serviceArea: 'Tokyo, Japan',
      completedOrders: 78,
      responseTime: '< 2 hours',
      verified: true,
      image:
        'https://images.unsplash.com/photo-1584658645175-90788b3347b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGVsZWN0cm9uaWNzJTIwdGVjaCUyMGdhZGdldHN8ZW58MXx8fHwxNzU4NzA1NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      languages: ['Japanese', 'English'],
      badges: ['Tech Specialist', 'Top Rated'],
      joinDate: '2022-11-05',
      successRate: 97,
      averageDelivery: '3-5 days',
    },
    {
      id: 'agent_alex_thompson',
      name: 'Alex Thompson',
      rating: 4.6,
      reviews: 45,
      specialty: 'Streetwear & Urban Fashion',
      serviceArea: 'Los Angeles, CA',
      completedOrders: 32,
      responseTime: '< 4 hours',
      verified: true,
      image:
        'https://images.unsplash.com/flagged/photo-1564723150667-e0c8d8ea3246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwZmFzaGlvbiUyMGNsb3RoaW5nJTIwdXJiYW58ZW58MXx8fHwxNzU4NzA1NjI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      languages: ['English'],
      badges: ['Streetwear Expert'],
      joinDate: '2023-08-12',
      successRate: 94,
      averageDelivery: '2-4 days',
    },
    {
      id: 'agent_isabella_rossi',
      name: 'Isabella Rossi',
      rating: 4.8,
      reviews: 92,
      specialty: 'Swiss Luxury & Watches',
      serviceArea: 'Geneva, Switzerland',
      completedOrders: 56,
      responseTime: '< 3 hours',
      verified: true,
      image:
        'https://images.unsplash.com/photo-1598099947145-e85739e7ca28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTg2MTIyMDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      languages: ['Italian', 'French', 'English'],
      badges: ['Luxury Specialist', 'Verified Agent'],
      joinDate: '2022-12-03',
      successRate: 98,
      averageDelivery: '10-14 days',
    },
    {
      id: 'agent_david_chen',
      name: 'David Chen',
      rating: 4.7,
      reviews: 134,
      specialty: 'Home & Kitchen Appliances',
      serviceArea: 'New York, NY',
      completedOrders: 87,
      responseTime: '< 2 hours',
      verified: true,
      image:
        'https://images.unsplash.com/photo-1642979427252-13d5fd18bb61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwYXBwbGlhbmNlcyUyMG1vZGVybnxlbnwxfHx8fDE3NTg2MTg1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      languages: ['English', 'Mandarin'],
      badges: ['Home Expert', 'Fast Response'],
      joinDate: '2023-02-18',
      successRate: 96,
      averageDelivery: '5-7 days',
    },
    {
      id: 'agent_alex_johnson',
      name: 'Alex Johnson',
      rating: 4.6,
      reviews: 78,
      specialty: 'Gaming & Electronics',
      serviceArea: 'Seattle, WA',
      completedOrders: 54,
      responseTime: '< 3 hours',
      verified: true,
      image:
        'https://images.unsplash.com/photo-1715356434396-4a09652383b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBoZWFkcGhvbmVzJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzU4NzEwMzAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      languages: ['English'],
      badges: ['Gaming Expert'],
      joinDate: '2023-04-25',
      successRate: 95,
      averageDelivery: '3-5 days',
    },
  ];

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

  // Filter and sort agents with memoization for performance
  const filteredAgents = useMemo(
    () =>
      allAgents
        .filter((agent) => {
          const matchesSearch =
            searchQuery === '' ||
            agent.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            agent.specialty
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            agent.serviceArea
              .toLowerCase()
              .includes(searchQuery.toLowerCase());

          const matchesSpecialty =
            selectedSpecialty === 'all' ||
            agent.specialty
              .toLowerCase()
              .includes(selectedSpecialty.toLowerCase());

          const matchesLocation =
            selectedLocation === 'all' ||
            (selectedLocation === 'north-america' &&
              (agent.serviceArea.includes('NY') ||
                agent.serviceArea.includes('CA') ||
                agent.serviceArea.includes('WA'))) ||
            (selectedLocation === 'europe' &&
              (agent.serviceArea.includes('France') ||
                agent.serviceArea.includes('Switzerland'))) ||
            (selectedLocation === 'asia' &&
              (agent.serviceArea.includes('Korea') ||
                agent.serviceArea.includes('Japan')));

          return matchesSearch && matchesSpecialty && matchesLocation;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'rating':
              return b.rating - a.rating;
            case 'reviews':
              return b.reviews - a.reviews;
            case 'orders':
              return b.completedOrders - a.completedOrders;
            case 'response':
              return a.responseTime.localeCompare(b.responseTime);
            case 'success':
              return b.successRate - a.successRate;
            default:
              return b.rating - a.rating;
          }
        }),
    [searchQuery, selectedSpecialty, selectedLocation, sortBy]
  );

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(e.target.value);
  };

  // Error boundary wrapper for safe rendering
  try {
    return (
      <div className="flex-1 bg-background pb-[74px]">
        {/* Header */}
        <div className="bg-card px-4 pt-6 pb-4 border-b border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {t('allAgents.title')}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t('allAgents.subtitle')}
              </p>
            </div>
          </div>

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
                  <SelectValue
                    placeholder={t('allAgents.specialty')}
                  />
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
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                          {agent.specialty}
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
                    {agent.badges && agent.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {agent.badges.map((badge, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs px-2 py-1"
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-muted-foreground">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{agent.serviceArea}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Package className="h-3 w-3" />
                          <span>
                            {agent.completedOrders}{' '}
                            {t('allAgents.ordersCompleted')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-3 w-3" />
                          <span>
                            {agent.successRate}%{' '}
                            {t('allAgents.successRate')}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {t('allAgents.responds')}{' '}
                            {agent.responseTime}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Zap className="h-3 w-3" />
                          <span>
                            {t('allAgents.avgDelivery')}:{' '}
                            {agent.averageDelivery}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>
                            {t('allAgents.joined')}{' '}
                            {new Date(agent.joinDate).getFullYear()}
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
    );
  } catch (error) {
    console.error('Error rendering AllAgentsPage:', error);
    return (
      <div className="flex-1 bg-background pb-[74px] flex items-center justify-center">
        <div className="text-center p-4">
          <h2 className="text-lg font-medium mb-2">
            Something went wrong
          </h2>
          <p className="text-muted-foreground mb-4">
            Please try refreshing the page
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </div>
    );
  }
}
