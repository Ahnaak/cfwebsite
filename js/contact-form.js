// Contact form: sends the message to the form service without leaving the page.
// The address it sends to is the form's `action` in index.html (Formspree today; any service that
// accepts a normal form POST and answers with JSON works, e.g. Web3Forms).
// Owner: Arya.
//
// Security notes:
// - Sent with POST in the request body, never in the URL. No cookies are sent (credentials: "omit").
// - Messages from the service are shown with textContent, never as HTML.
// - Nothing typed into the form is logged to the console.
(() => {
  const form = document.getElementById("question-form");
  if (!form) return;

  const status = form.querySelector(".form-status");
  const button = form.querySelector('button[type="submit"]');
  const buttonText = button.textContent;
  const endpoint = form.getAttribute("action") || "";
  const connected = endpoint.startsWith("https://") && !endpoint.includes("REPLACE_WITH");
  const TIMEOUT_MS = 15000;

  const MESSAGES = {
    sent: "Thank you! Your message has been sent. We will reply by email soon.",
    notConnected: "Sorry, this form isn't connected yet. Please contact us using the details at the bottom of the page.",
    failed: "Sorry, your message could not be sent. Please try again in a minute.",
    offline: "You seem to be offline. Check your internet connection and try again.",
    timeout: "Sending is taking too long. Please check your connection and try again.",
  };

  function show(text, ok) {
    status.textContent = text;
    status.classList.remove("hidden", "text-gold", "text-white");
    status.classList.add(ok ? "text-gold" : "text-white");
  }

  let sending = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return; // ignore double clicks

    const data = new FormData(form);

    // Spam trap: people never see the "website" field, so anything in it means a bot.
    // Pretend it worked so the bot learns nothing, and send nothing.
    if (String(data.get("website") || "").trim() !== "") {
      form.reset();
      show(MESSAGES.sent, true);
      return;
    }
    data.delete("website");

    if (!connected) {
      show(MESSAGES.notConnected, false);
      return;
    }

    sending = true;
    button.disabled = true;
    button.textContent = "Sending…";
    status.classList.add("hidden");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        credentials: "omit",
        signal: controller.signal,
      });

      if (response.ok) {
        form.reset();
        show(MESSAGES.sent, true);
        return;
      }

      // The service explains what was wrong (e.g. an invalid email). Show it as plain text.
      let detail = "";
      try {
        const body = await response.json();
        detail = (body.errors || []).map((e) => e.message).filter(Boolean).join(" ") || body.message || "";
      } catch {
        /* no JSON body */
      }
      show(detail ? `${MESSAGES.failed} (${String(detail).slice(0, 200)})` : MESSAGES.failed, false);
    } catch (error) {
      if (error.name === "AbortError") show(MESSAGES.timeout, false);
      else show(navigator.onLine === false ? MESSAGES.offline : MESSAGES.failed, false);
    } finally {
      clearTimeout(timer);
      sending = false;
      button.disabled = false;
      button.textContent = buttonText;
    }
  });
})();
