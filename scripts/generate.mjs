#!/usr/bin/env node
/**
 * Static page generator (no dependencies).
 *
 *   content/blog.mjs        → blog.html + blog-<slug>.html        (guides / training docs)
 *   assets/js/data.js       → case-<id>.html                      (numbers)
 *   content/cases.mjs       → case-<id>.html                      (narrative + linked guides)
 *   content/shell.mjs       → header / footer / modals shared by every page,
 *                             also injected into index.html between its <!--SHELL:...--> markers
 *   (also writes) case-studies.html, 404.html, sitemap.xml and the guides teaser on index.html
 *
 * Markup uses Tailwind utility classes; `npm run css` then compiles one stylesheet per page type.
 *   npm run generate && npm run css && npm run stamp      (or just: npm run build)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { posts, meta } from "../content/blog.mjs";
import { stories } from "../content/cases.mjs";
import { privacy } from "../content/privacy.mjs";
import * as shell from "../content/shell.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://stegosglobal.com";
const OG_IMAGE = `${SITE}/assets/img/og-image.png`;
const read = (f) => readFileSync(join(root, f), "utf8");
const write = (f, s) => writeFileSync(join(root, f), s.replace(/\r\n/g, "\n"));
const { arrow } = shell;

// ---------- data ----------
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(read("assets/js/data.js"), sandbox);
const CASES = sandbox.window.STEGOS_CASES;
const MARKETS = sandbox.window.STEGOS_MARKETPLACES;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const strip = (html) => html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim();
const slugify = (t) =>
  strip(t).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const jsonLd = (obj) =>
  `    <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)
    .split("\n")
    .map((l) => "      " + l)
    .join("\n")}\n    </script>`;
const fmtDate = (iso) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const wordCount = (html) => html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
const readMins = (html) => Math.max(1, Math.round(wordCount(html) / 200));
const arrowSm = arrow.replace("<svg ", '<svg class="size-[1.5rem]" ');

// ---------- guides (posts) ----------
const TONE_BY_TAG = { Strategy: "strategy", Amazon: "amazon", Flipkart: "flipkart", Myntra: "myntra" };
const ARTS = ["bars", "rings", "wave", "orbit", "stack", "dots"];
const lessons = posts
  .map((p) => ({ ...p, ...meta[p.slug] }))
  .sort((a, b) => a.order - b.order)
  .map((p, i, all) => ({
    ...p,
    n: i + 1,
    total: all.length,
    tone: TONE_BY_TAG[p.tag] || "brand",
    art: ARTS[i % ARTS.length],
    mins: readMins(p.body),
  }));
const bySlug = Object.fromEntries(lessons.map((p) => [p.slug, p]));
const tags = [...new Set(lessons.map((p) => p.tag))];
const caseTone = (c) => TONE_BY_TAG[c.marketplace === "amazon" ? "Amazon" : c.marketplace === "flipkart" ? "Flipkart" : "Myntra"];
const casesById = Object.fromEntries(CASES.map((c) => [c.id, c]));
const COUNTS = { caseCount: CASES.length, postCount: lessons.length };

/** id of the first <h2> in a lesson whose text starts with `prefix` (for deep links) */
function headingId(slug, prefix) {
  const hit = [...bySlug[slug].body.matchAll(/<h2>([\s\S]*?)<\/h2>/g)].find((m) => strip(m[1]).startsWith(prefix));
  if (!hit) throw new Error(`no heading starting "${prefix}" in ${slug}`);
  return slugify(hit[1]);
}

// ---------- page frame ----------
function page({ file, title, description, ogType = "website", bundle, ld = [], active = "", main, publishedTime, robots = "index, follow, max-image-preview:large" }) {
  const url = `${SITE}/${file}`;
  return `<!doctype html>
<html lang="en-IN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>${shell.INLINE_JS}</script>
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="theme-color" content="#ffffff" />
    <meta name="robots" content="${robots}" />
    <meta name="author" content="Stegos Global" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="en-IN" href="${url}" />
    <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml" />

    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="Stegos Global" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content="${esc(title)}" />
${publishedTime ? `    <meta property="article:published_time" content="${publishedTime}" />\n    <meta property="article:author" content="Stegos Global" />\n` : ""}    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />

    ${shell.assets(bundle)}

${ld.map(jsonLd).join("\n")}
  </head>
  <body>
    ${shell.top({ active, ...COUNTS })}

    <main id="main">
${main}
    </main>

    ${shell.tail(COUNTS)}
  </body>
</html>
`;
}

