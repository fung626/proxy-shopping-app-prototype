const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', native: 'American' },
  {
    code: 'zh-cn',
    name: '簡体',
    flag: '🇨🇳',
    native: '中国大陆',
  },
  {
    code: 'zh-tw',
    name: '繁體',
    flag: '🇹🇼',
    native: '台灣',
  },
  { code: 'ja', name: '日本語', flag: '🇯🇵', native: '日本' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', native: '대한민국' },
] as const;

export default languages;
