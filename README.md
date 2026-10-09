# Stegos Global — website

Static site: **HTML + Tailwind CSS v4 + GSAP**. No framework. Pages are generated from content files,
then one small stylesheet is compiled per page type.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install Tailwind + GSAP (dev dependencies). |
| `npm run build` | generate pages → compile CSS → copy GSAP → stamp cache hashes → write `dist/`. |
| `npm run dev` | Serve the project at http://localhost:8080 (run `npm run build` first). |
| `npm run css:watch` | Recompile Tailwind on every change while you edit. |
| `npm run check` | Link / anchor / SEO / security-policy checks (also run in CI). |

The site deploys to **GitHub Pages**: `.github/workflows/deploy.yml` builds and publishes `dist/` on every push to `main`
(Settings → Pages → Source = GitHub Actions; the domain comes from `CNAME`). Pull requests run the same build and checks
without publishing. Only `dist/` is public, so `scripts/`, `src/`, `content/` and config files are never served.

GitHub Pages cannot send HTTP headers, so the Content-Security-Policy is a `<meta>` tag added to every page by
`content/shell.mjs`. If you add a script, font host or API, allow it in `CSP` there.

## Where things live

```
index.html                  Home page (hand-written; header/footer injected between <!--SHELL:...--> markers)
content/shell.mjs           Shared header, footer, pop-ups, SVG art — edit navigation HERE
content/blog.mjs            The guides (training lessons): text, learning-path order, level, "try it" task
content/cases.mjs           Narrative for each case study + which guides explain its metrics
assets/js/data.js           Case-study numbers (cards on home + case-studies page are rendered from this)
assets/js/config.js         Email, WhatsApp number, form endpoint
assets/js/main.js           Behaviour: nav state, modals, forms, filters, calculator
assets/js/motion.js         Every animation (GSAP + ScrollTrigger) — progressive enhancement
src/css/tokens.css          Design tokens (@theme): colours, fonts, radii
src/css/{base,layout,cards}.css   Shared components
src/css/{home,cases,blog,notfound}.css   Page-specific components
src/css/entries/*.css       One entry per page type → assets/css/<name>.css (generated)
scripts/generate.mjs        Builds blog*.html, case-*.html, case-studies.html, 404.html, sitemap.xml
```

Generated files (do not edit by hand): `blog*.html`, `case-*.html`, `case-studies.html`, `404.html`,
`sitemap.xml`, `assets/css/*.css`, `assets/vendor/*`.

## Common tasks

* **Add a guide** → append to `content/blog.mjs` (and its `meta` entry), then `npm run build`.
* **Add a case study** → add the card in `assets/js/data.js` and its story in `content/cases.mjs`.
* **Change contact details / form email** → `assets/js/config.js`.
* **Leads** go to the FormSubmit address in `config.js`. After the first deploy, submit the form once and
  click the activation link FormSubmit emails to that address.
