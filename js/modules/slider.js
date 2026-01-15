import { courses } from "../data/courses.js";

export function initSlider() {
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-track]");
  const prevBtn = slider.querySelector("[data-prev]");
  const nextBtn = slider.querySelector("[data-next]");

  if (!track || !prevBtn || !nextBtn) return;

  const items = [...(courses ?? [])]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6);

  if (!items.length) {
    slider.hidden = true;
    return;
  }

  track.innerHTML = items
    .map((course) => {
      const image = course.image ?? {};
      const imageAlt = image.alt ?? course.title ?? "";
      const durationLabel = course.durationHours
        ? `⏱ ${course.durationHours} часов`
        : "";
      const ratingLabel = course.rating ? `⭐ ${course.rating}` : "";

      const picture =
        image.avif || image.webp
          ? `
          <picture>
            ${
              image.avif
                ? `<source type="image/avif" srcset="${image.avif}">`
                : ""
            }
            ${
              image.webp
                ? `<source type="image/webp" srcset="${image.webp}">`
                : ""
            }
            <img src="${
              image.jpg ?? ""
            }" alt="${imageAlt}" loading="lazy" decoding="async" />
          </picture>
        `
          : `<img src="${
              image.jpg ?? ""
            }" alt="${imageAlt}" loading="lazy" decoding="async" />`;

      return `
        <article class="c-slider__item">
          <a class="c-slider-card" href="course.html?slug=${course.id}">
            <div class="c-slider-card__media">
              ${picture}
            </div>
            <h3 class="c-slider-card__title">${course.title}</h3>
            <p class="c-slider-card__description">${course.description}</p>
            <div class="c-slider-card__meta">
              ${durationLabel ? `<span>${durationLabel}</span>` : ""}
              ${ratingLabel ? `<span>${ratingLabel}</span>` : ""}
            </div>
          </a>
        </article>
      `;
    })
    .join("");

  let index = 0;

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

  const update = () => {
    const perView = getPerView();
    const maxIndex = Math.max(0, items.length - perView);
    const step = getStep();

    index = Math.min(index, maxIndex);
    track.style.transform = `translateX(-${index * step}px)`;

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= maxIndex;
  };

  prevBtn.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    update();
  });

  nextBtn.addEventListener("click", () => {
    index += 1;
    update();
  });

  window.addEventListener("resize", () => {
    update();
  });

  requestAnimationFrame(update);
}
