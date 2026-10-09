#!/usr/bin/env node
/**
 * Cache-busting without a bundler.
 * Rewrites every  assets/**.css|js  reference in the HTML files to carry a
 * content hash:  assets/js/main.js?v=3fa9c1d2
 * Because the URL changes whenever the file changes, browsers and CDNs can cache
 * assets for a long time and visitors never get stale code.
 *
 *   node scripts/stamp.mjs          rewrite the HTML files
 *   node scripts/stamp.mjs --check  exit 1 if any reference is stale (CI)
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");

const htmlFiles = readdirSync(root).filter((f) => f.endsWith(".html"));
const ref = /((?:\/)?assets\/[^"'?\s]+\.(?:css|js))(\?v=[0-9a-f]+)?/g;

let stale = 0;
for (const file of htmlFiles) {
  const path = join(root, file);
  const before = readFileSync(path, "utf8");
  const after = before.replace(ref, (_, assetPath) => {
    const disk = join(root, assetPath.replace(/^\//, ""));
    if (!existsSync(disk)) {
      console.error(`✗ ${file}: missing asset ${assetPath}`);
      stale++;
      return assetPath;
    }
    // Hash with line endings normalised, so Windows (CRLF) and Linux/CI (LF) checkouts
    // produce the same stamp and `npm run check` doesn't flag phantom changes.
    const content = readFileSync(disk, "utf8").replace(/\r\n/g, "\n");
    const hash = createHash("sha1").update(content).digest("hex").slice(0, 8);
    return `${assetPath}?v=${hash}`;
  });
  if (after !== before) {
    if (checkOnly) {
      console.error(`✗ ${file}: asset version stamps are stale — run: npm run stamp`);
      stale++;
    } else {
      writeFileSync(path, after);
      console.log(`✓ stamped ${file}`);
    }
  } else {
    console.log(`✓ ${file} up to date`);
  }
}
process.exit(stale ? 1 : 0);
