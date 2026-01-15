import { courses } from "../data/courses.js";
import { initCatalogFilter } from "./catalogFilter.js";
/*import {
  trackCatalogView,
  trackFilterChange,
  trackCourseClick,
  trackEmptyResult,
  trackResetFilters,
} from "./modules/catalogAnalytics.js";*/
import { trackCatalogView, trackCourseClick } from "./catalogAnalytics.js";
import { applyCatalogSEO, applyCatalogSchema } from "./seoCatalog.js";

const grid = document.querySelector("[data-catalog-grid]");
const empty = document.querySelector("[data-catalog-empty]");
const loading = document.querySelector("[data-catalog-loading]");

const categoryLabels = {
  design: "Дизайн",
  dev: "Разработка",
  marketing: "Маркетинг",
  analytics: "Аналитика",
  management: "Менеджмент",
};

const levelLabels = {
  beginner: "Начальный",
  middle: "Средний",
  advanced: "Продвинутый",
};

function renderSkeletons(count = 6) {
  if (!loading) return;

  const grid = loading.querySelector(".c-catalog-grid");
  if (!grid || grid.children.length) return; // уже есть

  grid.innerHTML = Array.from({ length: count })
    .map(
      () => `
      <article class="c-course-card c-course-card--skeleton" aria-hidden="true">
        <div class="c-course-card__media">
          <div class="skeleton skeleton--media"></div>
        </div>

        <header class="c-course-card__header">
          <div class="skeleton skeleton--badge"></div>
          <div class="skeleton skeleton--level"></div>
        </header>

        <div class="c-course-card__body">
          <div class="skeleton skeleton--title"></div>
          <div class="skeleton skeleton--text"></div>
          <div class="skeleton skeleton--text short"></div>
        </div>

        <footer class="c-course-card__footer">
          <div class="skeleton skeleton--meta"></div>
          <div class="skeleton skeleton--price"></div>
        </footer>
      </article>
    `
    )
    .join("");
}

function renderCourses(items) {
  if (!grid) return;

  grid.innerHTML = items
    .map((course) => {
      const category = course.category ?? "design";
      const level = course.level ?? "beginner";
      const priceKey = course.price === 0 ? "free" : "paid";
      const priceLabel = course.price === 0 ? "Бесплатно" : `${course.price} ₴`;
      const image = course.image ?? {};
      const imageSrc = image.jpg ?? image.webp ?? image ?? "";
      const imageAlt = image.alt ?? course.title ?? "";
      const durationLabel = course.durationHours
        ? `⏱ ${course.durationHours} часов`
        : "";
      const ratingLabel = course.rating ? `⭐ ${course.rating}` : "";

      return `
        <article
          class="c-course-card"
          data-category="${category}"
          data-level="${level}"
          data-price="${priceKey}"
          data-duration-hours="${course.durationHours ?? ""}"
          data-rating="${course.rating ?? ""}"
        >
          <a
            href="course.html?slug=${course.id}"
            class="c-course-card__link"
            aria-label="Перейти к курсу ${course.title}"
          ></a>

          <div class="c-course-card__media">
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
              <img
                src="${imageSrc}"
                alt="${imageAlt}"
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>

          <header class="c-course-card__header">
            <span class="c-course-card__badge">
              ${categoryLabels[category] ?? "Другое"}
            </span>
            <span class="c-course-card__level">
              ${levelLabels[level] ?? "Любой"}
            </span>
          </header>

          <div class="c-course-card__body">
            <h3 class="c-course-card__title">${course.title}</h3>
            <p class="c-course-card__description">${course.description}</p>
          </div>

          <footer class="c-course-card__footer">
            <div class="c-course-card__meta">
              ${durationLabel ? `<span>${durationLabel}</span>` : ""}
              ${ratingLabel ? `<span>${ratingLabel}</span>` : ""}
            </div>
            <span class="c-course-card__price">${priceLabel}</span>
          </footer>
        </article>
      `;
    })
    .join("");
}

function setCatalogState(state) {
  loading.hidden = state !== "loading";
  grid.hidden = state !== "results";
  empty.hidden = state !== "empty";
}

function initCatalogCardClicks() {
  const grid = document.querySelector("[data-catalog-grid]");
  if (!grid) return;

  grid.addEventListener("click", (e) => {
    const link = e.target.closest(".c-course-card__link");
    if (!link) return;

    const card = link.closest(".c-course-card");
    if (!card) return;

    trackCourseClick({
      slug: new URL(link.href).searchParams.get("slug"),
      title: card.querySelector(".c-course-card__title")?.textContent,
      position: [...grid.children].indexOf(card) + 1,
    });
  });
}

function initCatalog() {
  const coursesData = courses ?? [];

  setCatalogState("loading");
  renderSkeletons(6);

  // имитация загрузки / fetch
  setTimeout(() => {
    renderCourses(coursesData);

    if (coursesData.length === 0) {
      setCatalogState("empty");
    } else {
      setCatalogState("results");
    }

    applyCatalogSEO();
    applyCatalogSchema(coursesData);

    initCatalogFilter({ setCatalogState });
    initCatalogCardClicks();
  }, 400);

  trackCatalogView();
}

export { initCatalog };
export default initCatalog;
