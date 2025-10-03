// Main locales index - imports from language folders
import * as en from './en';
import * as ja from './ja';
import * as ko from './ko';
import * as zhCn from './zh-cn';
import * as zhTw from './zh-tw';

// Supported languages type
export type SupportedLanguage =
  | 'en'
  | 'zh-cn'
  | 'zh-tw'
  | 'ja'
  | 'ko';

// Main translations object organized by language
export const translations = {
  en: en,
  'zh-cn': zhCn,
  'zh-tw': zhTw,
  ja: ja,
  ko: ko,
};

// Export individual language modules for direct import
export { en, ja, ko, zhCn, zhTw };

// Helper function to get nested translation
export function getNestedTranslation(obj: any, path: string): string {
  return (
    path.split('.').reduce((current, key) => {
      return current && typeof current === 'object'
        ? current[key]
        : undefined;
    }, obj) || path
  );
}

// Main translation function
export function t(
  language: SupportedLanguage,
  key: string,
  params?: Record<string, any>
): string {
  const translation = getNestedTranslation(
    translations[language],
    key
  );

  if (!translation) {
    console.warn(
      `Translation missing for key: ${key} in language: ${language}`
    );
    return key;
  }

  // Handle parameter substitution
  if (params && typeof translation === 'string') {
    return Object.keys(params).reduce((result, param) => {
      const placeholder = `{${param}}`;
      return result.replace(
        new RegExp(
          placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'g'
        ),
        String(params[param])
      );
    }, translation);
  }

  return translation;
}
