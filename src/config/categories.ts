import { 
  Sparkles, 
  Home, 
  UtensilsCrossed, 
  Smartphone, 
  Gamepad2, 
  PenTool, 
  Shirt, 
  Dumbbell, 
  Watch, 
  ShoppingBag, 
  Car, 
  MoreHorizontal 
} from 'lucide-react';

export interface Category {
  id: string;
  translationKey: string;
  icon: any;
}

export const CATEGORIES: Category[] = [
  { id: 'beauty', translationKey: 'preferences.categories.beauty', icon: Sparkles },
  { id: 'home', translationKey: 'preferences.categories.home', icon: Home },
  { id: 'food', translationKey: 'preferences.categories.food', icon: UtensilsCrossed },
  { id: 'electronics', translationKey: 'preferences.categories.electronics', icon: Smartphone },
  { id: 'toys', translationKey: 'preferences.categories.toys', icon: Gamepad2 },
  { id: 'stationery', translationKey: 'preferences.categories.stationery', icon: PenTool },
  { id: 'fashion', translationKey: 'preferences.categories.fashion', icon: Shirt },
  { id: 'sports', translationKey: 'preferences.categories.sports', icon: Dumbbell },
  { id: 'accessories', translationKey: 'preferences.categories.accessories', icon: Watch },
  { id: 'bags', translationKey: 'preferences.categories.bags', icon: ShoppingBag },
  { id: 'automotive', translationKey: 'preferences.categories.automotive', icon: Car },
  { id: 'others', translationKey: 'preferences.categories.others', icon: MoreHorizontal }
];

// Helper function to get category by id
export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(category => category.id === id);
};

// Helper function to get all category ids
export const getAllCategoryIds = (): string[] => {
  return CATEGORIES.map(category => category.id);
};

// Helper function to get localized category name
export const getCategoryName = (categoryId: string, t: (key: string) => string): string => {
  const category = getCategoryById(categoryId);
  return category ? t(category.translationKey) : categoryId;
};