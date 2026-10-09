/**
 * Shared page furniture (sprite, header, footer, pop-ups, mobile bar, scripts).
 * scripts/generate.mjs uses this for every generated page and injects it into
 * index.html between the <!--SHELL:...--> markers, so navigation lives in ONE place.
 */

/** <head> assets: font + the page-type stylesheet (home | cases | blog | notfound) */
export const assets = (bundle) => `<link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500;1,600;1,700;1,800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="assets/css/${bundle}.css" />`;

const ART = `
      <!-- decorative card art: colours come from --a1/--a2/--a3 on the card -->
      <symbol id="art-bars" viewBox="0 0 400 300">
        <rect x="40" y="170" width="42" height="130" rx="21" style="fill:var(--a3)" />
        <rect x="104" y="130" width="42" height="170" rx="21" style="fill:var(--a2)" />
        <rect x="168" y="150" width="42" height="150" rx="21" style="fill:var(--a3)" />
        <rect x="232" y="80" width="42" height="220" rx="21" style="fill:var(--a1)" />
        <rect x="296" y="30" width="42" height="270" rx="21" style="fill:var(--a2)" />
        <circle cx="317" cy="30" r="12" style="fill:var(--a1)" />
      </symbol>
      <symbol id="art-rings" viewBox="0 0 400 300">
        <circle cx="270" cy="150" r="130" style="fill:var(--a3)" />
        <circle cx="270" cy="150" r="92" style="fill:var(--a2)" />
        <circle cx="270" cy="150" r="52" style="fill:var(--a1)" />
        <circle cx="90" cy="70" r="26" style="fill:var(--a1)" />
        <circle cx="70" cy="230" r="14" style="fill:var(--a2)" />
      </symbol>
      <symbol id="art-wave" viewBox="0 0 400 300">
        <path d="M0 230 C70 230 90 120 160 130 S270 230 330 120 S380 60 400 50 V300 H0Z" style="fill:var(--a3)" />
        <path d="M0 260 C80 260 100 170 170 180 S280 260 340 170 S385 120 400 110 V300 H0Z" style="fill:var(--a2)" />
        <circle cx="338" cy="168" r="20" style="fill:var(--a1)" />
        <circle cx="70" cy="64" r="16" style="fill:var(--a1)" />
      </symbol>
      <symbol id="art-orbit" viewBox="0 0 400 300">
        <circle cx="200" cy="150" r="118" fill="none" style="stroke:var(--a3)" stroke-width="26" />
        <circle cx="200" cy="150" r="64" style="fill:var(--a2)" />
        <circle cx="318" cy="150" r="24" style="fill:var(--a1)" />
        <circle cx="96" cy="76" r="14" style="fill:var(--a1)" />
        <circle cx="120" cy="248" r="10" style="fill:var(--a3)" />
      </symbol>
      <symbol id="art-stack" viewBox="0 0 400 300">
        <rect x="70" y="190" width="260" height="62" rx="31" style="fill:var(--a3)" />
        <rect x="100" y="120" width="260" height="62" rx="31" style="fill:var(--a2)" />
        <rect x="60" y="50" width="260" height="62" rx="31" style="fill:var(--a1)" />
        <circle cx="291" cy="81" r="14" fill="#fff" fill-opacity=".7" />
      </symbol>
      <symbol id="art-dots" viewBox="0 0 400 300">
        <g style="fill:var(--a3)">
          <circle cx="60" cy="60" r="9" /><circle cx="120" cy="60" r="9" /><circle cx="180" cy="60" r="9" /><circle cx="240" cy="60" r="9" /><circle cx="300" cy="60" r="9" /><circle cx="360" cy="60" r="9" />
          <circle cx="60" cy="120" r="9" /><circle cx="120" cy="120" r="9" /><circle cx="180" cy="120" r="9" /><circle cx="240" cy="120" r="9" /><circle cx="300" cy="120" r="9" /><circle cx="360" cy="120" r="9" />
          <circle cx="60" cy="180" r="9" /><circle cx="120" cy="180" r="9" /><circle cx="180" cy="180" r="9" /><circle cx="240" cy="180" r="9" /><circle cx="300" cy="180" r="9" /><circle cx="360" cy="180" r="9" />
          <circle cx="60" cy="240" r="9" /><circle cx="120" cy="240" r="9" /><circle cx="180" cy="240" r="9" /><circle cx="240" cy="240" r="9" /><circle cx="300" cy="240" r="9" /><circle cx="360" cy="240" r="9" />
        </g>
        <circle cx="240" cy="120" r="34" style="fill:var(--a1)" />
        <circle cx="300" cy="180" r="22" style="fill:var(--a2)" />
      </symbol>`;

