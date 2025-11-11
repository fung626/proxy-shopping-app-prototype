export interface Category {
  id: string;
  translationKey: string;
  icon: string; // Updated to use image paths
}

export const CATEGORIES: Category[] = [
  {
    id: 'beauty',
    translationKey: 'categories.beauty',
    icon: '/images/cosmetics.svg',
  },
  {
    id: 'tickets',
    translationKey: 'categories.tickets',
    icon: '/images/ticket.svg',
  },
  {
    id: 'home',
    translationKey: 'categories.home',
    icon: '/images/cost-of-living.svg',
  },
  {
    id: 'food',
    translationKey: 'categories.food',
    icon: '/images/restaurant.svg',
  },
  {
    id: 'electronics',
    translationKey: 'categories.electronics',
    icon: '/images/gadgets.svg',
  },
  {
    id: 'toys',
    translationKey: 'categories.toys',
    icon: '/images/toys.svg',
  },
  {
    id: 'stationery',
    translationKey: 'categories.stationery',
    icon: '/images/stationery.svg',
  },
  {
    id: 'fashion',
    translationKey: 'categories.fashion',
    icon: '/images/fashion.svg',
  },
  {
    id: 'sports',
    translationKey: 'categories.sports',
    icon: '/images/sport.svg',
  },
  {
    id: 'accessories',
    translationKey: 'categories.accessories',
    icon: '/images/accessories.svg',
  },
  {
    id: 'bags',
    translationKey: 'categories.bags',
    icon: '/images/bags.svg',
  },
  {
    id: 'automotive',
    translationKey: 'categories.automotive',
    icon: '/images/sedan.svg',
  },
  {
    id: 'others',
    translationKey: 'categories.others',
    icon: '/images/others.svg',
  },
];
