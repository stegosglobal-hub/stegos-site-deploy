#!/usr/bin/env node
/**
 * Copies only the files that should be public into ./dist.
 * Hosts (Vercel / Netlify / Cloudflare Pages) publish ./dist, so dev files —
 * scripts/, .claude/, .github/, package.json, config files — are never served.
 *
 *   node scripts/build.mjs        (also run by `npm run build`)
 *
 * Add a new page or top-level public file to PUBLIC below.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

// every *.html page at the root, plus these:
const PUBLIC = ["assets", "robots.txt", "sitemap.xml", "_headers", "CNAME"];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const pages = readdirSync(root).filter((f) => f.endsWith(".html"));
for (const name of [...pages, ...PUBLIC]) {
  const from = join(root, name);
  if (!existsSync(from)) {
    console.error(`✗ missing public file: ${name}`);
    process.exit(1);
  }
  cpSync(from, join(dist, name), { recursive: true });
}
console.log(`✓ built dist/ (${pages.length} pages + ${PUBLIC.join(", ")})`);