export const SPRITE = `<svg width="0" height="0" style="position: absolute" aria-hidden="true" focusable="false">
      <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H9M17 7v8" /></symbol>
      <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></symbol>
      <symbol id="i-up" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></symbol>
      <symbol id="i-wa" viewBox="0 0 24 24">
        <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.2 1.8 2.8 4.4 3.8.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.7-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z" />
        <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.5 5.1L2 22l5.1-1.4C8.5 21.5 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3C4 15 3.5 13.5 3.5 12 3.5 7.3 7.3 3.5 12 3.5S20.5 7.3 20.5 12 16.7 20.2 12 20.2z" />
      </symbol>${ART}
    </svg>`;

export const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-arrow" /></svg>';
export const waIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><use href="#i-wa" /></svg>';

/** nav + counts. `home` = true on index.html (anchors stay on-page). */
export function header({ active = "", home = false, caseCount = 0, postCount = 0 } = {}) {
  const p = home ? "" : "index.html";
  const cur = (k) => (active === k ? ' aria-current="page"' : "");
  return `<header class="nav">
      <div class="nav-inner">
        <a class="logo" href="${home ? "#top" : "index.html"}" aria-label="Stegos Global — home">Stegos<b>.</b><small>Global</small></a>
        <nav class="nav-links" id="navLinks" aria-label="Primary">
          <a href="${p}#services">Services</a>
          <a href="${p}#why-us">Why us</a>
          <a href="${p}#results">Results</a>
          <a href="case-studies.html"${cur("cases")}>Case Studies<sup>${caseCount}</sup></a>
          <a href="blog.html"${cur("blog")}>Guides<sup>${postCount}</sup></a>
          <a href="${p}#process">Process</a>
          <a href="${p}#faq">FAQ</a>
          <a href="${p}#contact">Contact</a>
          <button class="btn btn-outline nav-links-whatsapp" type="button" data-open="waModal" data-track="open_whatsapp_modal" data-where="nav_mobile">
            ${waIcon}
            Chat on WhatsApp
          </button>
        </nav>
        <div class="nav-actions">
          <button class="icon-btn" type="button" data-open="waModal" data-track="open_whatsapp_modal" data-where="nav" aria-label="Chat on WhatsApp">
            ${waIcon}
          </button>
          <button class="btn btn-cta" type="button" data-open="auditModal" data-track="open_audit" data-where="nav">
            Free audit
            ${arrow}
          </button>
          <button class="menu-btn" id="navToggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks">Menu</button>
        </div>
      </div>
    </header>`;
}

export function footer({ caseCount = 0, postCount = 0 } = {}) {
  return `<footer class="site-footer">
      <div class="footer-panel">
        <div class="relative grid gap-10 pb-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <div>
            <div class="footer-word">Stegos<b>.</b></div>
            <p class="mb-6 max-w-[380px] text-[15px] leading-relaxed text-[#a9b5d3]">Marketplace advertising, without the guesswork. Amazon, Flipkart and Myntra — built for India.</p>
            <button class="btn btn-cta" type="button" data-open="auditModal" data-track="open_audit" data-where="footer">
              Get a free ad audit
              ${arrow}
            </button>
          </div>
          <nav class="grid grid-cols-2 content-start gap-6" aria-label="Footer">
            <div class="footer-col">
              <span class="footer-h">Explore</span>
              <a href="index.html#services">Services</a>
              <a href="index.html#results">Results</a>
              <a href="case-studies.html">Case Studies<sup>${caseCount}</sup></a>
              <a href="blog.html">Guides<sup>${postCount}</sup></a>
              <a href="index.html#faq">FAQ</a>
            </div>
            <div class="footer-col">
              <span class="footer-h">Get in touch</span>
              <a href="#" data-contact="email" data-track="click_email" data-where="footer">email</a>
              <a href="#" data-contact="whatsapp" target="_blank" rel="noopener" data-track="click_whatsapp" data-where="footer">number</a>
              <a href="index.html#contact">Send an enquiry</a>
            </div>
          </nav>
        </div>
        <div class="relative flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-[13px] text-[#8d9abd]">
          <span>© <span data-year>2026</span> Stegos Global — Built for India.</span>
          <span>Client results are shown by category, never by brand, to protect privacy.</span>
        </div>
      </div>
    </footer>`;
}

export const FLOATERS = `<a class="wa-fab" href="#" data-wa="Hi Stegos, I'd like to talk about my marketplace ads." target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp" data-track="click_whatsapp" data-where="fab">
      ${waIcon}
    </a>
    <button class="to-top" id="toTopBtn" aria-label="Back to top" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><use href="#i-up" /></svg>
    </button>


    <div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>
    <div class="cursor-dot" id="cursorDot" aria-hidden="true"></div>`;

