export const initSmoothScroll = () => {
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
