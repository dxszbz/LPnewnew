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
  },
  // 分析與追蹤像素設定，可配置多組 Facebook / TikTok Pixel ID
  analytics: {
    pixels: {
      facebook: ['1475481086858162', '987654321000111'],
      tiktok: ['D4ABK4JC77U505N97D2G', 'TTPX1234XYZ5678','D4I1B8JC77UEBGICTMI0']
    }
  }
};

export type SupportedTheme = (typeof siteConfig.themes)[number];
export type SupportedLocale = (typeof siteConfig.locales.supported)[number];
