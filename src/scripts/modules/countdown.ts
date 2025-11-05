export const initCountdown = (durationSeconds: number, alertEl: HTMLElement | null) => {
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
