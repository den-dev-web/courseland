export function initMenu() {
  const burger = document.querySelector("[data-burger]");
  const menu = document.querySelector(".c-mobile-menu");
  const overlay = document.querySelector("[data-menu-overlay]");
  const closeBtn = document.querySelector("[data-menu-close]");

  if (burger && menu) {
    const openMenu = () => {
      menu.hidden = false;

      menu.getBoundingClientRect(); // force reflow

      requestAnimationFrame(() => {
        menu.dataset.open = "true";
      });

      burger.setAttribute("aria-expanded", "true");
      document.documentElement.classList.add("is-menu-open");
      document.body.classList.add("is-menu-open");
    };

    const closeMenu = () => {
      menu.dataset.open = "false";
      burger.setAttribute("aria-expanded", "false");
      document.documentElement.classList.remove("is-menu-open");
      document.body.classList.remove("is-menu-open");

      setTimeout(() => {
        menu.hidden = true;
      }, 280);
    };

    burger.addEventListener("click", openMenu);
    overlay.addEventListener("click", closeMenu);
    closeBtn.addEventListener("click", closeMenu);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    menu
      .querySelectorAll("a")
      .forEach((link) => link.addEventListener("click", closeMenu));
  }
}
