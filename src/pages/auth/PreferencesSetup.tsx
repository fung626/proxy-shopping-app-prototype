import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useLanguage } from '../../store/LanguageContext';
import { CATEGORIES, getCategoryName } from '../../config/categories';

interface PreferencesSetupProps {
  onComplete: (preferences: { categories: string[] }) => void;
  onBack: () => void;
}

export function PreferencesSetup({ onComplete, onBack }: PreferencesSetupProps) {
  const { language, t } = useLanguage();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleComplete = () => {
    if (selectedCategories.length === 0) {
      alert(t('preferences.selectAtLeastOne'));
      return;
    }

    onComplete({
      categories: selectedCategories.map(id => 
        CATEGORIES.find(cat => cat.id === id)?.translationKey || id
      )
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 pt-12">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold ml-4">
          {t('preferences.title')}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 pb-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t('preferences.chooseInterests')}
            </h2>
            <p className="text-muted-foreground">
              {t('preferences.description')}
            </p>
          </div>

          {/* Category Selection */}
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-3">
                {t('preferences.productCategories')} ({selectedCategories.length} {t('preferences.selected')})
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((category) => {
                  const isSelected = selectedCategories.includes(category.id);
                  const IconComponent = category.icon;
                  
                  return (
                    <Button
                      key={category.id}
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => toggleCategory(category.id)}
                      className={`h-auto py-5 px-3 flex flex-col items-center justify-center text-center relative min-h-[120px] ${
                        isSelected ? 'bg-primary text-primary-foreground' : ''
                      }`}
                    >
                      {isSelected && (
                        <Check className="absolute top-2 right-2 h-4 w-4" />
                      )}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                        isSelected ? 'bg-primary-foreground/20' : 'bg-red-100'
                      }`}>
                        <IconComponent className={`h-6 w-6 ${
                          isSelected ? 'text-primary-foreground' : 'text-red-600'
                        }`} />
                      </div>
                      <div className="text-sm font-medium">
                        {getCategoryName(category.id, t)}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Selected Categories Preview */}
            {selectedCategories.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  {t('preferences.selectedCategories')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map(categoryId => {
                    return (
                      <Badge key={categoryId} variant="secondary">
                        {getCategoryName(categoryId, t)}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="mt-8">
            <Button
              onClick={handleComplete}
              className="w-full"
              disabled={selectedCategories.length === 0}
            >
              {t('preferences.completeSetup')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}