const breadcrumbLd = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, href], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE}/${href}` })),
});
const crumbs = (items) =>
  `<nav class="breadcrumb" aria-label="Breadcrumb">${items
    .map(([label, href]) => (href ? `<a href="${href}">${esc(label)}</a>` : `<span aria-current="page">${esc(label)}</span>`))
    .join('<span class="sep" aria-hidden="true">/</span>')}</nav>`;

const secHead = ({ tag, h2, support, dark = false, tagClass = "text-brand" }) => `
          <div class="reveal mb-10 grid gap-4 lg:mb-14 lg:grid-cols-[1fr_minmax(26rem,38rem)] lg:items-end lg:gap-x-14 lg:gap-y-[2.2rem]${dark ? " on-dark" : ""}">
            <span class="tag ${tagClass} lg:col-span-2">${esc(tag)}</span>
            <h2 class="h-section">${h2}</h2>
            ${support ? `<p class="leading-relaxed ${dark ? "text-[#a9b5d3]" : "text-muted"}">${esc(support)}</p>` : ""}
          </div>`;

const ctaBand = (where, heading = "Want your own account read this way?", text = "The free audit maps spend, structure and catalogue health, and flags where efficiency is leaking.") => `
      <section class="pb-[clamp(1.968rem,2.46vw,3.28rem)]">
        <div class="wrap">
          <div class="cta-band reveal">
            <div>
              <h2>${esc(heading)}</h2>
              <p>${esc(text)}</p>
            </div>
            <button class="btn btn-cta btn-lg max-sm:w-full" type="button" data-open="auditModal">
              Get a free ad audit
              ${arrow}
            </button>
          </div>
        </div>
      </section>`;

// ---------- shared card pieces ----------
const postCard = (p) => `
            <article class="post-card">
              <div class="post-art tone-${p.tone}">
                <span class="lesson-no" aria-hidden="true">${String(p.n).padStart(2, "0")}</span>
                <svg class="art" viewBox="0 0 400 300" aria-hidden="true"><use href="#art-${p.art}" /></svg>
                <span class="arrow-btn" aria-hidden="true">${arrow}</span>
              </div>
              <div class="post-tags"><span class="tag tone-${p.tone}">${esc(p.tag)}</span><span>${p.level} · ${p.mins} min</span></div>
              <h3><a href="blog-${p.slug}.html">${esc(p.title)}</a></h3>
              <p>${esc(p.description)}</p>
            </article>`;

const miniGuide = (p, label = "") => `
              <div class="mini-card tone-${p.tone}">
                <span class="mini-ico"><span class="num">${String(p.n).padStart(2, "0")}</span></span>
                <div class="min-w-0 flex-1">
                  <b><a class="stretch" href="blog-${p.slug}.html">${esc(p.title)}</a></b>
                  <small>${label || `${esc(p.tag)} · ${p.level} · ${p.mins} min read`}</small>
                </div>
                <span class="arrow-btn" aria-hidden="true">${arrow}</span>
              </div>`;

const miniCase = (c) => `
              <div class="mini-card tone-${caseTone(c).toLowerCase()}">
                <span class="mini-ico"><svg viewBox="0 0 400 300" aria-hidden="true"><use href="#art-${ARTS[CASES.indexOf(c) % 5]}" /></svg></span>
                <div class="min-w-0 flex-1">
                  <b><a class="stretch" href="case-${c.id}.html">${esc(c.category)} — ${esc((MARKETS[c.marketplace] || {}).label || c.marketplace)}</a></b>
                  <small>${esc(c.stats.map((s) => `${s.value} ${s.label.toLowerCase()}`).join(" · "))}</small>
                </div>
                <span class="arrow-btn" aria-hidden="true">${arrow}</span>
              </div>`;

// =====================================================================
// GUIDES INDEX  (blog.html)
// =====================================================================
function blogIndex() {
  const first = lessons[0];
  const path = lessons
    .map((p) => `<li><a href="blog-${p.slug}.html">${esc(p.title.length > 56 ? p.title.slice(0, 54).replace(/\s+\S*$/, "") + "…" : p.title)}</a></li>`)
    .join("\n                ");
  const rows = tags
    .map((t) => {
      const list = lessons.filter((p) => p.tag === t);
      const blurb = {
        Strategy: "The thinking that sits behind every account we run: metrics, scaling, listings and planning.",
        Amazon: "Campaign structure and search-term control for Amazon Ads.",
        Flipkart: "What to get right before and after you advertise on Flipkart.",
        Myntra: "Aligning fashion assortment, sizes and budgets with the season.",
      }[t];
      return `
          <section class="cat-row mt-14 first:mt-0 lg:mt-24" id="topic-${slugify(t)}" aria-labelledby="h-${slugify(t)}">
            <div class="cat-head reveal mb-6 flex flex-wrap items-baseline gap-3.5">
              <h2 id="h-${slugify(t)}">${esc(t)}</h2>
              <span class="text-sm font-semibold text-muted">${list.length} ${list.length === 1 ? "guide" : "guides"}</span>
              <p class="mt-1 basis-full max-w-[56rem] text-base text-muted">${blurb}</p>
            </div>
            <div class="scroll-row stagger">${list.map(postCard).join("")}
            </div>
          </section>`;
    })
    .join("");
  const main = `
      <section class="page-hero">
        <div class="wrap">
          ${crumbs([["Home", "index.html"], ["Guides"]])}
          <h1 data-hero>Learn to read <em>marketplace ads.</em> <span class="h1-note hidden text-sm font-semibold tracking-normal text-muted not-italic sm:inline">${lessons.length} guides</span></h1>
          <p class="lede" data-hero>
            Short, practical lessons on the numbers and decisions behind every case study on this site: what ACOS,
            ROAS and TACoS mean, how to structure campaigns, and how to scale without losing control.
          </p>
        </div>
      </section>

      <section class="pb-[clamp(3.28rem,4.92vw,6.56rem)]">
        <div class="wrap">
          <div class="grid gap-4 lg:grid-cols-[1.75fr_1fr]">
            <article class="feature-card tone-${first.tone}">
              <div class="f-pills">
                <span class="pill pill-solid">Start here</span>
                <span class="pill"><span class="dotmark"></span>${esc(first.tag)}</span>
              </div>
              <div class="notch"><h2><a href="blog-${first.slug}.html">${esc(first.title)}</a></h2></div>
              <svg class="art" viewBox="0 0 400 300" aria-hidden="true"><use href="#art-${first.art}" /></svg>
              <span class="arrow-btn" aria-hidden="true">${arrow}</span>
            </article>

            <div class="grid gap-4 lg:grid-rows-[auto_1fr]">
              <div class="path-card">
                <div class="mb-4 flex items-center justify-between">
                  <span class="tag tone-strategy bg-white/60">Learning path</span>
                  <span class="plus-btn" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-plus" /></svg></span>
                </div>
                <h3 class="mb-3.5 text-[clamp(2.4rem,2.4vw,3rem)] tracking-[-0.04em]">${lessons.length} lessons, in order.</h3>
                <ol class="path-list">
                ${path}
                </ol>
              </div>
              <div class="guide-cta">
                <svg class="art" viewBox="0 0 400 300" aria-hidden="true"><use href="#art-orbit" /></svg>
                <span class="count">${lessons.length}</span>
                <a class="big-pill" href="#topics">Browse by topic ${arrow.replace("<svg ", '<svg class="size-[1.8rem]" ')}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="pb-[clamp(4.592rem,6.56vw,9.84rem)]" id="topics">
        <div class="wrap">
          <div class="mb-10 flex flex-wrap gap-2 lg:mb-14" role="navigation" aria-label="Jump to a topic">
            ${tags.map((t) => `<a class="chip" href="#topic-${slugify(t)}">${esc(t)}</a>`).join("\n            ")}
          </div>${rows}
        </div>
      </section>

      <section class="pb-[clamp(4.592rem,6.56vw,9.84rem)]">
        <div class="wrap">
          <div class="learn-strip reveal grid items-center gap-6 lg:grid-cols-[0.9fr_1.3fr] lg:gap-14">
            <div>
              <span class="tag mb-4 text-brand">See it in practice</span>
              <h2 class="mb-3 text-[clamp(2.46rem,3.28vw,4.264rem)] tracking-[-0.048em]">The same ideas, in real accounts.</h2>
              <p class="mb-6 leading-relaxed text-soft">Every guide connects to a case study, so you can see the numbers behind the lesson.</p>
              <a class="btn btn-dark btn-lg max-sm:w-full" href="case-studies.html">Open the case studies ${arrow}</a>
            </div>
            <div class="grid gap-3">${CASES.slice(0, 3).map(miniCase).join("")}
            </div>
          </div>
        </div>
      </section>
