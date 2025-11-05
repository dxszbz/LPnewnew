import type { RuntimeConfig } from '../types';

export const initStockMeter = (inventory: RuntimeConfig['inventory']) => {
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
