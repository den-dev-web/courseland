import { homeReviews } from "../data/courses.js";

function renderReviewStars(count = 5) {
  const safeCount = Number.isFinite(count) ? Math.round(count) : 5;
  const total = Math.max(0, Math.min(5, safeCount));
  return Array.from({ length: total })
    .map(
      () => `
        <svg class="c-review__star" viewBox="0 0 24 24">
          <path
            d="M12 3.6l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9 6.7 19.7l1-5.8-4.2-4.1 5.9-.9L12 3.6z"
            fill="currentColor"
          />
        </svg>
      `
    )
    .join("");
}

function renderReviews(track) {
  const items = homeReviews ?? [];
  if (!items.length) return false;

  track.innerHTML = items
    .map((review) => {
      const name = review.name ?? "";
      const role = review.role ?? "";
      const avatar = review.avatar ?? "";
      const alt = name || "Отзыв студента";
      const rating = review.rating ?? 5;

      return `
        <article class="c-review c-slider__item">
          <p>${review.text ?? ""}</p>
          <div class="c-review__rating" aria-hidden="true">
            ${renderReviewStars(rating)}
          </div>
          <div class="c-review__author">
            <img src="${avatar}" alt="${alt}" />
            <div>
              <strong>${name}</strong>
              <div>${role}</div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  return true;
}

export function initReviewsSlider() {
  const slider = document.querySelector("[data-reviews-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-track]");
  const prevBtn = slider.querySelector("[data-prev]");
  const nextBtn = slider.querySelector("[data-next]");

  if (!track || !prevBtn || !nextBtn) return;

  const hasReviews = renderReviews(track);
  if (!hasReviews) {
    slider.hidden = true;
    return;
  }

  const getPerView = () => {
    const value = getComputedStyle(slider).getPropertyValue("--per-view");
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  };

  const getGap = () => {
    const styles = getComputedStyle(track);
    return Number.parseFloat(styles.gap) || 0;
  };

  const getStep = () => {
    const firstItem = track.querySelector(".c-slider__item");
    if (!firstItem) return 0;
    return firstItem.getBoundingClientRect().width + getGap();
  };

  let index = 0;
  let currentTranslate = 0;
  let isPointerDown = false;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startTranslate = 0;
  let activePointerId = null;

  const getMaxIndex = () => {
    const items = [...track.children];
    const perView = getPerView();
    return Math.max(0, items.length - perView);
  };

  const getItemsCount = () => [...track.children].length;

  const normalizeIndex = () => {
    const maxIndex = getMaxIndex();
    if (maxIndex === 0) {
      index = 0;
      return;
    }

    if (index > maxIndex) {
      index = 0;
    } else if (index < 0) {
      index = maxIndex;
    }
  };

  const update = () => {
    const itemsCount = getItemsCount();
    const maxIndex = getMaxIndex();
    const step = getStep();

    normalizeIndex();
    currentTranslate = -index * step;
    track.style.transform = `translateX(${currentTranslate}px)`;

    const shouldDisable = itemsCount <= getPerView();
    prevBtn.disabled = shouldDisable;
    nextBtn.disabled = shouldDisable;
  };

  prevBtn.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    update();
  });

  nextBtn.addEventListener("click", () => {
    index += 1;
    update();
  });

  const onPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const step = getStep();
    if (!step) return;

    isPointerDown = true;
    isDragging = false;
    startX = event.clientX;
    startY = event.clientY;
    startTranslate = currentTranslate;
    activePointerId = event.pointerId;
    slider.classList.add("is-dragging");
    track.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isPointerDown || event.pointerId !== activePointerId) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (!isDragging) {
      if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        isPointerDown = false;
        slider.classList.remove("is-dragging");
        track.releasePointerCapture(event.pointerId);
        return;
      }
      isDragging = true;
    }

    event.preventDefault();
    track.style.transform = `translateX(${startTranslate + deltaX}px)`;
  };

  const onPointerUp = (event) => {
    if (event.pointerId !== activePointerId) return;
    track.releasePointerCapture(event.pointerId);
    slider.classList.remove("is-dragging");

    if (!isPointerDown) return;
    isPointerDown = false;

    if (!isDragging) return;

    const deltaX = event.clientX - startX;
    const step = getStep();
    if (!step) return;

    const rawIndex = -(startTranslate + deltaX) / step;
    index = Math.round(rawIndex);
    update();
  };

  track.addEventListener("pointerdown", onPointerDown);
  track.addEventListener("pointermove", onPointerMove, { passive: false });
  track.addEventListener("pointerup", onPointerUp);
  track.addEventListener("pointercancel", onPointerUp);

  window.addEventListener("resize", () => {
    update();
  });

  requestAnimationFrame(update);
}
