// Translation helper for merging country translations

import { countryTranslations } from '../config/country-translations';

// Function to get country translations for a specific language
export function getCountryTranslationsForLanguage(language: string): Record<string, string> {
  return countryTranslations[language as keyof typeof countryTranslations] || countryTranslations.en;
}

// Add the missing auth translation
export const additionalTranslations = {
  en: {
    'auth.selectCountry': 'Select your country',
  },
  'zh-cn': {
    'auth.selectCountry': '选择您的国家',
  },
  'zh-tw': {
    'auth.selectCountry': '選擇您的國家',
  },
  ja: {
    'auth.selectCountry': '国を選択してください',
  },
  ko: {
    'auth.selectCountry': '국가를 선택하세요',
  }
};