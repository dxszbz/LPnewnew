/* eslint-disable no-console */
import { initLazyLoader, refreshLazyMedia } from './utils/lazyMedia';
import { refreshIcons } from './utils/icons';
import { getRuntimeConfig } from './utils/runtimeConfig';
import { initCountdown } from './modules/countdown';
import { initStockMeter } from './modules/stockMeter';
import { initHeroCarousel } from './modules/heroCarousel';
import { initComments } from './modules/comments';
import { initActivityTicker } from './modules/activityTicker';
import { initStickyObserver } from './modules/stickyObserver';
import { initSmoothScroll } from './modules/smoothScroll';
import { initQuantityStepper } from './modules/quantityStepper';
import { initCheckout } from './modules/checkout';
import { revealContent } from './modules/reveal';
import { initPixelTracker } from './modules/analytics/pixelTracker';
import { initExitIntent } from './modules/exitIntent';

const init = () => {
  const runtime = getRuntimeConfig();
  if (!runtime) return;

  initLazyLoader();
  refreshIcons();
  initPixelTracker(runtime.analytics, runtime.product);

  const alertEl = document.querySelector<HTMLElement>('[data-stock-alert]');
  initCountdown(runtime.countdown.durationSeconds, alertEl);
  initStockMeter(runtime.inventory);
  initHeroCarousel();
  initComments(runtime.comments, {
    refreshLazyMedia,
    refreshIcons
  });
  initActivityTicker(runtime.comments.activityMessages, runtime.comments.reviews[0]?.timestamp ?? '');
  initStickyObserver();
  initSmoothScroll();
  initQuantityStepper();
  if (!runtime.product.checkoutURL) {
    initCheckout(runtime);
  }
  initExitIntent(runtime.exitIntent);

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      revealContent();
    });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.addEventListener('load', () => {
  revealContent();
});
