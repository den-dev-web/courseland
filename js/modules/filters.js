export function initFilters() {
  let scrollY = 0;

  const filters = Array.from(document.querySelectorAll("[data-filter]"));
  const overlay = document.querySelector(".c-filter-overlay");

  if (!filters.length || !overlay) return;

  const lockScroll = () => {
    scrollY = window.scrollY;
    document.body.classList.add("is-overlay-open");
    document.body.style.top = `-${scrollY}px`;
  };

  const unlockScroll = () => {
    if (!document.body.classList.contains("is-overlay-open")) return;
    document.body.classList.remove("is-overlay-open");
    document.body.style.top = "";
    window.scrollTo(0, scrollY);
  };

  const openOverlay = () => {
    overlay.hidden = false;
    lockScroll();
  };

  const closeOverlay = () => {
    overlay.hidden = true;
    unlockScroll();
  };

  const closeAll = () => {
    filters.forEach((filterEl) => {
      filterEl.dataset.open = "false";

      const trigger = filterEl.querySelector(".c-filter__trigger");
      const panel = filterEl.querySelector(".c-filter__panel");

      if (trigger) trigger.setAttribute("aria-expanded", "false");
      if (panel) panel.hidden = true;
    });

    closeOverlay();
  };

  const openOne = (filterEl) => {
    const trigger = filterEl.querySelector(".c-filter__trigger");
    const panel = filterEl.querySelector(".c-filter__panel");
    if (!trigger || !panel) return;

    filterEl.dataset.open = "true";
    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;

    openOverlay();
  };

  const applySelection = (filterEl, optionBtn) => {
    const trigger = filterEl.querySelector(".c-filter__trigger");
    const panel = filterEl.querySelector(".c-filter__panel");
    if (!trigger || !panel) return;

    const value = optionBtn.dataset.value ?? "";
    const label = optionBtn.textContent.trim();
    const defaultLabel = trigger.dataset.default ?? trigger.textContent.trim();

    // Текст триггера + data-value
    trigger.textContent = value ? label : defaultLabel;
    trigger.dataset.value = value;
    trigger.setAttribute("aria-pressed", value ? "true" : "false");

    document.dispatchEvent(new CustomEvent("filters:change"));

    // Active state контейнера
    filterEl.classList.toggle("is-active", Boolean(value));

    // Подсветка выбранной опции
    panel.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("is-selected", btn === optionBtn);
    });
  };

  // Инициализация поведения для каждого фильтра
  filters.forEach((filterEl) => {
    const trigger = filterEl.querySelector(".c-filter__trigger");
    const panel = filterEl.querySelector(".c-filter__panel");
    if (!trigger || !panel) return;
    const currentValue = trigger.dataset.value ?? "";

    panel.querySelectorAll("button").forEach((btn) => {
      const value = btn.dataset.value ?? "";
      btn.classList.toggle("is-selected", value === currentValue);
    });
    filterEl.classList.toggle("is-active", Boolean(currentValue));

    // Открытие/закрытие по триггеру
    trigger.addEventListener("click", () => {
      const isOpen = filterEl.dataset.open === "true";
      closeAll();
      if (!isOpen) openOne(filterEl);
    });

    // Выбор опции (делегирование клика внутри панели)
    panel.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      applySelection(filterEl, btn);
      closeAll();
    });
  });

  // Закрытие по клику вне (overlay) + Escape
  overlay.addEventListener("click", closeAll);

  document.addEventListener("click", (e) => {
    const isInside = filters.some((filterEl) => filterEl.contains(e.target));
    if (!isInside) closeAll();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
}
