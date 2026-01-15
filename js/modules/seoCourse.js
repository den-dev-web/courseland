export function applyCourseSEO({ data, slug }) {
  applyMeta(data);
  applyOpenGraph(data, slug);
  applySchema(data);
  applyCanonical(slug);
}

function applyMeta(data) {
  const title = document.querySelector("[data-seo-title]");
  const desc = document.querySelector("[data-seo-description]");

  if (title) {
    title.textContent = `${data.title} — онлайн-курс | CourseLand`;
  }

  if (desc) {
    desc.setAttribute("content", data.description.slice(0, 155));
  }
}

function applyOpenGraph(data, slug) {
  const set = (sel, val) => {
    const el = document.querySelector(sel);
    if (el) el.setAttribute("content", val);
  };

  const baseUrl = new URL("./", location.href);
  set("[data-og-title]", data.title);
  set("[data-og-description]", data.description);
  const imageSrc = data.image?.jpg ?? data.image?.webp ?? data.image ?? "";
  if (imageSrc) {
    set("[data-og-image]", new URL(imageSrc, baseUrl).href);
  }
  set("[data-og-url]", new URL(`course.html?slug=${slug}`, baseUrl).href);
}

function applySchema(data) {
  const el = document.querySelector("[data-schema-course]");
  if (!el) return;

  const baseUrl = new URL("./", location.href);
  el.textContent = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: data.title,
      description: data.description,
      provider: {
        "@type": "Organization",
        name: "CourseLand",
        url: baseUrl.href,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: data.rating,
        reviewCount: data.students,
      },
    },
    null,
    2
  );
}

function applyCanonical(slug) {
  const el = document.querySelector("[data-canonical]");
  if (el) {
    const baseUrl = new URL("./", location.href);
    el.href = new URL(`course.html?slug=${slug}`, baseUrl).href;
  }
}
