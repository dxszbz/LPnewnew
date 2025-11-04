/* eslint-disable no-console */
import { createIcons, icons } from 'lucide';
type RuntimeProduct = {
  sku: string;
  name: string;
  price: {
    currency: string;
    current: number;
    original?: number;
  };
  meta?: unknown;
};

type RuntimeConfig = {
  product: RuntimeProduct;
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

const getRuntimeConfig = (): RuntimeConfig | null => {
    const host = document.getElementById('landing-runtime') as HTMLScriptElement | null;
    if (!host?.textContent) return null;
    try {
      return JSON.parse(host.textContent) as RuntimeConfig;
    } catch (error) {
      console.error('無法解析 runtime JSON。', error);
      return null;
    }
};

const refreshIcons = () => {
  createIcons({ icons });
};

const initCountdown = (durationSeconds: number, alertEl: HTMLElement | null) => {
  let remaining = durationSeconds;
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-countdown]'));

  const formatTime = (secs: number) => {
    const minutes = String(Math.floor(secs / 60)).padStart(2, '0');
    const seconds = String(secs % 60).padStart(2, '0');
    return `${minutes}m ${seconds}s`;
  };

  const tick = () => {
    remaining = Math.max(0, remaining - 1);
    const formatted = formatTime(remaining);
    targets.forEach((el) => {
      el.textContent = formatted;
    });
    if (remaining === 0 && alertEl && !alertEl.textContent) {
      alertEl.textContent = 'We extended the deal for 2 grace minutes—finish checkout now.';
    }
  };

  tick();
  setInterval(tick, 1000);
};

const initStockMeter = (inventory: RuntimeConfig['inventory']) => {
  const stockEls = {
    bar: document.querySelector<HTMLElement>('[data-stock-bar]'),
    alert: document.querySelector<HTMLElement>('[data-stock-alert]'),
    counters: Array.from(document.querySelectorAll<HTMLElement>('[data-stock-text]'))
  };

  if (!stockEls.bar) return;

  const { start, minimum } = inventory;
  let current = start;

  const setAlert = (value: number) => {
    if (!stockEls.alert) return;
    if (value <= 20) {
      stockEls.alert.textContent = 'Under 20 bundles left. The buy-one-get-one bonus will disappear any moment.';
    } else if (value <= 35) {
      stockEls.alert.textContent = 'Inventory is thinning fast—many shoppers are already in queue.';
    } else {
      stockEls.alert.textContent = 'Hot demand: another order closes every 37 seconds.';
    }
  };

  const update = () => {
    const decay = Math.random() < 0.4 ? 2 : 1;
    current = Math.max(minimum, current - decay);
    const percent = Math.max(8, Math.min(100, (current / start) * 100));
    stockEls.bar!.style.width = `${percent}%`;
    stockEls.counters.forEach((el) => {
      el.textContent = String(current);
    });
    setAlert(current);
  };

  update();
  setInterval(update, 4500);
};

const initHeroCarousel = () => {
  const carousel = document.querySelector<HTMLElement>('[data-hero-carousel]');
  if (!carousel) return;

  const slides = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-slide]'));
  if (!slides.length) return;
  const dots = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-hero-dot]'));
  const prevBtn = document.querySelector<HTMLButtonElement>('[data-hero-prev]');
  const nextBtn = document.querySelector<HTMLButtonElement>('[data-hero-next]');

  let index = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  let pointerStart: number | null = null;

  const apply = () => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('opacity-100', i === index);
      slide.classList.toggle('z-10', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-brand-500', i === index);
      dot.classList.toggle('bg-white/30', i !== index);
      dot.setAttribute('aria-current', i === index ? 'page' : 'false');
    });
  };

  const go = (nextIndex: number) => {
    index = (nextIndex + slides.length) % slides.length;
    apply();
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const start = () => {
    if (slides.length <= 1) return;
    stop();
    timer = setInterval(() => go(index + 1), 4500);
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      stop();
      go(Number(dot.dataset.heroDot ?? 0));
      start();
    });
  });

  prevBtn?.addEventListener('click', () => {
    stop();
    go(index - 1);
    start();
  });
  nextBtn?.addEventListener('click', () => {
    stop();
    go(index + 1);
    start();
  });

  carousel.addEventListener('pointerdown', (event) => {
    pointerStart = event.clientX;
    stop();
  });
  carousel.addEventListener('pointerup', (event) => {
    if (pointerStart === null) return;
    const delta = event.clientX - pointerStart;
    if (Math.abs(delta) > 40) {
      go(index + (delta > 0 ? -1 : 1));
    }
    pointerStart = null;
    start();
  });
  carousel.addEventListener('pointerleave', () => {
    pointerStart = null;
    start();
  });
  carousel.addEventListener('pointercancel', () => {
    pointerStart = null;
    start();
  });

  apply();
  start();
};

