const CASEADS_PIXEL_URL = 'https://trk.caseads.com/p/I0zfi6gnS';

let pixelInjected = false;

const createPixel = () => {
  const img = new Image(1, 1);
  img.src = CASEADS_PIXEL_URL;
  img.alt = '';
  img.decoding = 'async';
  img.style.position = 'absolute';
  img.style.width = '1px';
  img.style.height = '1px';
  img.style.pointerEvents = 'none';
  img.style.opacity = '0';
  img.style.left = '-9999px';
  img.referrerPolicy = 'no-referrer-when-downgrade';
  return img;
};

const injectPixel = () => {
  if (pixelInjected) return;
  const body = document.body;
  if (!body) return;
  pixelInjected = true;
  body.appendChild(createPixel());
};

const scheduleAfterIdle = () => {
  if (pixelInjected) return;
  const run = () => {
    if (pixelInjected) return;
    injectPixel();
  };
  const idleCallback =
    (window as Window & { requestIdleCallback?: (cb: IdleRequestCallback) => number })
      .requestIdleCallback;
  if (idleCallback) {
    idleCallback(run);
  } else {
    window.setTimeout(run, 1200);
  }
};

/** 延遲掛載 CaseAds 像素，避免阻塞首屏渲染 */
export const initCaseAdsPixel = () => {
  if (typeof window === 'undefined') return;
  if (pixelInjected) return;

  const start = () => {
    if (pixelInjected) return;
    scheduleAfterIdle();
  };

  if (document.readyState === 'complete') {
    start();
    return;
  }

  window.addEventListener('load', start, { once: true });
};
