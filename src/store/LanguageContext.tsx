import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations-consolidated';

type Language = 'en' | 'zh-cn' | 'zh-tw' | 'ja' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Use the consolidated translations
const translationsData = translations;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
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
      console.error(`Translation object not found for language: ${language}`);
      return key;
    }
    
    let text = translation[key as keyof typeof translation] as string;
    
    if (!text) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }

    // Handle parameter substitution
    if (params) {
      Object.keys(params).forEach(param => {
        const placeholder = `{${param}}`;
        text = text.replace(new RegExp(placeholder, 'g'), String(params[param]));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}