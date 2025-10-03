# Language-Folder Translation System

This directory contains the translation system organized by language folders. Each language has its own directory with translations for all features/namespaces of the application.

## 📁 File Structure

```
src/locales/
├── index.ts                    # Main export file and translation utilities
├── en/                         # English translations
│   ├── index.ts               # English module exports
│   ├── nav.ts                 # Navigation translations
│   ├── common.ts              # Common/shared translations
│   ├── auth.ts                # Authentication related translations
│   ├── search.ts              # Search functionality translations
│   ├── categories.ts          # Product/service categories
│   ├── explore.ts             # Explore page translations
│   ├── messages.ts            # Chat/messaging translations
│   ├── profile.ts             # User profile translations
│   └── wishlist.ts            # Wishlist functionality translations
├── zh-cn/                     # Chinese Simplified translations
│   ├── index.ts               # Chinese Simplified module exports
│   ├── nav.ts                 # Navigation translations
│   ├── common.ts              # Common/shared translations
│   ├── auth.ts                # Authentication related translations
│   ├── search.ts              # Search functionality translations
│   ├── categories.ts          # Product/service categories
│   ├── explore.ts             # Explore page translations
│   ├── messages.ts            # Chat/messaging translations
│   ├── profile.ts             # User profile translations
│   └── wishlist.ts            # Wishlist functionality translations
├── zh-tw/                     # Chinese Traditional translations
│   └── ... (same structure as above)
├── ja/                        # Japanese translations
│   └── ... (same structure as above)
├── ko/                        # Korean translations
│   └── ... (same structure as above)
└── README.md                  # This documentation
```

## 🌍 Supported Languages

- **English** (`en`) - Default language
- **Chinese Simplified** (`zh-cn`)
- **Chinese Traditional** (`zh-tw`)
- **Japanese** (`ja`)
- **Korean** (`ko`)

## 🎯 Organization Structure

Each language folder contains feature-specific translation files that export a single object:

```typescript
// Example: en/nav.ts
export const nav = {
  explore: 'Explore',
  messages: 'Messages',
  profile: 'Profile',
  // ... more keys
};

// Example: zh-cn/nav.ts
export const nav = {
  explore: '探索',
  messages: '消息',
  profile: '资料',
  // ... more keys
};

// Each language folder also has an index.ts that exports all modules:
// en/index.ts
export { nav } from './nav';
export { common } from './common';
export { auth } from './auth';
// ... other exports
```

## 🚀 Usage

### Basic Usage with Translation Hook

```typescript
import { useLanguage } from '@/store/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t('nav.explore')}</h1>
      <p>{t('common.loading')}</p>
      <button>{t('auth.signIn')}</button>
    </div>
  );
}
```

### Direct Import (for specific languages or modules)

```typescript
// Import entire language
import { translations } from '../locales';
const englishTranslations = translations.en;
const chineseTranslations = translations['zh-cn'];

// Import specific language modules
import { nav, auth } from '../locales/en';
import { nav as zhNav } from '../locales/zh-cn';

// Import specific modules across languages
import { en, zhCn, ja } from '../locales';
const englishNav = en.nav;
const chineseNav = zhCn.nav;
const japaneseNav = ja.nav;
```

### Using Translation Function with Parameters

```typescript
const { t } = useLanguage();

// With parameters
const message = t('common.stepOf', { current: 2, total: 5 });
// Result: "Step 2 of 5"
```

## 🔧 Key Benefits

### ✅ **Better Organization**

- Translations organized by language first, then by functionality
- Each language is self-contained in its own folder
- Easy to find and maintain all translations for a specific language
- Clear separation between languages

### ✅ **Improved Performance**

- Can load only specific languages needed
- Language-specific code splitting opportunities
- Smaller bundle sizes with selective language imports
- Better tree shaking for unused languages

### ✅ **Developer Experience**

- Easy to add new languages by copying folder structure
- Simple to work with single-language translations
- Better collaboration - translators can focus on their language folder
- Consistent structure across all languages

### ✅ **Maintainability**

- Each language maintains its own complete translation set
- Easy to track translation completeness per language
- Simple to add/remove languages
- Consistent feature coverage across all languages

## 📝 Translation Key Naming Convention

Use dot notation to organize translations hierarchically:

```typescript
// Good examples
'nav.explore'; // Navigation: Explore
'auth.signIn'; // Authentication: Sign In
'common.cancel'; // Common: Cancel
'profile.editProfile'; // Profile: Edit Profile

// Avoid
'exploreButton'; // Not organized
'signin'; // Missing namespace
'CANCEL'; // Wrong case
```

## 🔄 Migration from Consolidated System

The new system is backward compatible. Your existing translation calls will continue to work:

```typescript
// Old way (still works)
const text = t('nav.explore');

// New way (same result)
const text = t('nav.explore');
```

The key difference is now the translations are organized by modules instead of being in one large file.

