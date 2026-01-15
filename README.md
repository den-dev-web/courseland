# CourseLand

CourseLand is a static frontend project for an online courses platform, focused on catalog architecture, SEO-oriented frontend practices, and clean modular code without build tools.

🔗 Live demo: https://den-dev-web.github.io/courseland/

---

## 📌 About the Project

CourseLand represents a course catalog with filtering, individual course pages, and SEO-aware metadata handling.  
The project demonstrates how a **content-driven frontend application** can be built using only native web technologies, while remaining compatible with GitHub Pages and static hosting.

---

## ⚙️ Tech Stack

- **HTML5** — semantic markup  
- **CSS** — layered modular architecture (`settings`, `layout`, `components`, `utilities`), reusable background patterns  
- **JavaScript (ES Modules)** — modular logic loaded via `type="module"`  
- **Data** — local course dataset (`courses.js`)  
- **No build tools** — pure static hosting, GitHub Pages compatible

---

## 🧩 Architecture & Development Approach

- Component-based CSS structure with isolated component files
- Clear separation of responsibilities in JavaScript:
  - `catalog` — course list rendering
  - `filters` — frontend filtering logic
  - `seo` — dynamic meta tags and structured data
  - `analytics` — page-level tracking hooks
- Progressive enhancement:
  - base semantic markup works without JavaScript
  - JS adds filtering, navigation, and dynamic metadata
- SEO-oriented frontend implementation:
  - dynamic `title` and `meta description`
  - canonical URLs
  - Open Graph metadata
  - Schema.org structured data (`Catalog`, `Course`, `BreadcrumbList`)
- Fully static and GitHub Pages–friendly setup using relative paths

---

## ✨ Key Features

- Responsive course catalog layout
- Frontend filtering of courses
- Skeleton loaders for catalog loading states
- Individual course pages (`course.html`) with URL parameters (slug-based)
- Dynamic SEO metadata for catalog and course pages
- Social sharing metadata (Open Graph)
- Mobile-first adaptive layout

---

## 🎯 What This Project Demonstrates

- Ability to design SEO-aware frontend architectures without frameworks
- Clean separation of UI, data, and metadata logic
- Strong understanding of semantic HTML and search optimization
- Modular JavaScript and CSS organization for static projects
- GitHub Pages–compatible deployment strategy

---

## 🚀 Possible Improvements

- Server-side or API-based data source
- Advanced filtering and sorting options
- Pagination or infinite scroll
- Analytics event tracking for user interactions
