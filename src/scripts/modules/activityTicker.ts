export const initActivityTicker = (messages: string[] | undefined, defaultMessage: string) => {
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
