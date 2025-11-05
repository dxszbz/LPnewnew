export const initHeroCarousel = () => {
  const carousel = document.querySelector<HTMLElement>('[data-hero-carousel]');
  if (!carousel) return;

  const slides = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-slide]'));
  if (!slides.length) return;
  const dots = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-hero-dot]'));
  const prevBtn = document.querySelector<HTMLButtonElement>('[data-hero-prev]');
  const nextBtn = document.querySelector<HTMLButtonElement>('[data-hero-next]');

  let index = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  let pointerStart: number | null = null;

  const apply = () => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('opacity-100', i === index);
      slide.classList.toggle('z-10', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-brand-500', i === index);
      dot.classList.toggle('bg-white/30', i !== index);
      dot.setAttribute('aria-current', i === index ? 'page' : 'false');
    });
  };

  const go = (nextIndex: number) => {
    index = (nextIndex + slides.length) % slides.length;
    apply();
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const start = () => {
    if (slides.length <= 1) return;
    stop();
    timer = setInterval(() => go(index + 1), 4500);
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      stop();
      go(Number(dot.dataset.heroDot ?? 0));
      start();
    });
  });

  prevBtn?.addEventListener('click', () => {
    stop();
    go(index - 1);
    start();
  });
  nextBtn?.addEventListener('click', () => {
    stop();
    go(index + 1);
    start();
  });

  carousel.addEventListener('pointerdown', (event) => {
    pointerStart = event.clientX;
    stop();
  });
  carousel.addEventListener('pointerup', (event) => {
    if (pointerStart === null) return;
    const delta = event.clientX - pointerStart;
    if (Math.abs(delta) > 40) {
      go(index + (delta > 0 ? -1 : 1));
    }
    pointerStart = null;
    start();
  });
  carousel.addEventListener('pointerleave', () => {
    pointerStart = null;
    start();
  });
  carousel.addEventListener('pointercancel', () => {
    pointerStart = null;
    start();
  });

  apply();
  start();
};
