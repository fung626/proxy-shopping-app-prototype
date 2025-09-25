import React, { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './command';
import { Badge } from './badge';
import { useLanguage } from '../../store/LanguageContext';

interface LanguageOption {
  value: string;
  label: string;
}

interface LanguageMultiSelectProps {
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxSelected?: number;
}

// List of common languages for international proxy shopping
const LANGUAGES: LanguageOption[] = [
  { value: 'en', label: 'English' },
  { value: 'zh-cn', label: '中文 (简体)' },
  { value: 'zh-tw', label: '中文 (繁體)' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'ru', label: 'Русский' },
  { value: 'ar', label: 'العربية' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'th', label: 'ไทย' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'ms', label: 'Bahasa Melayu' },
  { value: 'tl', label: 'Filipino' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'sv', label: 'Svenska' },
  { value: 'no', label: 'Norsk' },
  { value: 'da', label: 'Dansk' },
  { value: 'fi', label: 'Suomi' },
  { value: 'pl', label: 'Polski' },
  { value: 'cs', label: 'Čeština' },
  { value: 'hu', label: 'Magyar' },
  { value: 'ro', label: 'Română' },
  { value: 'bg', label: 'Български' },
  { value: 'hr', label: 'Hrvatski' },
  { value: 'sr', label: 'Српски' },
  { value: 'sk', label: 'Slovenčina' },
  { value: 'sl', label: 'Slovenščina' },
  { value: 'et', label: 'Eesti' },
  { value: 'lv', label: 'Latviešu' },
  { value: 'lt', label: 'Lietuvių' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'he', label: 'עברית' },
  { value: 'fa', label: 'فارسی' },
  { value: 'ur', label: 'اردو' },
  { value: 'bn', label: 'বাংলা' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'te', label: 'తెలుగు' },
  { value: 'ml', label: 'മലയാളം' },
  { value: 'kn', label: 'ಕನ್ನಡ' },
  { value: 'gu', label: 'ગુજરાતી' },
  { value: 'mr', label: 'मराठी' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ' },
  { value: 'ne', label: 'नेपाली' },
  { value: 'si', label: 'සිංහල' },
  { value: 'my', label: 'မြန်မာ' },
  { value: 'km', label: 'ខ្មែរ' },
  { value: 'lo', label: 'ລາວ' },
  { value: 'ka', label: 'ქართული' },
  { value: 'hy', label: 'Հայերեն' },
  { value: 'az', label: 'Azərbaycan' },
  { value: 'kk', label: 'Қазақ' },
  { value: 'ky', label: 'Кыргыз' },
  { value: 'uz', label: 'O\'zbek' },
  { value: 'mn', label: 'Монгол' },
  { value: 'bo', label: 'བོད་སྐད' },
  { value: 'ug', label: 'ئۇيغۇر' },
];

export function LanguageMultiSelect({ 
  value = [], 
  onValueChange, 
  placeholder, 
  className,
  disabled,
  maxSelected = 10
}: LanguageMultiSelectProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedValue: string) => {
    if (!onValueChange) return;
    
    const currentValue = value || [];
    let newValue: string[];
    
    if (currentValue.includes(selectedValue)) {
      // Remove if already selected
      newValue = currentValue.filter(v => v !== selectedValue);
    } else {
      // Add if not selected and under limit
      if (currentValue.length < maxSelected) {
        newValue = [...currentValue, selectedValue];
      } else {
        return; // Don't add if at max limit
      }
    }
    
    onValueChange(newValue);
  };

  const handleRemove = (valueToRemove: string) => {
    if (!onValueChange) return;
    const newValue = (value || []).filter(v => v !== valueToRemove);
    onValueChange(newValue);
  };

  const selectedLanguages = LANGUAGES.filter(lang => value?.includes(lang.value));
  const displayText = placeholder || t('auth.selectLanguages');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between bg-input-background border-border hover:bg-input-background ${className}`}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 flex-1 min-h-[20px]">
            {selectedLanguages.length === 0 ? (
              <span className="text-muted-foreground">{displayText}</span>
            ) : (
              selectedLanguages.map((language) => (
                <Badge
                  key={language.value}
                  variant="secondary"
                  className="text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center gap-1"
                >
                  {language.label}
                  <span
                    className="h-4 w-4 rounded-full hover:bg-secondary-foreground/20 flex items-center justify-center cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(language.value);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </span>
                </Badge>
              ))
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t('auth.searchLanguages')} />
          <CommandEmpty>{t('common.noResults')}</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {LANGUAGES.map((language) => {
              const isSelected = value?.includes(language.value);
              const isAtMaxLimit = value && value.length >= maxSelected && !isSelected;
              
              return (
                <CommandItem
                  key={language.value}
                  onSelect={() => handleSelect(language.value)}
                  className={`${isAtMaxLimit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={isAtMaxLimit}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                  />
                  {language.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
          {value && value.length > 0 && (
            <div className="p-2 border-t text-xs text-muted-foreground">
              {t('auth.selectedLanguagesCount', { count: value.length, max: maxSelected })}
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}