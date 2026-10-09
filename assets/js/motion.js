/**
 * Stegos Global — motion layer (GSAP 3 + ScrollTrigger, both self-hosted in assets/vendor/).
 *
 * main.js owns behaviour (forms, modals, filters, navigation state) and always leaves the page
 * fully usable. This file only *enhances* it, so if GSAP fails to load nothing is lost:
 * the CSS failsafe in base.css reveals hidden content after 3 seconds.
 *
 * main.js talks to this file through DOM events:
 *   stegos:menu   { open }      mobile menu toggled
 *   stegos:modal  { el, open }  a modal opened/closed
 *   stegos:filter { cards }     case-study cards re-filtered
 */
(function () {
  "use strict";
  const gsap = window.gsap;
  if (!gsap) return;
  const ST = window.ScrollTrigger;
  if (ST) {
    gsap.registerPlugin(ST);
    ST.config({ ignoreMobileResize: true });
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const EASE = "power3.out";

  gsap.defaults({ ease: EASE, duration: 0.8 });

  /* ---------- reveal-on-scroll ---------- */
  function reveal() {
    const show = (els, vars = {}) => {
      els.forEach((el) => el.classList.add("in"));
      return gsap.fromTo(
        els,
        { y: reduce ? 0 : 36, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.09, clearProps: "transform,opacity,visibility", ...vars },
      );
    };
    $$(".reveal, .stagger").forEach((el) => {
      const targets = el.classList.contains("stagger") ? Array.from(el.children) : [el];
      if (reduce || !ST) {
        el.classList.add("in");
        gsap.set(targets, { clearProps: "all" });
        return;
      }
      ST.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => {
          el.classList.add("in");
          show(targets);
        },
      });
    });
  }

  /* ---------- hero intro (plays once, on load) ---------- */
  function heroIntro() {
    const items = $$("[data-hero]");
    if (!items.length) return;
    items.forEach((el) => el.classList.add("in"));
    if (!reduce) {
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 48 },
        { autoAlpha: 1, y: 0, stagger: 0.13, duration: 1, delay: 0.1, clearProps: "transform,opacity,visibility" },
      );
    }
    const chip = $(".float-chip");
    if (chip && !reduce) gsap.to(chip, { y: -8, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true });
  }

  /* ---------- count-up numbers ---------- */
  function countUp() {
    const fmt = (v, d) =>
      v.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
    $$("[data-count]").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const d = parseInt(el.dataset.decimals || "0", 10);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const render = (v) => (el.textContent = prefix + fmt(v, d) + suffix);
      if (reduce || !ST) return render(target);
      const state = { v: 0 };
      render(0);
      ST.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () =>
          gsap.to(state, { v: target, duration: 1.6, ease: "power2.out", onUpdate: () => render(state.v) }),
      });
    });
  }

  /* ---------- hero chart bars ---------- */
  function bars() {
    const list = $$("#bars .bar");
    if (!list.length || reduce) return;
    gsap.from(list, { height: 0, duration: 1.2, delay: 0.9, stagger: 0.15, ease: "power4.out" });
  }

  /* ---------- progress bar, parallax art ---------- */
  function scrollEffects() {
    const bar = $("#scrollProgress");
    if (bar && ST && !reduce) {
      gsap.to(bar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.15 },
      });
    } else if (bar && ST) {
      ST.create({ start: 0, end: "max", onUpdate: (s) => gsap.set(bar, { scaleX: s.progress }) });
    }
    if (!ST || reduce) return;
    $$(".hero .art, .feature-card .art, .side-visual .art, .guide-cta .art").forEach((art) => {
      gsap.to(art, {
        y: -40,
        rotate: -3,
        ease: "none",
        scrollTrigger: { trigger: art.closest("section, .feature-card, .side-visual, .guide-cta") || art, scrub: 0.6 },
      });
    });
    $$(".cs-stat-tile .art").forEach((art) =>
      gsap.to(art, { y: -18, ease: "none", scrollTrigger: { trigger: art, scrub: 0.6 } }),
    );
  }

  /* ---------- logo marquee: seamless, constant speed ---------- */
  function marquee() {
    const strip = $("#logosStrip");
    const track = $("#logosTrack");
    const set = track && track.querySelector(".logos-set");
    if (!strip || !set || reduce) return;
    const original = set.cloneNode(true);
    const SPEED = 45; // px / second
    let setW = 0;
    let x = 0;
    let hover = false;

    const build = () => {
      const stripW = Math.round(strip.getBoundingClientRect().width);
      track.innerHTML = "";
      track.appendChild(original.cloneNode(true));
      const w = track.children[0].getBoundingClientRect().width;
      if (!w) return;
      setW = w;
      const copies = Math.max(2, Math.ceil((stripW * 2.2) / w));
      track.innerHTML = "";
      for (let i = 0; i < copies; i++) track.appendChild(original.cloneNode(true));
      x = -(Math.abs(x) % setW);
    };
    build();
    window.addEventListener("load", build);
    let lastW = strip.offsetWidth;
    window.addEventListener("resize", () => {
      // mobile URL bars fire resize on scroll; only rebuild when the width really changed
      if (strip.offsetWidth !== lastW) {
        lastW = strip.offsetWidth;
        build();
      }
    });
    strip.addEventListener("mouseenter", () => (hover = true));
    strip.addEventListener("mouseleave", () => (hover = false));

    const tick = (_, deltaMs) => {
      if (hover || !setW) return;
      x -= (SPEED * deltaMs) / 1000;
      if (x <= -setW) x += setW;
      gsap.set(track, { x });
    };
    if (ST) {
      ST.create({ trigger: strip, start: "top bottom", end: "bottom top", onToggle: (s) => (s.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)) });
    } else gsap.ticker.add(tick);
  }

  /* ---------- pointer effects (fine pointers only) ---------- */
  function pointer() {
    if (!finePointer || reduce) return;

    // card tilt + glow follow
    $$(".case-card, .service-card, .quote-card, .testi-card, .post-art, .cs-stat-tile, .glossary-item").forEach((card) => {
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
      gsap.set(card, { transformPerspective: 900 });
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 6);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
      });
      card.addEventListener("pointerleave", () => {
        rx(0);
        ry(0);
      });
    });

    // magnetic call-to-action buttons
    $$(".btn-cta, .big-pill").forEach((btn) => {
      const mx = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
      const my = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.18);
        my((e.clientY - (r.top + r.height / 2)) * 0.28);
      });
      btn.addEventListener("pointerleave", () => {
        mx(0);
        my(0);
      });
    });

    // custom cursor
    const ring = $("#cursorRing");
    const dot = $("#cursorDot");
    if (ring && dot) {
      const rxTo = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
      const ryTo = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });
      const dx = gsap.quickTo(dot, "x", { duration: 0.05 });
      const dy = gsap.quickTo(dot, "y", { duration: 0.05 });
      let on = false;
      document.addEventListener("mousemove", (e) => {
        if (!on) {
          on = true;
          gsap.set([ring, dot], { x: e.clientX, y: e.clientY });
          ring.classList.add("active");
          dot.classList.add("active");
        }
        rxTo(e.clientX);
        ryTo(e.clientY);
        dx(e.clientX);
        dy(e.clientY);
      });
      document.addEventListener("mouseleave", () => {
        on = false;
        ring.classList.remove("active");
        dot.classList.remove("active");
      });
      document.addEventListener("mousedown", () => ring.classList.add("pressing"));
      document.addEventListener("mouseup", () => ring.classList.remove("pressing"));
      const hot = "a, button, input, textarea, summary, label.mp-pill, .case-card, .post-card, .service-card";
      document.addEventListener("mouseover", (e) => e.target.closest(hot) && ring.classList.add("hovering"));
      document.addEventListener("mouseout", (e) => e.target.closest(hot) && ring.classList.remove("hovering"));
    }
  }

  /* ---------- menu, modals, filters, FAQ (driven by main.js events) ---------- */
  function interactions() {
    document.addEventListener("stegos:menu", (e) => {
      if (!e.detail.open || reduce) return;
      gsap.fromTo(
        "#navLinks > *",
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.04, delay: 0.05, clearProps: "transform,opacity,visibility" },
      );
    });
    document.addEventListener("stegos:modal", (e) => {
      const { el, open } = e.detail;
      if (!open || reduce) return;
      const card = $(".audit-card, .modal-card", el);
      gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, clearProps: "opacity,visibility" });
      if (card) {
        gsap.fromTo(card, { y: 40, scale: 0.96, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.55, ease: "back.out(1.4)", clearProps: "transform,opacity,visibility" });
        gsap.from($$("form .field, form .mp-options, form .mp-label, form .audit-footer, .modal-field", card), { y: 16, autoAlpha: 0, stagger: 0.05, duration: 0.5, delay: 0.15, clearProps: "transform,opacity,visibility" });
      }
    });
    document.addEventListener("stegos:filter", (e) => {
      if (reduce) return;
      gsap.fromTo(e.detail.cards, { y: 28, autoAlpha: 0, scale: 0.97 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.07, duration: 0.6, clearProps: "transform,opacity,visibility" });
    });
    $$(".faq-item").forEach((item) =>
      item.addEventListener("toggle", () => {
        if (!item.open || reduce) return;
        const body = $(".faq-body", item);
        if (body) gsap.from(body, { height: 0, autoAlpha: 0, duration: 0.45, clearProps: "height,opacity,visibility" });
      }),
    );
  }

  /* ---------- guide (doc) pages: "on this page" scrollspy ---------- */
  function docToc() {
    const links = $$(".doc-toc a");
    if (!links.length || !ST) return;
    const sections = links
      .map((a) => ({ a, h: document.getElementById(a.getAttribute("href").slice(1)) }))
      .filter((s) => s.h);
    sections.forEach(({ a, h }) =>
      ST.create({
        trigger: h,
        start: "top 30%",
        end: "bottom 30%",
        onToggle: (s) => s.isActive && links.forEach((l) => l.classList.toggle("active", l === a)),
      }),
    );
  }

  function boot() {
    heroIntro();
    reveal();
    countUp();
    bars();
    scrollEffects();
    marquee();
    pointer();
    interactions();
    docToc();
    // layout can shift once fonts/images settle
    window.addEventListener("load", () => ST && ST.refresh());
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
