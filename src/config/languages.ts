const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
  {
    code: 'zh-cn',
    name: 'Simplified Chinese',
    flag: '🇨🇳',
    native: '中国大陆',
  },
  {
    code: 'zh-tw',
    name: 'Traditional Chinese',
    flag: '🇹🇼',
    native: '台灣',
  },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', native: '日本' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', native: '대한민국' },
] as const;

export default languages;
