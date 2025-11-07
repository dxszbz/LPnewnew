import Swiper from 'swiper';
import { Autoplay, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

export const initHeroCarousel = () => {
  const mainContainer = document.querySelector<HTMLElement>('[data-hero-main]');
  const thumbsContainer = document.querySelector<HTMLElement>('[data-hero-thumbs]');
  if (!mainContainer || !thumbsContainer) return;

  const prevBtn = document.querySelector<HTMLButtonElement>('[data-hero-prev]');
  const nextBtn = document.querySelector<HTMLButtonElement>('[data-hero-next]');
  const slidesCount = mainContainer.querySelectorAll('.swiper-slide').length;
  if (!slidesCount) return;

  const hasMultipleSlides = slidesCount > 1;
  if (!hasMultipleSlides) {
    prevBtn?.classList.add('hidden');
    nextBtn?.classList.add('hidden');
  }

  const thumbsSwiper = new Swiper(thumbsContainer, {
    slidesPerView: Math.min(slidesCount, 4),
    spaceBetween: 16,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
    slidesOffsetBefore: 8,
    slidesOffsetAfter: 8,
    breakpoints: {
      768: {
        slidesPerView: Math.min(slidesCount, 5),
        slidesOffsetBefore: 12,
        slidesOffsetAfter: 12
      },
      1024: {
        slidesPerView: Math.min(slidesCount, 6),
        slidesOffsetBefore: 16,
        slidesOffsetAfter: 16
      }
    }
  });

  new Swiper(mainContainer, {
    modules: [Navigation, Thumbs, Autoplay],
    loop: hasMultipleSlides,
    speed: 600,
    navigation: {
      prevEl: prevBtn ?? undefined,
      nextEl: nextBtn ?? undefined
    },
    thumbs: {
      swiper: thumbsSwiper
    },
    autoplay: hasMultipleSlides
      ? {
          delay: 4500,
          disableOnInteraction: false
        }
      : false
  });
};
