export const revealContent = () => {
  const body = document.body;
  if (!body || !body.classList.contains('has-skeleton')) return;
  body.classList.remove('has-skeleton');
  body.setAttribute('data-skeleton-state', 'complete');
  const skeletonLayer = document.getElementById('global-skeleton');
  if (skeletonLayer) {
    skeletonLayer.style.opacity = '0';
    skeletonLayer.style.pointerEvents = 'none';
    window.setTimeout(() => {
      skeletonLayer.remove();
    }, 400);
  }
};
