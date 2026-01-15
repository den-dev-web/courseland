import { initMenu } from "./modules/menu.js";
import { initTheme } from "./modules/theme.js";
import initCatalog from "./modules/catalog.js";
import { initFilters } from "./modules/filters.js";
import { initSlider } from "./modules/slider.js";
import { initFAQ } from "./modules/faq.js";
import { initCategories } from "./modules/categories.js";
import { initForm } from "./modules/form.js";
import { initReveal } from "./modules/reveal.js";
import { initHeader } from "./modules/header.js";
import { initReviewsSlider } from "./modules/reviewsSlider.js";

initMenu();
initTheme();
initCatalog();
initFilters();
initSlider();
initFAQ();
initCategories();
initForm();
initReveal();
initHeader();
initReviewsSlider();

document.querySelector("[data-year]").textContent = new Date().getFullYear();
