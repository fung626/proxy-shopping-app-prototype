import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import languages from '@/config/languages';
import { useLanguage } from '@/store/LanguageContext';
import { Check, Globe } from 'lucide-react';
import { useState } from 'react';

function lc(value: string) {
  if (typeof value !== 'string') {
    return '';
  }
  if (value.length === 0) {
    return value;
  }
  return value[0].toLowerCase() + value.slice(1);
}

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(
    (lang) => lang.code === language
  );
  const displayName = currentLanguage?.name ?? '';

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-4 py-4 h-auto profile-row-button"
        >
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <Globe className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="font-normal">
              {t('profile.translation')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {displayName}
            </span>
            <svg
              className="h-5 w-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="text-left">
          <SheetTitle>{t('profile.selectLanguage')}</SheetTitle>
          <SheetDescription>
            {t('profile.languageDescription')}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-1">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant="ghost"
              className="w-full justify-between px-4 py-4 h-auto rounded-none"
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{lang.flag}</span>
                <div className="text-left">
                  <div className="font-medium">{lang.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {lang.native}
                  </div>
                </div>
              </div>
              {language === lang.code && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
