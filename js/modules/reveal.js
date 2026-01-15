export function initReveal() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.dataset.visible = "true";
        io.unobserve(e.target);
      }
    });
  });

  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
}