export const MODALS = `<!-- ---------- WhatsApp modal ---------- -->
    <div class="modal-overlay" id="waModal" aria-hidden="true">
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="waTitle">
        <button class="modal-close" data-close aria-label="Close">✕</button>
        <div class="modal-eyebrow">Stegos / India</div>
        <h3 id="waTitle">Prefer a direct conversation?</h3>
        <p class="desc">Pick the marketplaces you'd like to discuss and we'll open a prefilled WhatsApp message.</p>
        <div class="modal-field">
          <div class="flabel">Email</div>
          <div class="fval"><a href="#" data-contact="email">email</a></div>
        </div>
        <div class="modal-field">
          <div class="flabel">WhatsApp</div>
          <div class="fval"><span data-contact="whatsapp">number</span></div>
        </div>
        <div class="modal-field" style="border-bottom: none">
          <div class="flabel" style="margin-bottom: 10px">Marketplaces you'd like to discuss</div>
          <div class="mp-options" style="margin-bottom: 0">
            <label class="mp-pill dark"><input type="checkbox" name="wa-marketplace" value="Amazon" /><span class="radio"></span>Amazon</label>
            <label class="mp-pill dark"><input type="checkbox" name="wa-marketplace" value="Flipkart" /><span class="radio"></span>Flipkart</label>
            <label class="mp-pill dark"><input type="checkbox" name="wa-marketplace" value="Myntra" /><span class="radio"></span>Myntra</label>
          </div>
        </div>
        <a class="modal-cta" id="waLink" href="#" target="_blank" rel="noopener" data-track="click_whatsapp" data-where="modal">
          Open WhatsApp enquiry
          ${arrow}
        </a>
      </div>
    </div>

    <!-- ---------- Free audit modal ---------- -->
    <div class="modal-overlay" id="auditModal" aria-hidden="true">
      <div class="audit-card" role="dialog" aria-modal="true" aria-labelledby="auditTitle">
        <button class="audit-close" data-close aria-label="Close">✕</button>
        <div class="audit-eyebrow"><i></i>Free audit / First signal</div>
        <h3 id="auditTitle">Let's look at your marketplace spend.</h3>
        <p class="desc">
          Share the basics. We'll use the call to identify wasted spend, missing structure, and your next clean test.
        </p>
        <form id="auditForm">
          <div class="hp-field" aria-hidden="true">
            <label>Leave this empty <input type="text" name="_honey" tabindex="-1" autocomplete="off" /></label>
          </div>
          <div class="mb-4 grid gap-3.5 sm:grid-cols-2">
            <div class="field">
              <label for="auditName">Name</label>
              <input type="text" id="auditName" name="name" placeholder="Your name" autocomplete="name" required />
            </div>
            <div class="field">
              <label for="auditBrand">Brand name</label>
              <input type="text" id="auditBrand" name="brand" placeholder="Your brand" autocomplete="organization" required />
            </div>
          </div>
          <div class="field mb-[18px]">
            <label for="auditEmail">Email</label>
            <input type="email" id="auditEmail" name="email" placeholder="you@brand.com" autocomplete="email" required />
          </div>
          <div class="mp-label" id="auditMpLabel">Marketplaces you sell on</div>
          <div class="mp-options" role="group" aria-labelledby="auditMpLabel">
            <label class="mp-pill"><input type="checkbox" name="marketplace" value="Amazon" /><span class="radio"></span>Amazon</label>
            <label class="mp-pill"><input type="checkbox" name="marketplace" value="Flipkart" /><span class="radio"></span>Flipkart</label>
            <label class="mp-pill"><input type="checkbox" name="marketplace" value="Myntra" /><span class="radio"></span>Myntra</label>
          </div>
          <div class="field mb-[18px]">
            <label for="auditNotes">What should we look at first?</label>
            <textarea class="form-textarea" id="auditNotes" name="notes" placeholder="Tell us about your current spend, targets, or the problem you're seeing."></textarea>
          </div>
          <div class="audit-footer flex flex-wrap items-center gap-4">
            <button type="submit" class="modal-cta" id="auditSubmitBtn">
              Request my audit
              ${arrow}
            </button>
            <span class="fine">No lock-in.</span>
          </div>
          <div class="form-status" id="auditStatus" role="status" aria-live="polite"></div>
        </form>
      </div>
    </div>`;

export const SCRIPTS = `<script src="assets/js/config.js"></script>
    <script src="assets/js/data.js"></script>
    <script src="assets/vendor/gsap.min.js" defer></script>
    <script src="assets/vendor/ScrollTrigger.min.js" defer></script>
    <script src="assets/js/main.js" defer></script>
    <script src="assets/js/motion.js" defer></script>`;

/** Everything after </main> */
export function tail(opts) {
  return `<div class="site-end">
    ${footer(opts)}
    </div>
    </div><!-- /.frame -->

    ${FLOATERS}

    ${MODALS}

    ${SCRIPTS}`;
}

/** Everything before <main> (inside <body>) */
export function top(opts) {
  return `${SPRITE}
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>
    <div class="frame">
    ${header(opts)}`;
}
