export interface ProductPrice {
  currency: string;
  current: number;
  original?: number;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export type CheckoutConfig =
  | {
      type: 'wordpress';
      domain: string;
    }
  | {
      type: 'direct';
      url: string;
    }
  | {
      type: 'shopyy';
      domain: string;
      productId: string | number;
      skuCode: string;
    };

export interface ProductData {
  sku: string;
  name: string;
  price: ProductPrice;
  mainImage: ProductImage;
  gallery: ProductImage[];
  checkout: CheckoutConfig;
  meta?: Record<string, unknown> | string;
}

export interface HeroTrustSignal {
  icon: string;
  text: string;
}

export interface HeroCTA {
  label: string;
  icon: string;
  banner: {
    icon: string;
    text: string;
  };
  note: string;
}

export interface HeroContent {
  badgeLines: string[];
  socialProof: {
    icon: string;
    text: string;
  };
  headline: string;
  description: string;
  highlights: string[];
  inventoryCard: {
    countdownLabel: string;
    stockLabel: string;
    stockUnit: string;
    stockAlert: string;
    trustSignals: HeroTrustSignal[];
  };
  cta: HeroCTA;
}

export interface GuaranteeContent {
  title: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  note: string;
}

export interface CommentEntry {
  name: string;
  timestamp: string;
  avatar: string;
  stars: number;
  content: string;
}

export interface CommentsContent {
  headline: string;
  description: string;
  activity: string;
  perPage: number;
  pagination: {
    previous: string;
    next: string;
  };
  activityMessages?: string[];
  reviews: CommentEntry[];
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface PurchaseAssurance {
  icon: string;
  text: string;
}

export interface PurchaseContent {
  title: string;
  subtitle: string;
  quantityLabel: string;
  ctaLabel: string;
  assurances: PurchaseAssurance[];
  note: string;
  mediaAlt: string;
}

export interface ExitIntentContent {
  enabled: boolean;
  badge?: string;
  title: string;
  description: string;
  highlight?: string;
  bullets?: string[];
  ctaLabel: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  dismissLabel: string;
  image?: ProductImage;
}

export interface FooterColumn {
  title: string;
  body?: string;
  items?: string[];
}

export interface FooterContent {
  columns: FooterColumn[];
  copyright?: string;
}

export interface ComponentPreset {
  layout?: string;
  topBar?: string;
  hero?: string;
  productDetails?: string;
  guarantee?: string;
  comments?: string;
  faq?: string;
  buySection?: string;
  mobileStickyFooter?: string;
  footer?: string;
  copyright?: string;
}

export interface ProductInfo {
  topBar: {
    icon: string;
    message: string;
    countdownLabel: string;
  };
  hero: HeroContent;
  countdown: {
    durationSeconds: number;
  };
  inventory: {
    start: number;
    minimum: number;
  };
  detailHtml: string;
  guarantee: GuaranteeContent;
  comments: CommentsContent;
  faq: FaqEntry[];
  purchase: PurchaseContent;
  exitIntent?: ExitIntentContent;
  stickyFooter: {
    headline: string;
    stockMessage: string;
    ctaLabel: string;
  };
  footer: FooterContent;
}

export interface LoadedProduct {
  data: ProductData;
  info: ProductInfo;
  components?: ComponentPreset;
}
