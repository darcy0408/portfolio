/* Darcy Van Pelt — portfolio behaviour. No dependencies. */
(() => {
  "use strict";
  document.documentElement.classList.add("js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- pixel cats ----------
     16x15 sprite drawn as run-length rects. Colors come from --cat-* in styles.css. */
  const CAT_SVG =
    '<svg viewBox="0 0 16 15" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
    '<path style="fill:var(--cat-body)" d="M2 0h1v1h-1zM9 0h1v1h-1zM2 1h2v1h-2zM8 1h2v1h-2zM2 2h8v1h-8zM1 3h10v1h-10zM1 4h1v1h-1zM4 4h4v1h-4zM10 4h1v1h-1zM1 5h1v1h-1zM4 5h4v1h-4zM10 5h1v1h-1zM1 6h4v1h-4zM7 6h4v1h-4zM2 7h8v1h-8zM3 8h6v1h-6zM2 9h8v1h-8zM1 10h10v1h-10zM1 11h10v1h-10zM1 12h10v1h-10zM1 13h13v1h-13zM2 14h2v1h-2zM5 14h4v1h-4zM10 14h2v1h-2z"/>' +
    '<path class="cat-tail" style="fill:var(--cat-body)" d="M13 9h2v1h-2zM14 10h1v1h-1zM14 11h1v1h-1zM13 12h2v1h-2z"/>' +
    '<path class="cat-eye" style="fill:var(--cat-eye)" d="M2 4h2v2h-2zM8 4h2v2h-2z"/>' +
    '<path style="fill:var(--cat-nose)" d="M5 6h2v1h-2z"/>' +
    "</svg>";
  document.querySelectorAll("[data-cat]").forEach((el) => { el.innerHTML = CAT_SVG; });

  /* ---------- footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- mobile menu ---------- */
  const menuButton = document.querySelector(".mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuButton && mobileMenu) {
    const setOpen = (open) => {
      mobileMenu.hidden = !open;
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.textContent = open ? "×" : "☰";
      menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    menuButton.addEventListener("click", () => setOpen(mobileMenu.hidden));
    mobileMenu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !mobileMenu.hidden) setOpen(false); });
  }

  /* ---------- active nav link on scroll ---------- */
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-link, .mobile-nav-link")];
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const setActive = (id) => {
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
    };
    const spy = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- scroll reveal fallback (browsers without scroll-driven animations) ---------- */
  const nativeReveal = CSS.supports("(animation-timeline: view()) and (animation-range: entry)");
  if (!nativeReveal && !reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      }
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else if (!nativeReveal) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- hero typewriter ---------- */
  const typed = document.querySelector(".typed");
  if (typed && !reduceMotion) {
    let words = [];
    try { words = JSON.parse(typed.dataset.words || "[]"); } catch { words = []; }
    if (words.length > 1) {
      let wordIndex = 0, charIndex = words[0].length, deleting = false;
      const tick = () => {
        const word = words[wordIndex];
        if (deleting) {
          charIndex--;
          typed.textContent = word.slice(0, charIndex);
          if (charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; setTimeout(tick, 350); return; }
          setTimeout(tick, 40);
        } else {
          charIndex++;
          typed.textContent = word.slice(0, charIndex);
          if (charIndex === word.length) { deleting = true; setTimeout(tick, 2200); return; }
          setTimeout(tick, 75);
        }
      };
      setTimeout(tick, 2200);
    }
  }

  /* ---------- skills tabs ---------- */
  const tabs = [...document.querySelectorAll(".skills-tab")];
  if (tabs.length) {
    const activate = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.dataset.active = String(on);
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
          activate(next); next.focus();
        }
      });
    });
    activate(tabs[0]);
  }

  /* ---------- resume modal ---------- */
  const modal = document.getElementById("resume-modal");
  if (modal && typeof modal.showModal === "function") {
    document.querySelectorAll("[data-open-resume]").forEach((b) => b.addEventListener("click", () => modal.showModal()));
    document.querySelectorAll("[data-close-resume]").forEach((b) => b.addEventListener("click", () => modal.close()));
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); }); // click on backdrop
  } else if (modal) {
    document.querySelectorAll("[data-open-resume]").forEach((b) => b.addEventListener("click", () => window.open("assets/resume.pdf", "_blank")));
  }

  /* ---------- contact form ----------
     If the form's data-endpoint holds a Formspree URL, messages are POSTed there and land in the inbox.
     Otherwise it falls back to opening the visitor's mail app with a pre-filled email. */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  if (form && status) {
    const submitButton = form.querySelector('[type="submit"]');
    const showStatus = (msg, ok) => {
      status.textContent = msg;
      status.className = `contact-status contact-status--${ok ? "success" : "error"}`;
      status.hidden = false;
    };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); showStatus("Please fill in all three fields.", false); return; }
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const endpoint = (form.dataset.endpoint || "").trim();

      if (!endpoint) {
        const subject = encodeURIComponent(`Portfolio message from ${name}`);
        const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
        window.location.href = `mailto:darcy0408@gmail.com?subject=${subject}&body=${body}`;
        showStatus("Opening your mail app. If nothing happens, email darcy0408@gmail.com directly.", true);
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "SENDING…";
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        form.reset();
        showStatus("Thanks! Your message is on its way. I'll reply to the email you gave.", true);
      } catch {
        showStatus("That didn't go through. Please email darcy0408@gmail.com directly.", false);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "SEND MESSAGE →";
      }
    });
  }
})();