${ctaBand("blog_index", "Want these ideas applied to your account?")}`;
  return page({
    file: "blog.html",
    bundle: "blog",
    active: "blog",
    title: "Guides — Learn Amazon, Flipkart & Myntra Ads | Stegos Global",
    description:
      "Practical lessons on Amazon, Flipkart and Myntra advertising for Indian sellers: ACOS and ROAS, campaign structure, search-term review, scaling and festive planning.",
    main,
    ld: [
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            "@id": `${SITE}/blog.html#page`,
            url: `${SITE}/blog.html`,
            name: "Stegos Global Guides",
            inLanguage: "en-IN",
            publisher: { "@type": "Organization", name: "Stegos Global", url: `${SITE}/` },
            hasPart: lessons.map((p) => ({ "@type": "Article", headline: p.title, url: `${SITE}/blog-${p.slug}.html`, datePublished: p.date })),
          },
          breadcrumbLd([["Home", ""], ["Guides", "blog.html"]]),
        ],
      },
    ],
  });
}

// =====================================================================
// LESSON PAGE  (blog-<slug>.html)  — doc layout
// =====================================================================
function blogPost(p) {
  const toc = [];
  let n = 0;
  const body = p.body.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, t) => {
    n++;
    const id = slugify(t);
    toc.push({ id, text: strip(t) });
    return `<h2 id="${id}"><span class="sec-no">${n}</span><span>${t}</span></h2>`;
  });
  const prev = lessons[p.n - 2];
  const next = lessons[p.n];
  const seeIt = CASES.filter((c) => (stories[c.id].guides || []).includes(p.slug));
  const navList = lessons
    .map((l) => `<li><a href="blog-${l.slug}.html"${l.slug === p.slug ? ' aria-current="page"' : ""}>${esc(l.title.length > 44 ? l.title.slice(0, 42).replace(/\s+\S*$/, "") + "…" : l.title)}</a></li>`)
    .join("\n              ");
  const tocList = toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join("\n              ");

  const main = `
      <section class="page-hero pb-4">
        <div class="wrap">
          ${crumbs([["Home", "index.html"], ["Guides", "blog.html"], [`Lesson ${p.n}`]])}
          <div class="mb-[2.2rem] flex flex-wrap items-center gap-2.5" data-hero>
            <span class="pill pill-dark">Lesson ${p.n} of ${p.total}</span>
            <span class="tag tone-${p.tone}">${esc(p.tag)}</span>
            <span class="pill border-line-2 text-muted">${p.level}</span>
          </div>
          <h1 class="max-w-[18ch] text-[clamp(2.952rem,4.592vw,6.56rem)]" data-hero>${esc(p.title)}</h1>
          <p class="lede" data-hero>${esc(p.description)}</p>
          <div class="mt-6 flex flex-wrap gap-x-[2.2rem] gap-y-2 text-sm font-semibold text-muted" data-hero>
            <span>By Stegos Global</span>
            <time datetime="${p.date}">${fmtDate(p.date)}</time>
            <span>${p.mins} min read</span>
          </div>
        </div>
      </section>

      <section class="pb-[clamp(3.936rem,4.92vw,7.872rem)]">
        <div class="wrap">
          <div class="grid items-start gap-[clamp(2.296rem,3.28vw,4.592rem)] pt-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[25rem_minmax(0,1fr)_23rem]">
            <aside class="doc-nav hidden xl:block" aria-label="Learning path">
              <h4>Learning path</h4>
              <ol class="path-list">
              ${navList}
              </ol>
            </aside>

            <article class="doc-article mx-auto min-w-0 max-w-[74rem] lg:mx-0">
              <details class="doc-toc-mobile">
                <summary>On this page</summary>
                <ol>
                  ${tocList}
                </ol>
              </details>

              <div class="learn-box">
                <h4>What you'll learn</h4>
                <ul class="grid gap-2.5">
                  ${p.takeaways.map((t) => `<li>${esc(t)}</li>`).join("\n                  ")}
                </ul>
              </div>

              <div class="prose">${body}
              </div>

              <div class="try-box">
                <span class="tag mb-3.5 text-[#ffd08a]">Try it yourself</span>
                <h3 class="mb-2.5 text-[2.6rem]">Put the lesson to work</h3>
                <p class="text-[1.65rem] leading-relaxed text-[#cdd7f1]">${esc(p.practice)}</p>
              </div>
${
  seeIt.length
    ? `
              <div class="mt-11">
                <h3 class="mb-4 text-[2.6rem]">See it in a real account</h3>
                <div class="grid gap-3">${seeIt.map(miniCase).join("")}
                </div>
              </div>`
    : ""
}
              <nav class="mt-11 grid gap-3.5 border-t-[1.5px] border-line pt-7 sm:grid-cols-2" aria-label="Previous and next lesson">
                ${
                  prev
                    ? `<div class="pager-card"><small>← Previous lesson</small><b><a class="stretch" href="blog-${prev.slug}.html">${esc(prev.title)}</a></b></div>`
                    : "<span></span>"
                }
                ${
                  next
                    ? `<div class="pager-card sm:col-start-2 sm:text-right"><small>Next lesson →</small><b><a class="stretch" href="blog-${next.slug}.html">${esc(next.title)}</a></b></div>`
                    : ""
                }
              </nav>

              <div class="mt-10 flex flex-wrap items-center justify-between gap-4">
                <button class="btn btn-cta btn-lg max-sm:w-full" type="button" data-open="auditModal">
                  Get a free ad audit
                  ${arrow}
                </button>
                <a class="link-arrow" href="blog.html">← All guides</a>
              </div>

              <div class="mt-14 xl:hidden">
                <h3 class="mb-4 text-[2.6rem]">The full learning path</h3>
                <div class="rounded-tile bg-mint p-3.5"><ol class="path-list">
                  ${navList}
                </ol></div>
              </div>
            </article>

            <aside class="doc-toc hidden lg:block" aria-label="On this page">
              <h4>On this page</h4>
              <ol>
              ${tocList}
              </ol>
            </aside>
          </div>
        </div>
      </section>
${ctaBand("guide_band", "Want this applied to your own account?")}`;
  return page({
    file: `blog-${p.slug}.html`,
    bundle: "blog",
    active: "blog",
    title: `${p.title} | Stegos Global`,
    description: p.description,
    ogType: "article",
    publishedTime: p.date,
    main,
    ld: [
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: p.title,
            description: p.description,
            datePublished: p.date,
            dateModified: p.date,
            inLanguage: "en-IN",
            image: OG_IMAGE,
            mainEntityOfPage: `${SITE}/blog-${p.slug}.html`,
            author: { "@type": "Organization", name: "Stegos Global", url: `${SITE}/` },
            publisher: { "@type": "Organization", name: "Stegos Global", url: `${SITE}/`, logo: { "@type": "ImageObject", url: `${SITE}/assets/img/favicon.svg` } },
            articleSection: p.tag,
            educationalLevel: p.level,
            wordCount: wordCount(p.body),
          },
          breadcrumbLd([["Home", ""], ["Guides", "blog.html"], [p.title, `blog-${p.slug}.html`]]),
        ],
      },
    ],
  });
}

