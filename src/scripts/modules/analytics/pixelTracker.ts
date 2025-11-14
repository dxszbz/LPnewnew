import type { RuntimeAnalytics, RuntimeProduct } from '../../types';

type PixelEventKey = 'pageView' | 'viewContent' | 'addToCart';

type PixelPayload = {
  content_ids: string[];
  content_name: string;
  currency: string;
  value: number;
};

type FacebookPixelFn = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: FacebookPixelFn;
  loaded?: boolean;
  version?: string;
};

type TikTokPixel = Array<unknown> & {
  methods?: string[];
  setAndDefer?: (obj: TikTokPixel, method: string) => void;
  instance?: (name: string) => TikTokPixel;
  load?: (pixelId: string, config?: Record<string, unknown>) => void;
  page?: (...args: unknown[]) => void;
  track?: (event: string, payload?: Record<string, unknown>) => void;
  _i?: Record<string, TikTokPixel>;
  _o?: unknown[];
  _t?: unknown[];
  _u?: string;
};

declare global {
  interface Window {
    fbq?: FacebookPixelFn;
    _fbq?: FacebookPixelFn;
    ttq?: TikTokPixel;
  }
}

const EVENT_NAME_MAP: Record<PixelEventKey, 'PageView' | 'ViewContent' | 'AddToCart'> = {
  pageView: 'PageView',
  viewContent: 'ViewContent',
  addToCart: 'AddToCart'
};

const triggeredEvents: Record<PixelEventKey, boolean> = {
  pageView: false,
  viewContent: false,
  addToCart: false
};

const resetTriggeredEvents = () => {
  (Object.keys(triggeredEvents) as PixelEventKey[]).forEach((key) => {
    triggeredEvents[key] = false;
  });
};

const buildPayload = (product: RuntimeProduct): PixelPayload => ({
  content_ids: [product.sku],
  content_name: product.name,
  currency: product.price.currency,
  value: product.price.current
});

const bootstrapFacebookPixel = (pixelIds: string[]) => {
  if (!pixelIds.length) return false;
  if (window.fbq) {
    pixelIds.forEach((id) => id && window.fbq?.('init', id));
    return true;
  }

  const fbq: FacebookPixelFn = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      (fbq.queue ?? (fbq.queue = [])).push(args);
    }
  } as FacebookPixelFn;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];

  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);

  pixelIds.forEach((id) => id && window.fbq?.('init', id));
  return true;
};

const bootstrapTikTokPixel = (pixelIds: string[]) => {
  if (!pixelIds.length) return false;
  if (!window.ttq) {
    const ttq: TikTokPixel = [];
    ttq.methods = [
      'page',
      'track',
      'identify',
      'instances',
      'debug',
      'on',
      'off',
      'once',
      'ready',
      'alias',
      'group',
      'enableCookie',
      'disableCookie'
    ];
    ttq.setAndDefer = (obj: TikTokPixel, method: string) => {
      obj[method] = function (...args: unknown[]) {
        obj.push([method, ...args]);
      };
    };
    ttq.methods.forEach((method) => {
      ttq.setAndDefer?.(ttq, method);
    });
    ttq._i = {};
    ttq._o = [];
    ttq._t = [];
    ttq.instance = (name: string) => {
      const subQueue = (ttq._i?.[name] as TikTokPixel | undefined) ?? ([] as TikTokPixel);
      ttq.methods?.forEach((method) => {
        ttq.setAndDefer?.(subQueue as TikTokPixel, method);
      });
      ttq._i = ttq._i || {};
      ttq._i[name] = subQueue;
      return subQueue;
    };
    ttq.load = (pixelId: string, config?: Record<string, unknown>) => {
      const source = 'https://analytics.tiktok.com/i18n/pixel/events.js';
      ttq._i = ttq._i || {};
      const instance = ttq.instance?.(pixelId) ?? ([] as TikTokPixel);
      instance._u = source;
      ttq._t = ttq._t || [];
      ttq._t.push([pixelId, config]);
      ttq._o = ttq._o || [];
      ttq._o.push([pixelId, config]);
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = `${source}?sdkid=${pixelId}&lib=ttq`;
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript?.parentNode?.insertBefore(script, firstScript);
    };
    window.ttq = ttq;
  }

  pixelIds.forEach((id) => id && window.ttq?.load?.(id));
  window.ttq?.page?.();
  return true;
};

