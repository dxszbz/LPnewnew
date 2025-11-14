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

export type RuntimeAnalytics = {
  pixels: {
    facebook: string[];
    tiktok: string[];
  };
};

export type RuntimeConfig = {
  product: RuntimeProduct;
  analytics: RuntimeAnalytics;
  checkout: {
    endpoint: string;
    wdp: string;
  };
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
};
