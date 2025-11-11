import { CATEGORIES } from '@/config/categories';
import { useLanguage } from '@/store/LanguageContext';
import { getCategoryName } from '@/utils/categories';
import { useNavigate } from 'react-router-dom';

const PopularCategoriesSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2>{t('explore.popularCategories')}</h2>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-3 pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                navigate(`/explore/category/${category.id}`)
              }
              className="flex-shrink-0 p-3 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors text-center w-28 h-28"
            >
              <div className="w-16 h-16 rounded-lg mb-2 bg-primary/10 flex items-center justify-center mx-auto">
                <img
                  src={category.icon}
                  alt={getCategoryName(category.id, t)}
                  className="h-8 w-8 object-contain"
                />
              </div>
              <p className="font-medium text-xs leading-tight">
                {getCategoryName(category.id, t)}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategoriesSection;
