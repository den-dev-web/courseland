const FAQ_ITEMS = [
  {
    question: "Как устроено обучение?",
    answer:
      "Вы проходите уроки в удобном темпе, выполняете задания и получаете обратную связь в течение курса.",
  },
  {
    question: "Есть ли домашние задания?",
    answer:
      "Да, большинство курсов включает практику и небольшие проекты для закрепления навыков.",
  },
  {
    question: "Можно ли вернуть деньги?",
    answer:
      "Если курс не подошел, можно оформить возврат в течение 7 дней после оплаты.",
  },
  {
    question: "Нужны ли специальные программы?",
    answer:
      "Обычно достаточно браузера. В описании курса мы указываем нужные инструменты.",
  },
];

export function initFAQ() {
  const root = document.querySelector("[data-faq]");
  if (!root) return;

  root.innerHTML = FAQ_ITEMS.map((item, index) => {
    const id = `faq-${index + 1}`;
    return `
      <div class="c-faq__item">
        <button
          class="c-faq__trigger"
          aria-expanded="false"
          aria-controls="${id}"
          data-controls="${id}"
        >
          ${item.question}
        </button>
        <div class="c-faq__panel" id="${id}" hidden>
          <p>${item.answer}</p>
        </div>
      </div>
    `;
  }).join("");

  root.querySelectorAll("button").forEach((btn) => {
    btn.onclick = () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", !expanded);
      const panel = document.getElementById(btn.dataset.controls);
      if (panel) panel.hidden = expanded;
    };
  });
}