const trackFacebookEvent = (eventName: 'PageView' | 'ViewContent' | 'AddToCart', payload: PixelPayload) => {
  if (!window.fbq) return;
  window.fbq('track', eventName, payload);
};

const trackTikTokEvent = (eventName: 'PageView' | 'ViewContent' | 'AddToCart', payload: PixelPayload) => {
  if (!window.ttq?.track) return;
  window.ttq.track(eventName, {
    content_id: payload.content_ids[0],
    content_name: payload.content_name,
    currency: payload.currency,
    value: payload.value
  });
};

const setupViewContentTriggers = (callback: () => void) => {
  let resolved = false;
  let timerId: number | null = null;

  const cleanup = () => {
    window.removeEventListener('scroll', onScroll, true);
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  };

  const trigger = () => {
    if (resolved) return;
    resolved = true;
    cleanup();
    callback();
  };

  const onScroll = () => {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop || 0;
    const viewportBottom = scrollTop + window.innerHeight;
    const docHeight = Math.max(doc.scrollHeight, document.body.scrollHeight);
    if (!docHeight) return;
    const progress = viewportBottom / docHeight;
    if (progress >= 0.5) {
      trigger();
    }
  };

  timerId = window.setTimeout(trigger, 30000);
  window.addEventListener('scroll', onScroll, { passive: true, capture: true });
  onScroll();
};

const setupAddToCartTriggers = (callback: () => void) => {
  if (typeof window === 'undefined') return;
  let resolved = false;
  const purchaseSection = document.getElementById('purchase');
  let fallbackListener: (() => void) | null = null;

  const trigger = () => {
    if (resolved) return;
    resolved = true;
    document.removeEventListener('click', handleClick, true);
    observer?.disconnect();
    if (fallbackListener) {
      window.removeEventListener('scroll', fallbackListener, true);
      fallbackListener = null;
    }
    callback();
  };

  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-checkout-trigger], .cta-scroll')) {
      trigger();
    }
  };

  let observer: IntersectionObserver | null = null;
  if (purchaseSection && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          trigger();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(purchaseSection);
  } else if (purchaseSection) {
    fallbackListener = () => {
      const rect = purchaseSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        trigger();
      }
    };
    window.addEventListener('scroll', fallbackListener, true);
  }

  document.addEventListener('click', handleClick, true);

  if (purchaseSection) {
    const rect = purchaseSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      trigger();
    }
  }
};

const firePixelEvent = (
  key: PixelEventKey,
  payload: PixelPayload,
  options: { facebookActive: boolean; tiktokActive: boolean }
) => {
  if (triggeredEvents[key]) return;
  triggeredEvents[key] = true;
  const eventName = EVENT_NAME_MAP[key];
  if (options.facebookActive) {
    trackFacebookEvent(eventName, payload);
  }
  if (options.tiktokActive) {
    trackTikTokEvent(eventName, payload);
  }
};

export const initPixelTracker = (analytics: RuntimeAnalytics | undefined, product: RuntimeProduct) => {
  if (!analytics) return;
  const facebookIds = Array.from(new Set((analytics.pixels.facebook ?? []).filter(Boolean)));
  const tiktokIds = Array.from(new Set((analytics.pixels.tiktok ?? []).filter(Boolean)));
  const facebookActive = bootstrapFacebookPixel(facebookIds);
  const tiktokActive = bootstrapTikTokPixel(tiktokIds);
  if (!facebookActive && !tiktokActive) return;

  resetTriggeredEvents();
  const payload = buildPayload(product);

  firePixelEvent('pageView', payload, { facebookActive, tiktokActive });

  setupViewContentTriggers(() => {
    firePixelEvent('viewContent', payload, { facebookActive, tiktokActive });
  });

  setupAddToCartTriggers(() => {
    firePixelEvent('addToCart', payload, { facebookActive, tiktokActive });
  });
};
