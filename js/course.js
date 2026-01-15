import { initMenu } from "./modules/menu.js";
import { initTheme } from "./modules/theme.js";
import { COURSES } from "./data/courses.js";
import { initReviewsSlider } from "./modules/reviewsSlider.js";
import {
  initCourseBreadcrumbs,
  applyBreadcrumbsSchema,
} from "./modules/breadcrumbs.js";
import { applyCourseSEO } from "./modules/seoCourse.js";
import { track } from "./modules/analytics.js";

initMenu();
initTheme();
const yearNode = document.querySelector("[data-year]");
if (yearNode) yearNode.textContent = new Date().getFullYear();

const courseRoot = document.querySelector("[data-course]");
let currentSlug = null;
let currentCourse = null;

if (!courseRoot) {
  console.error("❌ [data-course] not found");
} else {
  initCourse();
}

function initCourse() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug || !COURSES[slug]) {
    showCourseError();
    return;
  }

  currentSlug = slug;
  loadCourse(slug);
}

function loadCourse(slug) {
  const data = COURSES[slug];
  if (!slug || !COURSES[slug]) {
    showCourseError();
    return;
  }
  currentCourse = data;
  setTimeout(() => {
    const priceLabel = data.price === 0 ? "Бесплатно" : `${data.price} ₴`;
    const categoryLabel = data.categoryLabel ?? data.category ?? "";
    const durationLabel = data.durationHours
      ? `⏱ ${data.durationHours} часов`
      : "";
    const ratingLabel = data.rating ? `⭐ ${data.rating}` : "";
    const studentsLabel = data.students ? `👥 ${data.students}` : "";
    const imageSrc = data.image?.jpg ?? data.image?.webp ?? data.image ?? "";

    setText("[data-course-title]", data.title);
    setText("[data-course-category]", categoryLabel);
    setText("[data-course-lead]", data.description);
    setText("[data-course-duration]", durationLabel);
    setText("[data-course-rating]", ratingLabel);
    setText("[data-course-students]", studentsLabel);
    setText("[data-course-price]", priceLabel);
    setText("[data-course-about]", data.about);

    const img = document.querySelector("[data-course-image]");
    const sourceAvif = document.querySelector("[data-course-image-avif]");
    const sourceWebp = document.querySelector("[data-course-image-webp]");
    if (img) {
      img.src = imageSrc;
      img.alt = data.title;
    }
    if (sourceAvif && data.image?.avif) {
      sourceAvif.srcset = data.image.avif;
    }
    if (sourceWebp && data.image?.webp) {
      sourceWebp.srcset = data.image.webp;
    }

    const program = document.querySelector("[data-course-program]");
    const programSection = program?.closest("section");
    if (program && Array.isArray(data.program) && data.program.length) {
      program.innerHTML = data.program
        .map((item, index) => {
          const title = typeof item === "string" ? item : item.title;
          const description =
            typeof item === "string"
              ? "Подробности в уроке."
              : item.description;
          const id = `program-${index + 1}`;

          return `
            <div class="c-faq__item">
              <button
                class="c-faq__trigger"
                aria-expanded="false"
                aria-controls="${id}"
                data-controls="${id}"
              >
                ${index + 1}. ${title}
              </button>
              <div class="c-faq__panel" id="${id}" hidden>
                <p>${description}</p>
              </div>
            </div>
          `;
        })
        .join("");

      program.querySelectorAll(".c-faq__trigger").forEach((btn) => {
        btn.addEventListener("click", () => {
          const expanded = btn.getAttribute("aria-expanded") === "true";
          btn.setAttribute("aria-expanded", String(!expanded));
          const panel = document.getElementById(btn.dataset.controls);
          if (panel) panel.hidden = expanded;
        });
      });
    } else if (programSection) {
      programSection.hidden = true;
    }

    const author = data.author ?? null;
    const authorRoot = document.querySelector("[data-course-author]");
    if (authorRoot && author) {
      const avatar = authorRoot.querySelector("[data-course-author-avatar]");
      const name = authorRoot.querySelector("[data-course-author-name]");
      const bio = authorRoot.querySelector("[data-course-author-bio]");

      if (avatar) {
        avatar.src = author.avatar ?? "";
        avatar.alt = author.name ?? "";
      }
      if (name) name.textContent = author.name ?? "";
      if (bio) bio.textContent = author.bio ?? "";
    } else if (authorRoot) {
      authorRoot.hidden = true;
    }

    const reviewsRoot = document.querySelector("[data-course-reviews]");
    const reviewsSection = reviewsRoot?.closest(".c-course-reviews");
    if (reviewsRoot && Array.isArray(data.reviews) && data.reviews.length) {
      reviewsRoot.innerHTML = data.reviews
        .map((review) => {
          const ratingValue = Number(review.rating ?? 0);
          const stars = ratingValue ? renderStars(ratingValue) : "";
          const roleLabel = review.role ?? "Студент курса";
          const avatar = review.avatar ?? "";
          const name = review.name ?? "";
          return `
            <article class="c-review c-slider__item">
              <p>${review.text}</p>
              ${
                ratingValue
                  ? `
                    <div class="c-review__rating" aria-label="Рейтинг ${ratingValue}">
                      ${stars}
                    </div>
                  `
                  : ""
              }
              <div class="c-review__author">
                ${
                  avatar
                    ? `
                      <img
                        src="${avatar}"
                        alt="${name}"
                        loading="lazy"
                        decoding="async"
                      />
                    `
                    : ""
                }
                <div>
                  <strong>${name}</strong>
                  <div>${roleLabel}</div>
                </div>
              </div>
            </article>
          `;
        })
        .join("");
    } else if (reviewsSection) {
      reviewsSection.hidden = true;
    }

    initReviewsSlider();

    initCourseBreadcrumbs({ title: data.title });
    applyBreadcrumbsSchema({ title: data.title });

    applyCourseSEO({ data, slug });

    track("course_view", {
      slug,
      title: data.title,
    });

    courseRoot.classList.remove("is-loading");
  }, 600);
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (!el) {
    console.warn(`⚠️ Element not found: ${selector}`);
    return;
  }
  el.textContent = value;
}

function renderStars(rating) {
  const starCount = Math.max(1, Math.min(5, Math.round(rating)));
  const star = `
    <svg class="c-review__star" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3.6l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9 6.7 19.7l1-5.8-4.2-4.1 5.9-.9L12 3.6z"
        fill="currentColor"
      />
    </svg>
  `;

  return Array.from({ length: starCount }, () => star).join("");
}

document.querySelectorAll("[data-cta-start]").forEach((btn) => {
  btn.addEventListener("click", () => {
    track("course_cta_click", {
      slug: currentSlug,
      title: currentCourse?.title || null,
      source: "hero",
    });
  });
});

function showCourseError() {
  const error = document.querySelector(".c-course-error");
  if (!error) return;

  // скрываем всё остальное
  document
    .querySelectorAll(".c-course-hero, .c-course-reviews, .c-course-content")
    .forEach((el) => el && (el.hidden = true));

  error.hidden = false;

  // снимаем loading, если был
  const root = document.querySelector("[data-course]");
  root?.classList.remove("is-loading");

  // SEO: мягкий 404-сигнал
  document.title = "Курс не найден — CourseLand";

  track("course_not_found", {
    slug: currentSlug || null,
  });
}

const reviews = document.querySelector(".c-course-reviews");

if (reviews) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        track("course_reviews_view", { slug: currentSlug });
        observer.disconnect(); // только один раз
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(reviews);
}
