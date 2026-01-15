export function applyCatalogSEO() {
  const title = document.querySelector("[data-seo-title]");
  const desc = document.querySelector("[data-seo-description]");
  const canonical = document.querySelector("[data-canonical]");
  const baseUrl = new URL("./", location.href);

  if (title) {
    title.textContent = "Каталог онлайн-курсов | CourseLand";
  }

  if (desc) {
    desc.setAttribute(
      "content",
      "Онлайн-курсы по дизайну, разработке и маркетингу. Учитесь в удобном темпе на платформе CourseLand."
    );
  }

  if (canonical) {
    canonical.href = new URL("index.html#catalog", baseUrl).href;
  }
}

export function applyCatalogSchema(courses) {
  const el = document.querySelector("[data-schema-catalog]");
  if (!el || !Array.isArray(courses) || !courses.length) return;

  const baseUrl = new URL("./", location.href);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: course.title,
      url: new URL(`course.html?slug=${course.id}`, baseUrl).href,
    })),
  };

  el.textContent = JSON.stringify(schema, null, 2);
}