// =====================================================================
// CASE STUDIES INDEX  (case-studies.html)
// =====================================================================
function caseStudiesIndex() {
  const gloss = [
    { term: "ROAS", tone: "brand", text: "Return on ad spend: ad-attributed sales divided by ad spend. 4.0x means ₹4 of sales for every ₹1 spent.", slug: "acos-roas-tacos-explained", h: "ROAS" },
    { term: "ACOS", tone: "amazon", text: "Advertising cost of sales: ad spend divided by ad-attributed sales. The inverse of ROAS, shown as a percentage.", slug: "acos-roas-tacos-explained", h: "ACOS" },
    { term: "TACoS", tone: "strategy", text: "Total advertising cost of sales: ad spend divided by total sales, organic included. It shows whether ads are pulling the whole account up.", slug: "acos-roas-tacos-explained", h: "TACoS" },
    { term: "TROI", tone: "flipkart", text: "Flipkart's total return on ad investment. Used on the Flipkart card in place of ROAS.", slug: "flipkart-ads-getting-started", h: "Understand the report" },
  ];
  const main = `
      <section class="page-hero">
        <div class="wrap">
          ${crumbs([["Home", "index.html"], ["Case studies"]])}
          <h1 data-hero>The wins, and the accounts <em>still being worked on.</em></h1>
          <p class="lede" data-hero>
            Real marketplace ad-account performance, shown by product category rather than brand name to protect
            client privacy. We include the results where efficiency softened, because that is where the useful
            decisions are made.
          </p>
        </div>
      </section>

      <section class="pb-[clamp(4.592rem,6.56vw,9.84rem)]">
        <div class="wrap">
          <div class="reveal mb-7 flex flex-wrap items-center justify-between gap-3.5">
            <div class="chips flex flex-wrap gap-2" role="group" aria-label="Filter case studies by marketplace">
              <button class="chip" type="button" data-filter="all" aria-pressed="true">All</button>
              <button class="chip" type="button" data-filter="amazon" aria-pressed="false">Amazon</button>
              <button class="chip" type="button" data-filter="flipkart" aria-pressed="false">Flipkart</button>
            </div>
            <div class="case-count" id="caseCount" aria-live="polite"></div>
          </div>

          <div class="results-grid stagger grid gap-4 lg:grid-cols-3" id="allCases">
            <noscript><p>Enable JavaScript to see the case studies.</p></noscript>
          </div>
        </div>
      </section>

      <section class="pb-[clamp(4.592rem,6.56vw,9.84rem)]">
        <div class="wrap">${secHead({
          tag: "Reading the numbers",
          h2: "How to read <em>these metrics.</em>",
          support: "Marketplaces name things differently. Each term links to the guide that explains it.",
        })}
          <div class="stagger grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            ${gloss
              .map(
                (g) => `<div class="glossary-item tone-${g.tone}">
              <h3>${g.term}</h3>
              <p>${esc(g.text)}</p>
              <a class="link-arrow stretch text-sm" href="blog-${g.slug}.html#${headingId(g.slug, g.h)}">Read the guide ${arrowSm}</a>
            </div>`,
              )
              .join("\n            ")}
          </div>
        </div>
      </section>

      <section class="pb-[clamp(4.592rem,6.56vw,9.84rem)]">
        <div class="wrap">
          <div class="learn-strip reveal grid items-center gap-6 lg:grid-cols-[0.9fr_1.3fr] lg:gap-14">
            <div>
              <span class="tag mb-4 text-brand">Training guides</span>
              <h2 class="mb-3 text-[clamp(2.46rem,3.28vw,4.264rem)] tracking-[-0.048em]">New to these metrics? Start here.</h2>
              <p class="mb-6 leading-relaxed text-soft">Our short lessons explain ACOS, ROAS and TACoS, campaign structure and scaling — in the order that makes the case studies easy to follow.</p>
              <a class="btn btn-dark btn-lg max-sm:w-full" href="blog.html">Open the guides ${arrow}</a>
            </div>
            <div class="grid gap-3">${lessons.slice(0, 3).map((l) => miniGuide(l)).join("")}
            </div>
          </div>
        </div>
      </section>
${ctaBand("case_studies_band")}`;
  return page({
    file: "case-studies.html",
    bundle: "cases",
    active: "cases",
    title: "Case Studies — Stegos Global",
    description:
      "Anonymised Amazon and Flipkart ad-account results from Stegos Global — including the accounts where efficiency softened. Filter by marketplace.",
    main,
    ld: [
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            "@id": `${SITE}/case-studies.html#page`,
            url: `${SITE}/case-studies.html`,
            name: "Case Studies — Stegos Global",
            inLanguage: "en-IN",
            isPartOf: { "@type": "WebSite", name: "Stegos Global", url: `${SITE}/` },
          },
          breadcrumbLd([["Home", ""], ["Case studies", "case-studies.html"]]),
        ],
      },
    ],
  });
}

