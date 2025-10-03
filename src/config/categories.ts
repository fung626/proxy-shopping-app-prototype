import {
  Car,
  Dumbbell,
  Gamepad2,
  Home,
  MoreHorizontal,
  PenTool,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  UtensilsCrossed,
  Watch,
} from 'lucide-react';

export interface Category {
  id: string;
  translationKey: string;
  icon: any;
}

export const CATEGORIES: Category[] = [
  {
    id: 'beauty',
    translationKey: 'categories.beauty',
    icon: Sparkles,
  },
  { id: 'home', translationKey: 'categories.home', icon: Home },
  {
    id: 'food',
    translationKey: 'categories.food',
    icon: UtensilsCrossed,
  },
  {
    id: 'electronics',
    translationKey: 'categories.electronics',
    icon: Smartphone,
  },
  { id: 'toys', translationKey: 'categories.toys', icon: Gamepad2 },
  {
    id: 'stationery',
    translationKey: 'categories.stationery',
    icon: PenTool,
  },
  {
    id: 'fashion',
    translationKey: 'categories.fashion',
    icon: Shirt,
  },
  {
    id: 'sports',
    translationKey: 'categories.sports',
    icon: Dumbbell,
  },
  {
    id: 'accessories',
    translationKey: 'categories.accessories',
    icon: Watch,
  },
  {
    id: 'bags',
    translationKey: 'categories.bags',
    icon: ShoppingBag,
  },
  {
    id: 'automotive',
    translationKey: 'categories.automotive',
    icon: Car,
  },
  {
    id: 'others',
    translationKey: 'categories.others',
    icon: MoreHorizontal,
  },
];
