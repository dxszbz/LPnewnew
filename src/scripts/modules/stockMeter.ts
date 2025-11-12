import type { RuntimeConfig } from '../types';

const INITIAL_DROP_RATIO = 0.5;
const INITIAL_DROP_DURATION = 1000;
const MIN_BAR_PERCENT = 8;
const UPDATE_INTERVAL = 4500;

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

  const render = (value: number) => {
    const normalized = Math.max(minimum, Math.min(start, Math.round(value)));
    current = normalized;
    const percent = Math.max(MIN_BAR_PERCENT, Math.min(100, (normalized / start) * 100));
    stockEls.bar!.style.width = `${percent}%`;
    stockEls.counters.forEach((el) => {
      el.textContent = String(normalized);
    });
    setAlert(normalized);
  };

  const update = () => {
    const decay = Math.random() < 0.4 ? 2 : 1;
    render(Math.max(minimum, current - decay));
  };

  // 初始載入時先在 1 秒內平滑降至指定占比
  const animateInitialDrop = () =>
    new Promise<void>((resolve) => {
      const target = Math.max(minimum, Math.round(start * INITIAL_DROP_RATIO));
      if (target >= current) {
        render(target);
        resolve();
        return;
      }

      const startValue = current;
      const totalDrop = startValue - target;
      const initialTime = performance.now();

      const tick = (timestamp: number) => {
        const elapsed = timestamp - initialTime;
        const progress = Math.min(1, elapsed / INITIAL_DROP_DURATION);
        const nextValue = startValue - totalDrop * progress;
        render(nextValue);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(tick);
    });

  render(current);
  animateInitialDrop().then(() => {
    setInterval(update, UPDATE_INTERVAL);
  });
};
