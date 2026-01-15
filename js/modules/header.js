export function initHeader() {
  const header = document.querySelector(".c-header");
  if (!header) return;

  const scrolledClass = "c-header--scrolled";
  let ticking = false;

  const update = () => {
    const shouldBeScrolled = window.scrollY > 8;
    header.classList.toggle(scrolledClass, shouldBeScrolled);
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
}