## 🆕 Adding New Translations

### 1. Adding to Existing Module

```typescript
// In locales/en/auth.ts
export const auth = {
  // ... existing keys
  newFeature: 'New Feature',
  anotherKey: 'Another Value',
};

// In locales/zh-cn/auth.ts
export const auth = {
  // ... existing keys
  newFeature: '新功能',
  anotherKey: '另一个值',
};

// Repeat for all other languages...
```

### 2. Creating New Module

Step 1: Create the new module file in each language folder:

```typescript
// Create locales/en/orders.ts
export const orders = {
  myOrders: 'My Orders',
  orderHistory: 'Order History',
  orderStatus: 'Order Status',
};

// Create locales/zh-cn/orders.ts
export const orders = {
  myOrders: '我的订单',
  orderHistory: '订单历史',
  orderStatus: '订单状态',
};

// Create similar files for zh-tw, ja, ko...
```

Step 2: Add exports to each language's index file:

```typescript
// In locales/en/index.ts
export { nav } from './nav';
export { common } from './common';
export { auth } from './auth';
export { orders } from './orders'; // Add this line
// ... other exports

// Repeat for all language index files...
```

### 3. Adding New Language

To add a new language (e.g., Spanish - 'es'):

1. Create new folder `locales/es/`
2. Copy all .ts files from an existing language folder (e.g., `en/`)
3. Translate all content in the new files
4. Add language export to main `index.ts`:

```typescript
// In locales/index.ts
import * as es from './es';

export const translations = {
  en: en,
  'zh-cn': zhCn,
  'zh-tw': zhTw,
  ja: ja,
  ko: ko,
  es: es, // Add new language
};

export { en, zhCn, zhTw, ja, ko, es };
```

## 🔍 Debugging Translations

Enable console warnings for missing translations:

```typescript
// Missing translations will log warnings like:
// "Translation missing for key: nav.newKey in language: zh-cn"
```

## 📊 Translation Coverage

To check translation completeness across languages:

```typescript
import { translations } from '../locales';

// Count translations per language
Object.keys(translations).forEach((lang) => {
  const flattenObject = (obj: any, prefix = ''): string[] => {
    return Object.keys(obj).reduce((acc: string[], key) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        return acc.concat(flattenObject(obj[key], newKey));
      }
      return acc.concat(newKey);
    }, []);
  };

  const keys = flattenObject(translations[lang]);
  console.log(`${lang}: ${keys.length} translations`);
});

// Check for missing translations
const compareLanguages = (baseLang: string, targetLang: string) => {
  const baseKeys = new Set(flattenObject(translations[baseLang]));
  const targetKeys = new Set(flattenObject(translations[targetLang]));

  const missing = [...baseKeys].filter((key) => !targetKeys.has(key));
  const extra = [...targetKeys].filter((key) => !baseKeys.has(key));

  console.log(`Missing in ${targetLang}:`, missing);
  console.log(`Extra in ${targetLang}:`, extra);
};

// Compare all languages to English (base)
['zh-cn', 'zh-tw', 'ja', 'ko'].forEach((lang) => {
  compareLanguages('en', lang);
});
```

## 🤝 Contributing

When adding new translations:

1. **Add to all supported languages** - Ensure every new key has translations in all 5 language folders
2. **Use consistent naming** - Follow the dot notation convention for nested keys
3. **Group logically** - Add related translations to the appropriate module file
4. **Maintain structure** - Keep the same file structure across all language folders
5. **Update exports** - Add new modules to each language's index.ts file
6. **Test thoroughly** - Verify translations display correctly in all languages
7. **Update documentation** - Add new modules or significant changes to this README

### Translation Workflow:

1. Add new keys to `en/` folder first (base language)
2. Copy the same keys to all other language folders
3. Translate the values (keep keys identical across languages)
4. Update index.ts files in each language folder if needed
5. Test with language switching functionality

## 🔧 Development Tips

### Hot Reloading

Changes to translation files will trigger hot reloading in development mode.

### Type Safety

The system provides TypeScript support for better development experience:

```typescript
import type { SupportedLanguage } from '../locales';

const lang: SupportedLanguage = 'en'; // Type-safe
```

### Performance

- Import only specific languages needed for better tree shaking
- Consider lazy loading language folders for large applications
- Load languages on-demand based on user preference
- Use dynamic imports for language switching:

```typescript
// Dynamic language loading
const loadLanguage = async (lang: string) => {
  const module = await import(`../locales/${lang}`);
  return module;
};
```

### Language-Specific Features

- Each language folder is independent and complete
- Easy to maintain language-specific formatting or cultural adaptations
- Simple to add region-specific variations (e.g., en-US, en-GB)
- Consistent structure makes automated translation tools easier to implement

---

This language-folder system provides better organization for multilingual applications, easier maintenance per language, and improved collaboration between translators while maintaining excellent developer experience and performance characteristics.
