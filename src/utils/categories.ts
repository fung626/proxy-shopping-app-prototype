import { CATEGORIES, Category } from '@/config/categories';

// Re-export CATEGORIES for backward compatibility
export { CATEGORIES };

// Helper function to get category by id
export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find((category) => category.id === id);
};

// Helper function to get all category ids
export const getAllCategoryIds = (): string[] => {
  return CATEGORIES.map((category) => category.id);
};

// Helper function to get localized category name
export const getCategoryName = (
  categoryId: string,
  t: (key: string) => string
): string => {
  const category = getCategoryById(categoryId);
  return category ? t(category.translationKey) : categoryId;
};
