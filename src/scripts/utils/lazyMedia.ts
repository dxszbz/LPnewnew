import LazyLoad from 'vanilla-lazyload';
import { LAZY_MEDIA_PLACEHOLDER } from '../../utils/lazyMedia';

let lazyLoader: InstanceType<typeof LazyLoad> | null = null;

export const prepareLazyMedia = () => {
  const images = Array.from(document.querySelectorAll<HTMLImageElement>('img:not([data-no-lazy])'));
  images.forEach((img) => {
    if (img.dataset.lazyPrepared === 'true') return;
    const dataSrc = img.getAttribute('data-src') ?? img.dataset.src ?? img.getAttribute('src');
    if (dataSrc && dataSrc !== LAZY_MEDIA_PLACEHOLDER) {
      img.setAttribute('data-src', dataSrc);
      const srcset = img.getAttribute('srcset');
      if (srcset) {
        img.setAttribute('data-srcset', srcset);
        img.removeAttribute('srcset');
      }
      if (img.getAttribute('src') !== LAZY_MEDIA_PLACEHOLDER) {
        img.setAttribute('src', LAZY_MEDIA_PLACEHOLDER);
      }
    }
    img.classList.add('lazyload');
    img.setAttribute('loading', 'lazy');
    img.dataset.lazyPrepared = 'true';
  });

  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video:not([data-no-lazy])'));
  videos.forEach((video) => {
    if (video.dataset.lazyPrepared === 'true') return;
    const poster = video.getAttribute('poster');
    if (poster) {
      video.setAttribute('data-poster', poster);
      video.removeAttribute('poster');
    }
    Array.from(video.querySelectorAll('source')).forEach((source) => {
      const sourceSrc = source.getAttribute('data-src') ?? source.getAttribute('src');
      if (!sourceSrc) return;
      source.setAttribute('data-src', sourceSrc);
      source.removeAttribute('src');
    });
    video.classList.add('lazyload');
    video.preload = 'none';
    video.dataset.lazyPrepared = 'true';
  });
};

export const refreshLazyMedia = () => {
  prepareLazyMedia();
  if (lazyLoader) {
    lazyLoader.update();
  }
};

export const initLazyLoader = () => {
  prepareLazyMedia();
  lazyLoader = new LazyLoad({
    elements_selector: '.lazyload',
    threshold: 300,
    data_src: 'src',
    data_srcset: 'srcset'
  });
  refreshLazyMedia();
  return lazyLoader;
};