// =====================================================================
// CASE PAGE  (case-<id>.html)
// =====================================================================
function casePage(c) {
  const s = stories[c.id];
  if (!s) throw new Error(`content/cases.mjs has no story for "${c.id}"`);
  const m = MARKETS[c.marketplace] || { label: c.marketplace, dot: "" };
  const tone = caseTone(c).toLowerCase();
  const idx = CASES.indexOf(c);
  const others = CASES.filter((x) => x.id !== c.id).slice(0, 3);
  const paras = (arr) => arr.map((t) => `<p>${esc(t)}</p>`).join("\n            ");
  const art = ARTS[idx % 5];
  const main = `
      <section class="page-hero tone-${tone}" style="--glow: color-mix(in srgb, var(--a1) 30%, transparent)">
        <div class="wrap">
          ${crumbs([["Home", "index.html"], ["Case studies", "case-studies.html"], [c.category]])}
          <div class="mb-[2.2rem] flex flex-wrap gap-2" data-hero>
            <span class="pill tone-${tone}"><span class="dotmark ${m.dot}"></span>${esc(m.label)}</span>
            <span class="pill border-line-2 text-muted">${esc(c.window)}</span>
          </div>
          <h1 class="max-w-[18ch] text-[clamp(2.952rem,4.592vw,6.56rem)]" data-hero>${esc(s.headline)}</h1>
          <p class="lede" data-hero>${esc(c.summary)}</p>
        </div>
      </section>

      <section class="pb-[clamp(3.28rem,4.1vw,5.904rem)]">
        <div class="wrap">
          <div class="stagger grid gap-3.5 lg:grid-cols-3">
            ${c.stats
              .map(
                (st) => `<div class="cs-stat-tile tone-${tone}"><svg class="art" viewBox="0 0 400 300" aria-hidden="true"><use href="#art-${art}" /></svg><div class="cs-stat-val">${esc(st.value)}</div><div class="cs-stat-label">${esc(st.label)}</div></div>`,
              )
              .join("\n            ")}
          </div>
          <dl class="cs-facts mt-7 grid grid-cols-2 gap-4 border-t-[1.5px] border-line pt-[2.2rem] lg:grid-cols-4">
            <div><dt>Category</dt><dd>${esc(c.category)}</dd></div>
            <div><dt>Marketplace</dt><dd>${esc(m.label)}</dd></div>
            <div><dt>Window</dt><dd>${esc(c.window)}</dd></div>
            <div><dt>Scope</dt><dd>${esc(c.scope)}</dd></div>
          </dl>
        </div>
      </section>

      <section class="pb-[clamp(4.592rem,6.56vw,9.84rem)]">
        <div class="wrap max-w-[100rem]">
          <div class="cs-block reveal">
            <span class="tag">The starting point</span>
            <h2 class="h-mid mb-5">The situation</h2>
            ${paras(s.situation)}
          </div>

          <div class="cs-block reveal">
            <span class="tag">The work</span>
            <h2 class="h-mid mb-5">What we did</h2>
            <ol class="cs-steps grid gap-2.5">
              ${s.approach.map((a) => `<li>${esc(a)}</li>`).join("\n              ")}
            </ol>
          </div>

          <div class="cs-block reveal">
            <span class="tag">The numbers</span>
            <h2 class="h-mid mb-5">Reading the results</h2>
            <div class="stagger grid gap-3.5 lg:grid-cols-3">
              ${s.reading.map((r) => `<div class="cs-read-card tone-${tone}"><h3>${esc(r.label)}</h3><p>${esc(r.text)}</p></div>`).join("\n              ")}
            </div>
          </div>

          <div class="cs-block reveal">
            <span class="tag">What happened</span>
            <h2 class="h-mid mb-5">The outcome</h2>
            ${paras(s.outcome)}
          </div>

          <div class="cs-block reveal">
            <span class="tag">Takeaways</span>
            <h2 class="h-mid mb-5">What we took from it</h2>
            <ul class="cs-lessons grid gap-2.5">
              ${s.lessons.map((l) => `<li>${esc(l)}</li>`).join("\n              ")}
            </ul>
            <p class="cs-next"><strong>What happens next.</strong> ${esc(s.next)}</p>
          </div>

          <p class="mt-10 text-[1.3rem] leading-relaxed text-muted">Anonymised by category, not brand — client privacy. Figures are the account's reported metrics for the window shown. Not a forecast or a guarantee of results.</p>
        </div>
      </section>

      <section class="pb-[clamp(4.592rem,6.56vw,9.84rem)]">
        <div class="wrap">
          <div class="learn-strip reveal grid items-center gap-6 lg:grid-cols-[0.9fr_1.3fr] lg:gap-14">
            <div>
              <span class="tag mb-4 text-brand">Learn the metrics</span>
              <h2 class="mb-3 text-[clamp(2.46rem,3.28vw,4.264rem)] tracking-[-0.048em]">Want to understand these numbers?</h2>
              <p class="leading-relaxed text-soft">These short guides explain the terms and decisions behind this account.</p>
            </div>
            <div class="grid gap-3">${s.guides.map((g) => miniGuide(bySlug[g])).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="pb-[clamp(4.592rem,6.56vw,9.84rem)]">
        <div class="wrap">${secHead({ tag: "More accounts", h2: "Other <em>case studies.</em>" })}
          <div class="results-grid swipe stagger grid gap-4 lg:grid-cols-3" id="moreCases">
            ${others
              .map((o) => {
                const om = MARKETS[o.marketplace] || { label: o.marketplace, dot: "" };
                const oi = CASES.indexOf(o);
                return `<article class="case-card tone-${caseTone(o).toLowerCase()}">
              <div class="case-art">
                <div class="pills"><span class="pill pill-solid">${esc(o.window)}</span><span class="pill"><span class="dotmark ${om.dot}"></span>${esc(om.label)}</span></div>
                <svg class="art" viewBox="0 0 400 300" aria-hidden="true"><use href="#art-${ARTS[oi % 5]}" /></svg>
                <span class="arrow-btn" aria-hidden="true">${arrow}</span>
              </div>
              <div class="case-body">
                <h3><a href="case-${o.id}.html">${esc(o.category)}</a></h3>
                <p class="cdesc">${esc(o.summary)}</p>
                <div class="case-stats">${o.stats.map((st) => `<div><div class="cs-val">${esc(st.value)}</div><div class="cs-label">${esc(st.label)}</div></div>`).join("")}</div>
                <span class="case-more">Read full case study ${arrowSm}</span>
              </div>
            </article>`;
              })
              .join("\n            ")}
          </div>
          <p class="mt-6"><a class="link-arrow" href="case-studies.html">← All case studies</a></p>
        </div>
      </section>
${ctaBand("case_page")}`;
  return page({
    file: `case-${c.id}.html`,
    bundle: "cases",
    active: "cases",
    title: `${c.category} on ${m.label.replace(" ads", "")} — Case Study | Stegos Global`,
    description: c.summary.length > 155 ? c.summary.slice(0, 152).replace(/\s+\S*$/, "") + "…" : c.summary,
    ogType: "article",
    main,
    ld: [
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: s.headline,
            description: c.summary,
            inLanguage: "en-IN",
            image: OG_IMAGE,
            mainEntityOfPage: `${SITE}/case-${c.id}.html`,
            author: { "@type": "Organization", name: "Stegos Global", url: `${SITE}/` },
            publisher: { "@type": "Organization", name: "Stegos Global", url: `${SITE}/` },
          },
          breadcrumbLd([["Home", ""], ["Case studies", "case-studies.html"], [c.category, `case-${c.id}.html`]]),
        ],
      },
    ],
  });
}

