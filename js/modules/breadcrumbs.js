export function initCourseBreadcrumbs({ title }) {
  const root = document.querySelector("[data-breadcrumbs]");
  if (!root) return;

  const items = [
    { label: "Главная", href: "index.html" },
    { label: "Каталог курсов", href: "index.html#catalog" },
    { label: title },
  ];

  root.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");

    if (item.href) {
      const a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.label;
      li.appendChild(a);
    } else {
      li.textContent = item.label;
      li.setAttribute("aria-current", "page");
    }

    root.appendChild(li);
  });
}

export function applyBreadcrumbsSchema({ title }) {
  const el = document.querySelector("[data-schema-breadcrumbs]");
  if (!el) return;

  const baseUrl = new URL("./", location.href);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: new URL("index.html", baseUrl).href,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Каталог курсов",
        item: new URL("index.html#catalog", baseUrl).href,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: location.href,
      },
    ],
  };

  el.textContent = JSON.stringify(schema, null, 2);
}
