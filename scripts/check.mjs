#!/usr/bin/env node
/**
 * Pre-deploy sanity checks. No dependencies.
 *   - every local href/src resolves to a real file
 *   - every #fragment points at an id that exists on the target page
 *     (including case-study ids generated from assets/js/data.js)
 *   - no duplicate ids on a page
 *   - no mojibake (broken UTF-8) in any text file
 *   - JSON-LD blocks are valid JSON
 *   - every inline <script> is allow-listed by hash in the CSP headers
 *   - JS files parse
 * Run:  node scripts/check.mjs
 */
import { createHash } from "node:crypto";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const fail = (msg) => errors.push(msg);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    if (name === "node_modules" || name === "dist" || name.startsWith(".git")) return [];
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const allFiles = walk(root);
const htmlFiles = allFiles.filter((f) => f.endsWith(".html"));

// ids generated at runtime from the case-study data
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(readFileSync(join(root, "assets/js/data.js"), "utf8"), sandbox);
const caseIds = (sandbox.window.STEGOS_CASES || []).map((c) => c.id);

const idsOf = (html) => [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const pages = new Map(
  htmlFiles.map((f) => {
    const html = readFileSync(f, "utf8");
    const ids = idsOf(html);
    if (f.endsWith("case-studies.html")) ids.push(...caseIds);
    return [f, { html, ids: new Set(ids) }];
  }),
);

// --- links, anchors, duplicate ids -----------------------------------------
for (const [file, { html }] of pages) {
  const rel = relative(root, file);
  const seen = new Set();
  for (const id of idsOf(html)) {
    if (seen.has(id)) fail(`${rel}: duplicate id "${id}"`);
    seen.add(id);
  }
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(url) || url === "#") continue;
    const [pathPart, hash] = url.split("#");
    const clean = pathPart.split("?")[0];
    let target = file;
    if (clean) {
      target = clean.startsWith("/") ? join(root, clean) : join(dirname(file), clean);
      if (clean === "/" ) target = join(root, "index.html");
      if (!existsSync(target)) {
        fail(`${rel}: broken link "${url}"`);
        continue;
      }
    }
    if (hash && target.endsWith(".html") && pages.has(target) && !pages.get(target).ids.has(hash))
      fail(`${rel}: "${url}" — no element with id "${hash}" on ${relative(root, target)}`);
  }

  // JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      fail(`${rel}: invalid JSON-LD (${e.message})`);
    }
  }
}

// --- mojibake ---------------------------------------------------------------
const textExt = /\.(html|css|js|mjs|json|xml|txt|md|svg|toml)$/;
for (const f of allFiles.filter((f) => textExt.test(f) || f.endsWith("_headers"))) {
  const text = readFileSync(f, "utf8");
  if (/â€|â‚¹|Â[ ©·]|Ã./.test(text) && !f.endsWith("check.mjs"))
    fail(`${relative(root, f)}: looks like double-encoded UTF-8 (mojibake)`);
}

// --- CSP: inline scripts must be hash-allowed ------------------------------
const policyFiles = ["_headers", "vercel.json"].map((n) => join(root, n)).filter(existsSync);
for (const [file, { html }] of pages) {
  for (const m of html.matchAll(/<script(?![^>]*\ssrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g)) {
    const hash = "sha256-" + createHash("sha256").update(m[1]).digest("base64");
    for (const pf of policyFiles)
      if (!readFileSync(pf, "utf8").includes(hash))
        fail(`${relative(root, file)}: inline script hash ${hash} missing from ${relative(root, pf)} (CSP would block it)`);
  }
}

// --- JS syntax ---------------------------------------------------------------
for (const f of allFiles.filter((f) => f.endsWith(".js") || f.endsWith(".mjs"))) {
  try {
    execFileSync(process.execPath, ["--check", f], { stdio: "pipe" });
  } catch (e) {
    fail(`${relative(root, f)}: syntax error\n${e.stderr}`);
  }
}

// --- SEO basics on every public page ----------------------------------------
const sitemap = existsSync(join(root, "sitemap.xml")) ? readFileSync(join(root, "sitemap.xml"), "utf8") : "";
for (const [file, { html }] of pages) {
  const rel = relative(root, file);
  if (rel === "404.html" || rel.startsWith("scripts")) continue;
  const count = (re) => (html.match(re) || []).length;
  if (count(/<h1[\s>]/g) !== 1) fail(`${rel}: expected exactly one <h1>, found ${count(/<h1[\s>]/g)}`);
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  if (!title) fail(`${rel}: missing <title>`);
  else if (title.length > 90) fail(`${rel}: <title> is ${title.length} characters (keep it under ~90)`);
  const desc = (html.match(/<meta\s+name="description"\s+content="([^"]*)"/) || [])[1] || "";
  if (desc.length < 50 || desc.length > 200) fail(`${rel}: meta description is ${desc.length} characters (aim for 50-200)`);
  if (!/<link rel="canonical" href="https:\/\/stegosglobal\.com\//.test(html)) fail(`${rel}: missing canonical link`);
  if (!/property="og:image"/.test(html)) fail(`${rel}: missing og:image`);
  const loc = rel === "index.html" ? "https://stegosglobal.com/" : `https://stegosglobal.com/${rel}`;
  if (!sitemap.includes(`<loc>${loc}</loc>`)) fail(`${rel}: not listed in sitemap.xml (run: npm run generate)`);
}

if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n` + errors.map((e) => "  ✗ " + e).join("\n"));
  process.exit(1);
}
console.log(`✓ ${htmlFiles.length} pages, ${allFiles.length} files checked — no problems`);