// =====================================================================
// PRIVACY POLICY
// =====================================================================
function privacyPage() {
  const toc = privacy.sections.map((s) => ({ id: slugify(s.h), h: s.h }));
  const main = `
      <section class="page-hero pb-4">
        <div class="wrap">
          ${crumbs([["Home", "index.html"], ["Privacy Policy"]])}
          <h1 class="max-w-[18ch] text-[clamp(3.2rem,4.6vw,6rem)]" data-hero>Privacy Policy</h1>
          <p class="lede" data-hero>${esc(privacy.intro)}</p>
          <p class="mt-5 text-sm font-semibold text-muted" data-hero>Last updated: <time datetime="${privacy.updated}">${fmtDate(privacy.updated)}</time></p>
        </div>
      </section>

      <section class="pb-[clamp(4.8rem,6vw,8rem)]">
        <div class="wrap">
          <div class="grid items-start gap-[clamp(2.4rem,3.6vw,4.8rem)] pt-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <article class="doc-article mx-auto min-w-0 max-w-[74rem] lg:mx-0">
              <details class="doc-toc-mobile">
                <summary>On this page</summary>
                <ol>
                  ${toc.map((t) => `<li><a href="#${t.id}">${esc(t.h)}</a></li>`).join("\n                  ")}
                </ol>
              </details>
              <div class="prose">
                ${privacy.sections.map((s, i) => `<h2 id="${slugify(s.h)}"><span class="sec-no">${i + 1}</span><span>${esc(s.h)}</span></h2>\n${s.body}`).join("\n")}
              </div>
              <div class="mt-10 rounded-tile bg-lilac p-6">
                <h2 class="mb-2 text-[2.2rem] tracking-[-0.03em]">Questions about your data?</h2>
                <p class="text-soft">Email <a class="font-semibold text-brand underline" href="mailto:nishant@stegosglobal.com">nishant@stegosglobal.com</a> and we'll help.</p>
              </div>
            </article>
            <aside class="doc-toc hidden lg:block" aria-label="On this page">
              <h4>On this page</h4>
              <ol>
                ${toc.map((t) => `<li><a href="#${t.id}">${esc(t.h)}</a></li>`).join("\n                ")}
              </ol>
            </aside>
          </div>
        </div>
      </section>`;
  return page({
    file: "privacy-policy.html",
    bundle: "blog",
    title: "Privacy Policy — Stegos Global",
    description:
      "How Stegos Global collects, uses and protects the personal data you share through stegosglobal.com, and your rights under India's DPDP Act 2023.",
    main,
    ld: [
      {
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebPage", "@id": `${SITE}/privacy-policy.html#page`, url: `${SITE}/privacy-policy.html`, name: "Privacy Policy — Stegos Global", inLanguage: "en-IN", dateModified: privacy.updated },
          breadcrumbLd([["Home", ""], ["Privacy Policy", "privacy-policy.html"]]),
        ],
      },
    ],
  });
}

