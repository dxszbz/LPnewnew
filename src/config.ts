// 全站共用設定：維護收銀端點、主題與語言清單
export const siteConfig = {
  checkout: {
    endpoint: 'https://novacoretech.org/',
    wdp: '1'
  },
  themes: ['system', 'day', 'night'] as const,
  locales: {
    default: 'en',
    supported: ['en', 'fr', 'de', 'es', 'it', 'nl'] as const
  },
  products: {
    defaultSku: 'adar-nordcharge'
  }
};

export type SupportedTheme = (typeof siteConfig.themes)[number];
export type SupportedLocale = (typeof siteConfig.locales.supported)[number];