const renderComments = (container: HTMLElement, reviews: RuntimeConfig['comments']['reviews']) => {
  container.innerHTML = '';
  const fragment = document.createDocumentFragment();
  reviews.forEach((comment) => {
    const article = document.createElement('article');
    article.className = 'rounded-3xl border border-white/5 bg-slate-950/70 p-5 shadow-lg shadow-black/30';
    article.innerHTML = `
      <header class="flex items-center gap-3">
        <img class="h-12 w-12 rounded-full border border-white/20 object-cover" src="${comment.avatar}" alt="${comment.name}" loading="lazy" />
        <div>
          <p class="text-sm font-semibold text-white">${comment.name}</p>
          <p class="text-xs text-white/40">${comment.timestamp}</p>
        </div>
        <div class="ml-auto flex gap-1">
          ${Array.from({ length: 5 })
            .map(
              (_, index) =>
                `<span data-lucide="star" class="h-4 w-4 ${
                  index < comment.stars ? 'text-warning-500 icon-solid' : 'text-white/20'
                }"></span>`
            )
            .join('')}
        </div>
      </header>
      <p class="mt-4 text-sm leading-relaxed text-white/80">${comment.content}</p>
      <footer class="mt-4 flex items-center justify-between text-xs text-white/40">
        <span>Verified buyer</span>
        <span>👍 ${Math.floor(Math.random() * 240) + 80}</span>
      </footer>
    `;
    fragment.appendChild(article);
  });
  container.appendChild(fragment);
  refreshIcons();
};

const initComments = (config: RuntimeConfig['comments']) => {
  const container = document.querySelector<HTMLElement>('[data-comments-root]');
  const dotsContainer = document.querySelector<HTMLElement>('[data-comments-dots]');
  const prevButton = document.querySelector<HTMLButtonElement>('[data-comments-prev]');
  const nextButton = document.querySelector<HTMLButtonElement>('[data-comments-next]');
  if (!container || !dotsContainer || !prevButton || !nextButton) return;

  const totalPages = Math.ceil(config.reviews.length / config.perPage);
  if (!totalPages) return;

  let currentPage = 1;

  const update = (page: number) => {
    const startIndex = (page - 1) * config.perPage;
    const pageItems = config.reviews.slice(startIndex, startIndex + config.perPage);
    renderComments(container, pageItems);
    currentPage = page;
    prevButton.disabled = page === 1;
    nextButton.disabled = page === totalPages;
    prevButton.setAttribute('aria-disabled', String(prevButton.disabled));
    nextButton.setAttribute('aria-disabled', String(nextButton.disabled));
    prevButton.classList.toggle('opacity-40', prevButton.disabled);
    nextButton.classList.toggle('opacity-40', nextButton.disabled);
    Array.from(dotsContainer.children).forEach((dot, index) => {
      dot.classList.toggle('bg-brand-500', index + 1 === page);
      dot.classList.toggle('bg-white/30', index + 1 !== page);
      dot.setAttribute('aria-current', index + 1 === page ? 'page' : 'false');
    });
  };

  dotsContainer.innerHTML = '';
  for (let page = 1; page <= totalPages; page += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'h-2 w-6 rounded-full bg-white/30 transition hover:bg-brand-500';
    dot.dataset.page = String(page);
    dot.setAttribute('aria-label', `Go to review page ${page}`);
    dot.addEventListener('click', () => update(page));
    dotsContainer.appendChild(dot);
  }

  prevButton.addEventListener('click', () => {
    if (currentPage > 1) update(currentPage - 1);
  });
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) update(currentPage + 1);
  });

  update(currentPage);
};

const initActivityTicker = (messages: string[] | undefined, defaultMessage: string) => {
  const activityEl = document.querySelector<HTMLElement>('[data-comments-activity]');
  if (!activityEl) return;
  const pool = messages && messages.length ? messages : [defaultMessage];
  let index = 0;
  activityEl.textContent = pool[index];
  if (pool.length <= 1) return;
  setInterval(() => {
    index = (index + 1) % pool.length;
    activityEl.textContent = pool[index];
  }, 6000);
};

const initStickyObserver = () => {
  const sticky = document.querySelector<HTMLElement>('[data-sticky-cta]');
  const purchaseSection = document.getElementById('purchase');
  if (!sticky || !purchaseSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        sticky.classList.toggle('hidden', entry.isIntersecting);
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(purchaseSection);
};

const initSmoothScroll = () => {
  document.querySelectorAll<HTMLAnchorElement>('.cta-scroll').forEach((el) => {
    el.addEventListener('click', (event) => {
      const targetId = el.getAttribute('href')?.replace('#', '') ?? 'purchase';
      const target = document.getElementById(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
};

const initQuantityStepper = () => {
  const qtyInput = document.getElementById('purchase-qty') as HTMLInputElement | null;
  const btnDec = document.getElementById('qty-dec');
  const btnInc = document.getElementById('qty-inc');
  if (!qtyInput || !btnDec || !btnInc) return;
  const clamp = (value: number) => Math.max(1, Math.min(99, value));
  btnDec.addEventListener('click', () => {
    qtyInput.value = String(clamp(parseInt(qtyInput.value || '1', 10) - 1));
  });
  btnInc.addEventListener('click', () => {
    qtyInput.value = String(clamp(parseInt(qtyInput.value || '1', 10) + 1));
  });
};

const encodeMeta = (meta: unknown): string | null => {
  const payload = typeof meta === 'string' ? meta : meta ? JSON.stringify(meta) : '';
  if (!payload) return '';
  try {
    const bytes = new TextEncoder().encode(payload);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    const base64 = window.btoa(binary);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (error) {
    console.error('meta 編碼失敗', error);
    return null;
  }
};

const initCheckout = (config: RuntimeConfig) => {
  const form = document.getElementById('purchase-form') as HTMLFormElement | null;
  if (!form) return;

  const button = form.querySelector<HTMLButtonElement>('[data-checkout-trigger]');
  const label = form.querySelector<HTMLElement>('[data-checkout-cta-text]');
  const icon = form.querySelector<HTMLElement>('[data-checkout-cta-icon]');
  const defaultLabel = label?.textContent ?? '';

  const setState = (state: 'idle' | 'loading') => {
    if (!button) return;
    const isLoading = state === 'loading';
    button.disabled = isLoading;
    button.classList.toggle('opacity-70', isLoading);
    button.classList.toggle('is-loading', isLoading);
    if (label) label.textContent = isLoading ? 'Creating order...' : defaultLabel;
    if (icon) icon.classList.toggle('hidden', isLoading);
  };

  const sanitizeQuantity = (value: string | null) => {
    const parsed = Number.parseInt(value ?? '1', 10);
    if (Number.isNaN(parsed) || parsed < 1) return '1';
    return String(Math.min(parsed, 99));
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const endpoint = String(config.checkout.endpoint ?? '').replace(/\\/+$, '');
    if (!endpoint) {
      alert('Checkout endpoint is not configured.');
      return;
    }
    const quantityInput = form.querySelector<HTMLInputElement>('#purchase-qty');
    const quantity = sanitizeQuantity(quantityInput?.value ?? '1');
    if (quantityInput) {
      quantityInput.value = quantity;
    }

    const encodedMeta = encodeMeta(config.product.meta);
    if (encodedMeta === null) {
      alert('Failed to encode product details. Please try again later.');
      return;
    }

    const params = new URLSearchParams({
      wdp: config.checkout.wdp,
      product_id: config.product.sku,
      product_name: config.product.name,
      price: String(config.product.price.current),
      quantity,
      meta: encodedMeta ?? '',
      currency: config.product.price.currency
    });

    setState('loading');
    const checkoutUrl = `${endpoint}/?${params.toString()}`;
    form.action = checkoutUrl;
    window.location.assign(checkoutUrl);
  });
};

const init = () => {
  const runtime = getRuntimeConfig();
  if (!runtime) return;

  refreshIcons();
  const alertEl = document.querySelector<HTMLElement>('[data-stock-alert]');
  initCountdown(runtime.countdown.durationSeconds, alertEl);
  initStockMeter(runtime.inventory);
  initHeroCarousel();
  initComments(runtime.comments);
  initActivityTicker(runtime.comments.activityMessages, runtime.comments.reviews[0]?.timestamp ?? '');
  initStickyObserver();
  initSmoothScroll();
  initQuantityStepper();
  initCheckout(runtime);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