// =====================================================================
// 404
// =====================================================================
function notFound() {
  const main = `
      <section class="notfound grid min-h-[70vh] place-items-center pt-28 pb-16 text-center">
        <div class="wrap">
          <div class="notfound-code" aria-hidden="true">404</div>
          <h1 class="mb-3 text-[clamp(2.296rem,3.28vw,3.608rem)]">This page isn't in the account.</h1>
          <p class="mb-6 text-muted">The link may be old or mistyped. Here's where most people want to go:</p>
          <div class="flex flex-wrap justify-center gap-3">
            <a class="btn btn-cta btn-lg" href="index.html">Home</a>
            <a class="btn btn-outline btn-lg" href="case-studies.html">Case studies</a>
            <a class="btn btn-outline btn-lg" href="blog.html">Guides</a>
          </div>
        </div>
      </section>`;
  const html = page({
    file: "404.html",
    bundle: "notfound",
    title: "Page not found — Stegos Global",
    description: "This page could not be found. Head back to Stegos Global.",
    robots: "noindex, follow",
    main,
  });
  // served from any URL depth, so make asset/links root-relative
  return html.replace("<head>", '<head>\n    <base href="/" />');
}

// =====================================================================
// write everything
// =====================================================================
const out = [];
const emit = (file, html) => {
  write(file, html);
  out.push(file);
};
emit("blog.html", blogIndex());
for (const p of lessons) emit(`blog-${p.slug}.html`, blogPost(p));
emit("case-studies.html", caseStudiesIndex());
for (const c of CASES) emit(`case-${c.id}.html`, casePage(c));
emit("privacy-policy.html", privacyPage());
emit("404.html", notFound());

