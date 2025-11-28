import type { ExitIntentContent } from '../utils/types';

export type RuntimeProduct = {
  sku: string;
  name: string;
  price: {
    currency: string;
    current: number;
    original?: number;
  };
  meta?: unknown;
};

export type RuntimeApi = {
  checkoutEndpoint: string;
};

export type RuntimeCheckout =
  | {
      type: 'direct';
      url: string;
    }
  | {
      type: 'wordpress';
      endpoint: string;
      wdp: string;
    }
  | {
      type: 'shopyy';
      domain: string;
      productId: string;
      skuCode: string;
    };

export type RuntimeAnalytics = {
  pixels: {
    facebook: string[];
    tiktok: string[];
  };
};

export type RuntimeConfig = {
  product: RuntimeProduct;
  analytics: RuntimeAnalytics;
  checkout: RuntimeCheckout;
  api: RuntimeApi;
  countdown: {
    durationSeconds: number;
  };
  inventory: {
    start: number;
    minimum: number;
  };
  comments: {
    reviews: Array<{
      name: string;
      timestamp: string;
      avatar: string;
      stars: number;
      content: string;
    }>;
    perPage: number;
    activityMessages?: string[];
  };
  exitIntent?: ExitIntentContent | null;
};
