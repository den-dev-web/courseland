export function initForm() {
  const form = document.querySelector("[data-subscribe-form]");
  if (!form) return;

  const nameInput = form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[name="email"]');
  const consentInput = form.querySelector('input[name="consent"]');
  const honeypotInput = form.querySelector('input[name="company"]');
  const sourceInput = form.querySelector('input[name="source"]');
  const status = form.querySelector("[data-status]");
  const submit = form.querySelector('button[type="submit"]');

  if (!emailInput || !consentInput || !status || !submit) return;

  const endpoint =
    form.dataset.endpoint ?? "https://jsonplaceholder.typicode.com/posts";

  const setStatus = (message, state = "") => {
    status.textContent = message;
    if (state) {
      status.dataset.state = state;
    } else {
      status.removeAttribute("data-state");
    }
  };

  const setLoading = (isLoading) => {
    form.setAttribute("aria-busy", isLoading ? "true" : "false");
    emailInput.disabled = isLoading;
    submit.disabled = isLoading;
  };

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const name = nameInput ? nameInput.value.trim() : "";
    const consent = consentInput.checked;
    const honeypot = honeypotInput ? honeypotInput.value.trim() : "";
    const source = sourceInput ? sourceInput.value.trim() : "";

    if (honeypot) {
      return;
    }

    if (!consent) {
      setStatus("Подтвердите согласие на рассылку.", "error");
      consentInput.focus();
      return;
    }

    if (!isValidEmail(email)) {
      setStatus("Введите корректный email.", "error");
      emailInput.focus();
      return;
    }

    setStatus("Отправляем...", "loading");
    setLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          consent,
          source,
        }),
      });

      if (!response.ok) {
        throw new Error("Subscribe failed");
      }

      setStatus("Спасибо! Вы подписаны на обновления.", "success");
      form.reset();
    } catch (error) {
      setStatus("Не удалось отправить. Попробуйте позже.", "error");
    } finally {
      setLoading(false);
    }
  });
}
