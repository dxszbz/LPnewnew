import type { RuntimeConfig } from '../types';

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

export const initCheckout = (config: RuntimeConfig) => {
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
    const endpoint = String(config.checkout.endpoint ?? '').replace(/\\/+$/, '');
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
