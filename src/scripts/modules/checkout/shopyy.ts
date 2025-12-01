import type { RuntimeConfig } from '../../types';

const sanitizeQuantity = (value: string | null) => {
  const parsed = Number.parseInt(value ?? '1', 10);
  if (Number.isNaN(parsed) || parsed < 1) return '1';
  return String(Math.min(parsed, 99));
};

export const initShopyyCheckout = (config: RuntimeConfig, form: HTMLFormElement) => {
  const checkout = config.checkout;
  if (checkout.type !== 'shopyy') return;

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

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const { domain, productId, skuCode } = checkout;
    const endpoint = config.api?.checkoutEndpoint?.trim();

    if (!endpoint || !domain || !productId || !skuCode) {
      alert('Checkout endpoint is not configured.');
      return;
    }

    const quantityInput = form.querySelector<HTMLInputElement>('#purchase-qty');
    const quantity = sanitizeQuantity(quantityInput?.value ?? '1');
    if (quantityInput) {
      quantityInput.value = quantity;
    }

    setState('loading');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider: 'shopyy',
          domain,
          productId,
          skuCode,
          quantity: Number.parseInt(quantity, 10),
          dataFrom: 'external_lander'
        })
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            code?: number;
            msg?: string;
            data?: { checkoutUrl?: string };
          }
        | null;

      const checkoutUrl = payload?.data?.checkoutUrl ?? '';
      if (!response.ok || payload?.code !== 0 || !checkoutUrl) {
        const message = payload?.msg ?? `Checkout failed with status ${response.status}`;
        throw new Error(message);
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      console.error('Shopyy checkout failed', error);
      alert('Failed to create order. Please try again.');
      setState('idle');
    }
  });
};
