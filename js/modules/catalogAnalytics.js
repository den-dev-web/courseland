import { track } from "./analytics.js";

export function trackCatalogView() {
  track("catalog_view");
}

export function trackFilterChange(filters) {
  track("catalog_filter_change", { filters });
}

export function trackCourseClick({ slug, title, position }) {
  track("catalog_course_click", { slug, title, position });
}

export function trackEmptyResult(filters) {
  track("catalog_empty_result", { filters });
}

export function trackResetFilters() {
  track("catalog_filters_reset");
}
