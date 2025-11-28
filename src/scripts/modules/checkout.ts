import type { RuntimeConfig } from '../types';
import { initWordpressCheckout } from './checkout/wordpress';
import { initShopyyCheckout } from './checkout/shopyy';

export const initCheckout = (config: RuntimeConfig) => {
  const form = document.getElementById('purchase-form') as HTMLFormElement | null;
  if (!form) return;

  if (config.checkout.type === 'wordpress') {
    initWordpressCheckout(config, form);
    return;
  }

  if (config.checkout.type === 'shopyy') {
    initShopyyCheckout(config, form);
  }
};
