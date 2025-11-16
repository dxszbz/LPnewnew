import type { RuntimeConfig } from '../types';

type ExitIntentConfig = RuntimeConfig['exitIntent'];

const prefersFinePointer = () => window.matchMedia('(pointer: fine)').matches;
const prefersCoarsePointer = () =>
  window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

const DEFAULT_SETTINGS = {
  desktopDelayMs: 400,
  idleSeconds: 20,
  mobileScrollVelocity: 55,
  mobileTopBoundary: 140
};

export const initExitIntent = (config: ExitIntentConfig) => {
  if (!config?.enabled) return;

  const root = document.querySelector<HTMLElement>('[data-exit-intent-root]');
  const dialog = root?.querySelector<HTMLElement>('[data-exit-dialog]');
  if (!root || !dialog) return;

  const primaryAction = root.querySelector<HTMLElement>('[data-exit-primary]');
  const dismissTriggers = root.querySelectorAll<HTMLElement>('[data-exit-dismiss]');
  const primaryButton = root.querySelector<HTMLElement>('[data-exit-primary]');
  const settings = { ...DEFAULT_SETTINGS };

  let hasOpened = false;
  let dismissed = false;
  let idleTimer: number | null = null;
  let lastFocused: HTMLElement | null = null;
  let lastScrollY = window.scrollY;
  const triggerCleanups: Array<() => void> = [];
  let keydownCleanup: (() => void) | null = null;

  const addTriggerListener = <K extends keyof DocumentEventMap>(
    target: Document | Window,
    type: K,
    listener: (event: DocumentEventMap[K]) => void,
    options?: AddEventListenerOptions
  ) => {
    target.addEventListener(type, listener as EventListener, options);
    triggerCleanups.push(() => target.removeEventListener(type, listener as EventListener, options));
  };

  const removeDetectionListeners = () => {
    triggerCleanups.splice(0).forEach((dispose) => dispose());
    if (idleTimer) {
      window.clearTimeout(idleTimer);
      idleTimer = null;
    }
  };

  const releaseModalControls = () => {
    if (keydownCleanup) {
      keydownCleanup();
      keydownCleanup = null;
    }
  };

  const openModal = () => {
    if (hasOpened || dismissed) return;
    hasOpened = true;
    lastFocused = document.activeElement as HTMLElement | null;
    root.classList.remove('hidden', 'pointer-events-none');
    root.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('exit-intent-open');
    document.body.classList.add('overflow-hidden');
    window.requestAnimationFrame(() => {
      (primaryAction ?? dialog).focus?.();
    });
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    keydownCleanup = () => document.removeEventListener('keydown', handleKeydown);
  };

  const closeModal = () => {
    if (!hasOpened) {
      dismissed = true;
      removeDetectionListeners();
      return;
    }
    root.classList.add('pointer-events-none', 'hidden');
    root.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('exit-intent-open');
    document.body.classList.remove('overflow-hidden');
    dismissed = true;
    dialog.blur?.();
    const focusTarget = lastFocused ?? document.querySelector<HTMLElement>('#purchase');
    focusTarget?.focus?.();
    releaseModalControls();
    removeDetectionListeners();
  };

  const scheduleOpen = () => {
    if (hasOpened || dismissed) return;
    removeDetectionListeners();
    if (settings.desktopDelayMs > 0) {
      window.setTimeout(openModal, settings.desktopDelayMs);
    } else {
      openModal();
    }
  };

  const handleMouseLeave = (event: MouseEvent) => {
    if (!prefersFinePointer()) return;
    if (event.relatedTarget === null && event.clientY <= 0) {
      scheduleOpen();
    }
  };

  const handleWindowBlur = () => {
    if (!document.hasFocus()) {
      scheduleOpen();
    }
  };

  const handleScroll = () => {
    if (!prefersCoarsePointer()) return;
    const current = window.scrollY;
    const delta = lastScrollY - current;
    if (delta > settings.mobileScrollVelocity && current <= settings.mobileTopBoundary) {
      scheduleOpen();
    }
    lastScrollY = current;
  };

  const resetIdleTimer = () => {
    if (!settings.idleSeconds) return;
    if (idleTimer) {
      window.clearTimeout(idleTimer);
    }
    idleTimer = window.setTimeout(() => {
      scheduleOpen();
    }, settings.idleSeconds * 1000);
  };

  if (settings.idleSeconds > 0) {
    const activityHandler = () => resetIdleTimer();
    const idleEvents: Array<{ type: keyof DocumentEventMap; passive?: boolean }> = [
      { type: 'mousemove' },
      { type: 'keydown' },
      { type: 'scroll', passive: true },
      { type: 'touchstart', passive: true }
    ];
    idleEvents.forEach(({ type, passive }) => {
      const options = passive ? { passive: true } : undefined;
      document.addEventListener(type, activityHandler as EventListener, options);
      triggerCleanups.push(() =>
        document.removeEventListener(type, activityHandler as EventListener, options)
      );
    });
    resetIdleTimer();
  }

  addTriggerListener(document, 'mouseout', handleMouseLeave);
  addTriggerListener(window, 'blur', handleWindowBlur);
  addTriggerListener(window, 'scroll', handleScroll, { passive: true });

  dismissTriggers.forEach((element) => {
    element.addEventListener('click', () => {
      closeModal();
    });
  });

  if (primaryButton) {
    primaryButton.addEventListener('click', () => {
      closeModal();
    });
  }

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
};
