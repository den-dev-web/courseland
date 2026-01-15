import {
  trackEmptyResult,
  trackFilterChange,
  trackResetFilters,
} from "./catalogAnalytics.js";

export function initCatalogFilter({ setCatalogState }) {
  const cards = Array.from(
    document.querySelectorAll(".c-course-card:not(.c-course-card--skeleton)")
  );

  const filterTriggers = document.querySelectorAll(".c-filter__trigger");

  if (!cards.length || !filterTriggers.length) return;

  const durationSplitHours = 10;

  const getActiveFilters = () => {
    const filters = {};

    filterTriggers.forEach((trigger) => {
      const value = trigger.dataset.value;
      if (!value) return;

      const key = trigger.getAttribute("aria-controls")?.replace("filter-", "");

      if (key) filters[key] = value;
    });

    return filters;
  };

  function updateCatalogRobots(hasActiveFilters) {
    const robots = document.querySelector("[data-robots]");
    if (!robots) return;

    robots.setAttribute(
      "content",
      hasActiveFilters ? "noindex, follow" : "index, follow"
    );
  }

  const applyFilters = () => {
    const activeFilters = getActiveFilters();
    let visibleCount = 0;

    cards.forEach((card) => {
      const isVisible = Object.entries(activeFilters).every(([key, value]) => {
        if (key === "duration") {
          const hours = Number(card.dataset.durationHours || 0);
          return value === "short"
            ? hours > 0 && hours <= durationSplitHours
            : hours > durationSplitHours;
        }

        if (key === "rating") {
          const rating = Number(card.dataset.rating || 0);
          return rating >= Number(value);
        }

        return card.dataset[key] === value;
      });

      card.hidden = !isVisible;
      if (isVisible) visibleCount++;
    });

    if (visibleCount === 0) {
      setCatalogState("empty");
      trackEmptyResult(getActiveFilters());
    } else {
      setCatalogState("results");
    }

    updateCatalogRobots(Object.keys(activeFilters).length > 0);
  };

  // 🔔 изменение фильтров
  document.addEventListener("filters:change", () => {
    const filters = getActiveFilters(); // та же функция
    applyFilters();
    trackFilterChange(filters);
  });

  // 🔄 сброс фильтров
  document
    .querySelector("[data-reset-filters]")
    ?.addEventListener("click", () => {
      filterTriggers.forEach((trigger) => {
        trigger.dataset.value = "";
        trigger.textContent = trigger.dataset.default;
        trigger.setAttribute("aria-pressed", "false");

        trigger.closest(".c-filter")?.classList.remove("is-active");
      });

      applyFilters();
      trackResetFilters();
    });

  applyFilters();
}
