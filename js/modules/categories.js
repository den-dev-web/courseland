export function initCategories() {
  const root = document.querySelector("[data-categories]");
  if (!root) return;
  const rail = root.closest(".c-categories__rail");
  if (!rail) return;

  const buttons = Array.from(root.querySelectorAll(".c-category"));
  const trigger = document.querySelector('[aria-controls="filter-category"]');
  if (!trigger) return;

  const filter = trigger.closest(".c-filter");
  const panel = document.querySelector("#filter-category");
  const catalog = document.querySelector("#catalog");
  const prefersReducedMotion = matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const defaultLabel = trigger.dataset.default ?? trigger.textContent.trim();

  const updatePanelSelection = (value) => {
    if (!panel) return;
    panel.querySelectorAll("button").forEach((btn) => {
      const isSelected = value
        ? btn.dataset.value === value
        : btn.dataset.value === "";
      btn.classList.toggle("is-selected", isSelected);
    });
  };

  const setTrigger = (value, label) => {
    trigger.dataset.value = value;
    trigger.textContent = value ? label : defaultLabel;
    trigger.setAttribute("aria-pressed", value ? "true" : "false");
    filter?.classList.toggle("is-active", Boolean(value));
    updatePanelSelection(value);
  };

  const setActiveButton = (target) => {
    buttons.forEach((btn) =>
      btn.classList.toggle("is-active", btn === target)
    );
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.value ?? "";
      const label = btn.textContent.trim();

      setActiveButton(btn);
      setTrigger(value, label);
      document.dispatchEvent(new CustomEvent("filters:change"));

      if (catalog) {
        catalog.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    });
  });

  updatePanelSelection(trigger.dataset.value ?? "");

  const updateShadows = () => {
    const maxScroll = root.scrollWidth - root.clientWidth;
    const hasLeft = root.scrollLeft > 1;
    const hasRight = root.scrollLeft < maxScroll - 1;

    rail.classList.toggle("is-shadow-left", hasLeft);
    rail.classList.toggle("is-shadow-right", hasRight);
  };

  updateShadows();
  root.addEventListener("scroll", updateShadows, { passive: true });
  window.addEventListener("resize", updateShadows);
}
