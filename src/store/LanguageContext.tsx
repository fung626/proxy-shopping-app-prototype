import {
  getNestedTranslation,
  SupportedLanguage,
  translations,
} from '@/locales';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type Language = SupportedLanguage;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<
  LanguageContextType | undefined
>(undefined);

// Use the modular translations
const translationsData = translations;

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      'language'
    ) as Language;
    if (savedLanguage && translationsData[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, params?: Record<string, any>): string => {
    const translation = translationsData[language];

    if (!translation) {
      console.error(
        `Translation object not found for language: ${language}`
      );
      return key;
    }

    // Handle nested keys (e.g., 'nav.explore' or 'common.cancel')
    const text = getNestedTranslation(translation, key);

    if (!text || text === key) {
      console.warn(
        `Translation missing for key: ${key} in language: ${language}`
      );
      return key;
    }

    // Handle parameter substitution
    if (params && typeof text === 'string') {
      return Object.keys(params).reduce((result, param) => {
        const placeholder = `{${param}}`;
        return result.replace(
          new RegExp(
            placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            'g'
          ),
          String(params[param])
        );
      }, text);
    }

    return text;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error(
      'useLanguage must be used within a LanguageProvider'
    );
  }
  return context;
}
