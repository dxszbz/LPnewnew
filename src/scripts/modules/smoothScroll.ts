export const initSmoothScroll = () => {
  document.querySelectorAll<HTMLAnchorElement>('.cta-scroll').forEach((el) => {
    el.addEventListener('click', (event) => {
      const targetId = el.getAttribute('href')?.replace('#', '') ?? 'purchase';
      const target = document.getElementById(targetId);
      if (target) {
        event.preventDefault();
        const alignToTarget = (behavior: ScrollBehavior = 'smooth') => {
          target.scrollIntoView({ behavior, block: 'start' });
        };

        alignToTarget('smooth');

        // 防止懒加载图片加载后产生布局位移，追加即时对齐校正
        const retryDelays = [160, 600];
        retryDelays.forEach((delay) => {
          window.setTimeout(() => alignToTarget('auto'), delay);
        });

        if (document.readyState !== 'complete') {
          window.addEventListener(
            'load',
            () => {
              alignToTarget('auto');
            },
            { once: true }
          );
        }
      }
    });
  });
};