// ----- index.html: shared shell + guides teaser -----
let index = read("index.html");
const fill = (name, html) => {
  const re = new RegExp(`(<!--SHELL:${name}-->)[\\s\\S]*?(<!--/SHELL:${name}-->)`);
  if (!re.test(index)) throw new Error(`index.html is missing the <!--SHELL:${name}--> markers`);
  index = index.replace(re, (_, a, b) => `${a}\n    ${html}\n    ${b}`);
};
fill("ASSETS", shell.assets("home"));
fill("TOP", shell.top({ home: true, ...COUNTS }));
fill("TAIL", shell.tail(COUNTS));
const START = "<!-- BLOG-TEASER:START -->";
const END = "<!-- BLOG-TEASER:END -->";
const si = index.indexOf(START);
const ei = index.indexOf(END);
if (si < 0 || ei < 0) throw new Error("index.html is missing BLOG-TEASER markers");
index =
  index.slice(0, si) +
  `${START}
          <div class="stagger grid gap-9 lg:grid-cols-3 lg:gap-x-5">${lessons.slice(0, 3).map(postCard).join("")}
          </div>
          ${END}` +
  index.slice(ei + END.length);
write("index.html", index);

// ----- sitemap -----
const today = new Date().toISOString().slice(0, 10);
const urls = [
  ["", today, "1.0"],
  ["case-studies.html", today, "0.8"],
  ["blog.html", today, "0.8"],
  ["privacy-policy.html", privacy.updated, "0.3"],
  ...CASES.map((c) => [`case-${c.id}.html`, today, "0.7"]),
  ...lessons.map((p) => [`blog-${p.slug}.html`, p.date, "0.6"]),
];
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(([loc, mod, pr]) => `  <url>\n    <loc>${SITE}/${loc}</loc>\n    <lastmod>${mod}</lastmod>\n    <priority>${pr}</priority>\n  </url>`)
    .join("\n")}\n</urlset>\n`,
);

console.log(`✓ generated ${out.length} pages (${lessons.length} guides, ${CASES.length} case studies) + index shell + sitemap`);
