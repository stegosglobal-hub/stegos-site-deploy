/**
 * Stegos Global — site behaviour (vanilla JS, no dependencies).
 * Behaviour only: navigation state, modals, forms, case-study rendering/filtering, calculator.
 * Every animation lives in motion.js (GSAP) and is driven by the events dispatched below,
 * so the site stays fully usable even if the animation layer never loads.
 * Each init* function exits quietly when the elements it needs aren't on the current page.
 */
(function () {
  "use strict";

  const CFG = window.STEGOS || {};
  const CASES = window.STEGOS_CASES || [];
  const MARKETS = window.STEGOS_MARKETPLACES || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));

  /* ---------- analytics hook (works with Plausible, GA4/gtag or GTM) ---------- */
  function track(name, props) {
    try {
      if (typeof window.plausible === "function") window.plausible(name, { props });
      if (typeof window.gtag === "function") window.gtag("event", name, props);
      if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...props });
    } catch (_) {
      /* analytics must never break the page */
    }
  }
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-track]");
    if (el) track(el.dataset.track, { location: el.dataset.where || "" });
  });

  /* ---------- config-driven contact details ---------- */
  function waUrl(text) {
    const base = `https://wa.me/${CFG.whatsappNumber}`;
    return text ? `${base}?text=${encodeURIComponent(text)}` : base;
  }

  function initContactDetails() {
    $$("[data-contact]").forEach((el) => {
      const kind = el.dataset.contact;
      if (kind === "email" && CFG.email) {
        el.textContent = CFG.email;
        if (el.tagName === "A") el.href = `mailto:${CFG.email}`;
      } else if (kind === "whatsapp" && CFG.whatsappNumber) {
        el.textContent = CFG.whatsappDisplay || `+${CFG.whatsappNumber}`;
        if (el.tagName === "A") el.href = waUrl();
      }
    });
    $$("[data-wa]").forEach((el) => {
      el.href = waUrl(el.dataset.wa || "");
    });
    $$("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- navigation ---------- */
  function initNav() {
    const nav = $("header.nav");
    if (nav) {
      const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
    const toggle = $("#navToggle");
    const links = $("#navLinks");
    if (!toggle || !links) return;
    const setOpen = (open) => {
      links.classList.toggle("mobile-open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.textContent = open ? "Close" : "Menu";
      emit("stegos:menu", { open });
    };
    // leaving mobile width with the menu open must not leave the page scroll-locked
    window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
      if (e.matches) setOpen(false);
    });
    toggle.addEventListener("click", () => setOpen(!links.classList.contains("mobile-open")));
    $$("a, button", links).forEach((el) => el.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && links.classList.contains("mobile-open")) setOpen(false);
    });

    // Scrollspy: highlight the nav link of the section currently in view.
    const spyTargets = $$("a[href*='#']", links)
      .map((a) => {
        const url = new URL(a.href, location.href);
        if (url.pathname !== location.pathname) return null;
        const target = url.hash && document.getElementById(url.hash.slice(1));
        return target ? { a, target } : null;
      })
      .filter(Boolean);
    if (!spyTargets.length || !("IntersectionObserver" in window)) return;
    let current = null;
    const paint = () =>
      spyTargets.forEach(({ a, target }) => {
        if (target === current) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) current = entry.target;
          else if (entry.target === current) current = null;
        });
        paint();
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    spyTargets.forEach(({ target }) => spy.observe(target));
  }

  /* ---------- back-to-top (visibility only) ---------- */
  function initScrollUI() {
    const toTop = $("#toTopBtn");
    const hero = $(".hero, .page-hero");
    const update = () => {
      if (toTop) toTop.classList.toggle("visible", scrollY > (hero ? hero.offsetHeight - 100 : 400));
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    if (toTop)
      toTop.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }),
      );
  }

  /* ---------- hero chart ---------- */
  function initHeroBars() {
    const barsEl = $("#bars");
    if (!barsEl) return;
    // Real Amazon vs Flipkart ad-spend split (₹53.0L vs ₹2.2L). motion.js animates the growth.
    const spend = [
      { label: "Amazon", value: 53.0, color: "var(--color-amazon)" },
      { label: "Flipkart", value: 2.2, color: "var(--color-flipkart)" },
    ];
    const max = Math.max(...spend.map((m) => m.value));
    spend.forEach((m) => {
      const b = document.createElement("div");
      b.className = "bar";
      b.style.background = m.color;
      b.style.color = m.color;
      b.title = `${m.label}: ₹${m.value}L`;
      b.style.height = Math.max((m.value / max) * 100, 6) + "%";
      barsEl.appendChild(b);
    });
  }

  /* ---------- modals (accessible: focus trap, Esc, focus restore) ---------- */
  const modalState = { open: null, opener: null };
  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openModal(id, opener) {
    const modal = document.getElementById(id);
    if (!modal) return;
    if (modalState.open) closeModal();
    modalState.open = modal;
    modalState.opener = opener || document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    emit("stegos:modal", { el: modal, open: true });
    // first visible field (skips the hidden honeypot), else the primary action, else close
    const first =
      $$('input:not([name="_honey"]):not([type="hidden"]), textarea, a.modal-cta', modal).find(
        (n) => n.offsetParent !== null,
      ) || $("[data-close]", modal);
    if (first) setTimeout(() => first.focus({ preventScroll: true }), 60);
  }
  function closeModal() {
    const modal = modalState.open;
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    emit("stegos:modal", { el: modal, open: false });
    if (modalState.opener && modalState.opener.focus) modalState.opener.focus();
    modalState.open = null;
    modalState.opener = null;
  }

  function initModals() {
    document.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-open]");
      if (opener) {
        e.preventDefault();
        if (opener.dataset.prefill) prefillAudit(opener.dataset.prefill);
        openModal(opener.dataset.open, opener);
        return;
      }
      if (e.target.closest("[data-close]")) return closeModal();
      if (e.target.classList && e.target.classList.contains("modal-overlay")) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (!modalState.open) return;
      if (e.key === "Escape") return closeModal();
      if (e.key !== "Tab") return;
      const nodes = $$(FOCUSABLE, modalState.open).filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // WhatsApp modal: reflect chosen marketplaces in the prefilled message
    const waLink = $("#waLink");
    const picks = $$('input[name="wa-marketplace"]');
    if (waLink) {
      const update = () => {
        const chosen = picks.filter((i) => i.checked).map((i) => i.value);
        waLink.href = waUrl(
          chosen.length
            ? `Hi Stegos, I'd like to talk about ${chosen.join(", ")} ads.`
            : "Hi Stegos, I'd like to talk about my marketplace ads.",
        );
      };
      picks.forEach((i) => i.addEventListener("change", update));
      update();
    }
  }

  function prefillAudit(text) {
    const notes = $("#auditNotes");
    if (notes && text) notes.value = text;
  }

  /* ---------- forms ---------- */
  const FORM_LABELS = {
    "Free Audit Modal": "Free audit request (pop-up form)",
    "Inline Contact Form": "Contact form (bottom of page)",
  };

  function istTimestamp() {
    try {
      return (
        new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        }) + " IST"
      );
    } catch (_) {
      return new Date().toISOString();
    }
  }

  // The lead as plain form fields. The Google Apps Script (apps-script/Code.gs) turns them into a
  // structured email + a Google Sheet row. Sent url-encoded so it is a "simple" cross-origin request.
  function buildLead(form, sourceLabel) {
    const val = (name) => ((form.elements[name] && form.elements[name].value) || "").trim();
    const marketplaces = $$('input[type="checkbox"]:checked', form).map((c) => c.value);
    return new URLSearchParams({
      source: FORM_LABELS[sourceLabel] || sourceLabel,
      name: val("name"),
      brand: val("brand"),
      email: val("email"),
      phone: val("phone"),
      marketplaces: marketplaces.join(", "),
      message: val("notes"),
      page: location.href,
      submitted: istTimestamp(),
      device: window.matchMedia("(pointer: coarse)").matches ? "Mobile / touch" : "Desktop",
      _honey: val("_honey"),
    });
  }

  // Plain-text copy of the lead, used to prefill WhatsApp / e-mail if the form can't be delivered.
  function leadText(form, sourceLabel) {
    const val = (name) => ((form.elements[name] && form.elements[name].value) || "").trim();
    const marketplaces = $$('input[type="checkbox"]:checked', form).map((c) => c.value);
    return [
      `Hi Stegos, I'd like a ${sourceLabel === "Free Audit Modal" ? "free ad audit" : "conversation"}.`,
      "",
      `Name: ${val("name")}`,
      `Brand: ${val("brand")}`,
      `Email: ${val("email")}`,
      `Phone / WhatsApp: ${val("phone")}`,
      `Marketplaces: ${marketplaces.length ? marketplaces.join(", ") : "Not specified"}`,
      `Message: ${val("notes") || "(none)"}`,
    ].join("\n");
  }

  function showStatus(statusEl, kind, text, fallbackText) {
    statusEl.className = `form-status ${kind}`;
    statusEl.textContent = text;
    if (!fallbackText) return;
    const link = (href, label, external) => {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      if (external) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      return a;
    };
    statusEl.append(
      " ",
      link(waUrl(fallbackText), "send it on WhatsApp", true),
      " or ",
      link(
        `mailto:${CFG.email}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(fallbackText)}`,
        "by email",
        false,
      ),
      " — your details are already filled in.",
    );
  }

  async function submitForm(form, statusEl, btn, sourceLabel) {
    statusEl.className = "form-status";
    statusEl.textContent = "";

    // Honeypot: real visitors never fill the hidden field. Pretend success to bots.
    const honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value) {
      showStatus(statusEl, "success", "Thanks — we'll be in touch shortly.");
      return;
    }

    // Phone / WhatsApp: needs at least 8 digits (spaces, +, - and brackets are fine).
    const phone = form.elements.phone;
    if (phone && phone.value.replace(/\D/g, "").length < 8) {
      showStatus(statusEl, "error", "Please enter a valid phone or WhatsApp number (at least 8 digits).");
      phone.focus();
      return;
    }

    const original = btn.innerHTML;
    btn.disabled = true;
    btn.style.opacity = "0.7";
    btn.textContent = "Sending…";

    try {
      if (!CFG.formEndpoint) throw new Error("form endpoint not configured");
      const res = await fetch(CFG.formEndpoint, {
        method: "POST",
        body: buildLead(form, sourceLabel),
      });
      // The script always answers with JSON { success: true | false }; that is the source of truth.
      let body = null;
      try {
        body = await res.json();
      } catch (_) {
        /* non-JSON response */
      }
      const delivered = res.ok && body && (body.success === true || body.success === "true");
      if (delivered) {
        showStatus(
          statusEl,
          "success",
          "✓ Thank you — your details have reached the Stegos team. We'll be in touch shortly.",
        );
        form.reset();
        track("lead_submitted", { location: sourceLabel });
      } else {
        showStatus(statusEl, "error", "We couldn't deliver your message just now. Please", leadText(form, sourceLabel));
      }
    } catch (_) {
      showStatus(statusEl, "error", "Network error — please check your connection, or", leadText(form, sourceLabel));
    } finally {
      btn.disabled = false;
      btn.style.opacity = "";
      btn.innerHTML = original;
    }
  }

  function initForms() {
    [
      ["auditForm", "auditStatus", "auditSubmitBtn", "Free Audit Modal"],
      ["contactForm", "contactStatus", "contactSubmitBtn", "Inline Contact Form"],
    ].forEach(([formId, statusId, btnId, label]) => {
      const form = document.getElementById(formId);
      if (!form) return;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        submitForm(form, document.getElementById(statusId), document.getElementById(btnId), label);
      });
    });
  }

  /* ---------- case studies (rendered from assets/js/data.js) ---------- */
  const ART = ["bars", "rings", "wave", "orbit", "stack"];
  const TONE = { amazon: "amazon", flipkart: "flipkart", myntra: "myntra" };
  const arrowSvg =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-arrow" /></svg>';

  function caseCardHTML(c, i, { withId }) {
    const m = MARKETS[c.marketplace] || { label: c.marketplace, dot: "" };
    const tone = TONE[c.marketplace] || "brand";
    const stats = c.stats
      .map((s) => `<div><div class="cs-val">${s.value}</div><div class="cs-label">${s.label}</div></div>`)
      .join("");
    return `
      <article class="case-card tone-${tone}"${withId ? ` id="${c.id}"` : ""} data-market="${c.marketplace}">
        <div class="case-art">
          <div class="pills">
            <span class="pill pill-solid">${c.window}</span>
            <span class="pill"><span class="dotmark ${m.dot}"></span>${m.label}</span>
          </div>
          <svg class="art" viewBox="0 0 400 300" aria-hidden="true"><use href="#art-${ART[i % ART.length]}" /></svg>
          <span class="arrow-btn" aria-hidden="true">${arrowSvg}</span>
        </div>
        <div class="case-body">
          <h3><a href="case-${c.id}.html">${c.category}</a></h3>
          <p class="cdesc">${c.summary}</p>
          <div class="case-stats">${stats}</div>
          <span class="case-more">Read full case study ${arrowSvg.replace("<svg ", '<svg width="14" height="14" ')}</span>
        </div>
      </article>`;
  }

  function initCases() {
    const home = $("#homeCases");
    if (home && CASES.length)
      home.innerHTML = CASES.map((c, i) => caseCardHTML(c, i, { withId: false })).join("");

    const full = $("#allCases");
    if (!full || !CASES.length) return;
    full.innerHTML = CASES.map((c, i) => caseCardHTML(c, i, { withId: true })).join("");

    const chips = $$(".chip[data-filter]");
    const count = $("#caseCount");
    const apply = (filter, animate) => {
      let shown = 0;
      const visible = [];
      $$(".case-card", full).forEach((card) => {
        const match = filter === "all" || card.dataset.market === filter;
        card.hidden = !match;
        if (match) {
          shown++;
          visible.push(card);
        }
      });
      chips.forEach((chip) => chip.setAttribute("aria-pressed", chip.dataset.filter === filter));
      if (count) count.textContent = `${shown} of ${CASES.length} accounts`;
      if (animate) emit("stegos:filter", { cards: visible });
    };
    chips.forEach((chip) =>
      chip.addEventListener("click", () => {
        apply(chip.dataset.filter, true);
        track("case_filter", { location: chip.dataset.filter });
      }),
    );
    apply("all", false);

    // Deep links: scroll to + highlight the case named in the URL hash.
    const focusHash = () => {
      const target = location.hash && document.getElementById(location.hash.slice(1));
      if (target && target.classList.contains("case-card")) {
        if (target.hidden) apply("all", false);
        target.scrollIntoView({ block: "center" });
      }
    };
    focusHash();
    window.addEventListener("hashchange", focusHash);
  }

  /* ---------- ROAS upside calculator ---------- */
  function formatINR(n) {
    const abs = Math.abs(n);
    if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
    if (abs >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
  }

  function initCalculator() {
    const root = $("#calc");
    if (!root) return;
    const spend = $("#calcSpend");
    const spendRange = $("#calcSpendRange");
    const now = $("#calcNow");
    const nowRange = $("#calcNowRange");
    const target = $("#calcTarget");
    const targetRange = $("#calcTargetRange");
    const out = {
      spendLabel: $("#calcSpendLabel"),
      revNow: $("#calcRevNow"),
      revTarget: $("#calcRevTarget"),
      uplift: $("#calcUplift"),
      annual: $("#calcAnnual"),
      msg: $("#calcMsg"),
      cta: $("#calcCta"),
    };

    // keep number box and slider in sync
    [
      [spend, spendRange],
      [now, nowRange],
      [target, targetRange],
    ].forEach(([num, range]) => {
      num.addEventListener("input", () => {
        range.value = num.value;
        compute();
      });
      range.addEventListener("input", () => {
        num.value = range.value;
        compute();
      });
    });

    const paintFill = (range) => {
      const min = parseFloat(range.min) || 0;
      const max = parseFloat(range.max) || 1;
      const pct = ((parseFloat(range.value) - min) / (max - min)) * 100;
      range.style.setProperty("--fill", `${Math.min(Math.max(pct, 0), 100)}%`);
    };

    function compute() {
      [spendRange, nowRange, targetRange].forEach(paintFill);
      const s = Math.max(parseFloat(spend.value) || 0, 0);
      const a = Math.max(parseFloat(now.value) || 0, 0);
      const b = Math.max(parseFloat(target.value) || 0, 0);
      const revNow = s * a;
      const revTarget = s * b;
      const uplift = revTarget - revNow;
      out.spendLabel.textContent = formatINR(s);
      out.revNow.textContent = formatINR(revNow);
      out.revTarget.textContent = formatINR(revTarget);
      const positive = uplift > 0;
      out.uplift.textContent = positive ? `+${formatINR(uplift)}` : "—";
      out.annual.textContent = positive ? `+${formatINR(uplift * 12)}` : "—";
      out.msg.textContent = positive
        ? `Same ad spend, ROAS ${a.toFixed(1)}x → ${b.toFixed(1)}x.`
        : "Set a target ROAS above your current ROAS to see the upside.";
      out.cta.dataset.prefill = `Monthly ad spend about ${formatINR(s)}. ROAS now ${a.toFixed(1)}x, aiming for ${b.toFixed(1)}x. Please look at where efficiency is leaking.`;
    }
    compute();
  }

  /* ---------- FAQ: one open at a time ---------- */
  function initFaq() {
    const items = $$(".faq-item");
    items.forEach((item) =>
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
        track("faq_open", { location: item.id || "" });
      }),
    );
  }

  /* ---------- boot ---------- */
  function boot() {
    initContactDetails();
    initNav();
    initScrollUI();
    initCases(); // before motion.js runs so rendered cards get their effects
    initHeroBars();
    initModals();
    initForms();
    initCalculator();
    initFaq();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
