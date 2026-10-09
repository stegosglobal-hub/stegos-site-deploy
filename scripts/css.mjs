#!/usr/bin/env node
/**
 * Compiles Tailwind v4 once per page type:
 *   src/css/entries/<name>.css  →  assets/css/<name>.css   (minified)
 * Each entry scans only its own pages (see the @source lines), so every page loads
 * a small stylesheet containing just the utilities it uses.
 *
 *   node scripts/css.mjs            build all
 *   node scripts/css.mjs --watch    rebuild on change (run `npm run generate` first)
 */
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cli = join(root, "node_modules/@tailwindcss/cli/dist/index.mjs");
if (!existsSync(cli)) {
  console.error("✗ Tailwind is not installed. Run: npm install");
  process.exit(1);
}
const entries = readdirSync(join(root, "src/css/entries")).filter((f) => f.endsWith(".css"));
mkdirSync(join(root, "assets/css"), { recursive: true });
const watch = process.argv.includes("--watch");

for (const file of entries) {
  const args = [cli, "-i", join("src/css/entries", file), "-o", join("assets/css", file)];
  if (watch) {
    spawn(process.execPath, [...args, "--watch"], { cwd: root, stdio: "inherit" });
  } else {
    execFileSync(process.execPath, [...args, "--minify"], { cwd: root, stdio: ["ignore", "ignore", "inherit"] });
    console.log(`✓ assets/css/${file}  (${(statSync(join(root, "assets/css", file)).size / 1024).toFixed(1)} KB)`);
  }
}
