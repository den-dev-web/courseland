export function initTheme() {
  const toggle = document.querySelector("[data-theme-toggle]");
  const root = document.documentElement;

  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;

  toggle?.addEventListener("click", () => {
    const current = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = current;
    localStorage.setItem("theme", current);
  });
}
