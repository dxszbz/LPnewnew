export const initStickyObserver = () => {
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
