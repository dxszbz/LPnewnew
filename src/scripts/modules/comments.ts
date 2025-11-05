import { LAZY_MEDIA_PLACEHOLDER } from '../../utils/lazyMedia';
import type { RuntimeConfig } from '../types';

export type CommentsDependencies = {
  refreshLazyMedia: () => void;
  refreshIcons: () => void;
};

const renderComments = (
  container: HTMLElement,
  reviews: RuntimeConfig['comments']['reviews'],
  deps: CommentsDependencies
) => {
  container.innerHTML = '';
  const fragment = document.createDocumentFragment();
  reviews.forEach((comment) => {
    const article = document.createElement('article');
    article.className = 'rounded-3xl border border-white/5 bg-slate-950/70 p-5 shadow-lg shadow-black/30';
    article.innerHTML = `
      <header class="flex items-center gap-3">
        <img class="lazyload h-12 w-12 rounded-full border border-white/20 object-cover" src="${LAZY_MEDIA_PLACEHOLDER}" data-src="${comment.avatar}" alt="${comment.name}" />
        <div>
          <p class="text-sm font-semibold text-white">${comment.name}</p>
          <p class="text-xs text-white/40">${comment.timestamp}</p>
        </div>
        <div class="ml-auto flex gap-1">
          ${Array.from({ length: 5 })
            .map(
              (_, index) =>
                `<span data-lucide="star" class="h-4 w-4 ${
                  index < comment.stars ? 'text-warning-500 icon-solid' : 'text-white/20'
                }"></span>`
            )
            .join('')}
        </div>
      </header>
      <p class="mt-4 text-sm leading-relaxed text-white/80">${comment.content}</p>
      <footer class="mt-4 flex items-center justify-between text-xs text-white/40">
        <span>Verified buyer</span>
        <span>👍 ${Math.floor(Math.random() * 240) + 80}</span>
      </footer>
    `;
    fragment.appendChild(article);
  });
  container.appendChild(fragment);
  deps.refreshLazyMedia();
  deps.refreshIcons();
};

export const initComments = (config: RuntimeConfig['comments'], deps: CommentsDependencies) => {
  const container = document.querySelector<HTMLElement>('[data-comments-root]');
  const dotsContainer = document.querySelector<HTMLElement>('[data-comments-dots]');
  const prevButton = document.querySelector<HTMLButtonElement>('[data-comments-prev]');
  const nextButton = document.querySelector<HTMLButtonElement>('[data-comments-next]');
  if (!container || !dotsContainer || !prevButton || !nextButton) return;

  const totalPages = Math.ceil(config.reviews.length / config.perPage);
  if (!totalPages) return;

  let currentPage = 1;

  const update = (page: number) => {
    const startIndex = (page - 1) * config.perPage;
    const pageItems = config.reviews.slice(startIndex, startIndex + config.perPage);
    renderComments(container, pageItems, deps);
    currentPage = page;
    prevButton.disabled = page === 1;
    nextButton.disabled = page === totalPages;
    prevButton.setAttribute('aria-disabled', String(prevButton.disabled));
    nextButton.setAttribute('aria-disabled', String(nextButton.disabled));
    prevButton.classList.toggle('opacity-40', prevButton.disabled);
    nextButton.classList.toggle('opacity-40', nextButton.disabled);
    Array.from(dotsContainer.children).forEach((dot, index) => {
      dot.classList.toggle('bg-brand-500', index + 1 === page);
      dot.classList.toggle('bg-white/30', index + 1 !== page);
      dot.setAttribute('aria-current', index + 1 === page ? 'page' : 'false');
    });
  };

  dotsContainer.innerHTML = '';
  for (let page = 1; page <= totalPages; page += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'h-2 w-6 rounded-full bg-white/30 transition hover:bg-brand-500';
    dot.dataset.page = String(page);
    dot.setAttribute('aria-label', `Go to review page ${page}`);
    dot.addEventListener('click', () => update(page));
    dotsContainer.appendChild(dot);
  }

  prevButton.addEventListener('click', () => {
    if (currentPage > 1) update(currentPage - 1);
  });
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) update(currentPage + 1);
  });

  update(currentPage);
};
