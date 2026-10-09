#!/usr/bin/env node
/**
 * Copies the GSAP files the site uses from node_modules into assets/vendor/ so they are
 * served from our own origin (the CSP only allows scripts from 'self').
 * The copies are committed, so a deploy works even without running `npm install`.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "assets/vendor");
mkdirSync(out, { recursive: true });
for (const f of ["gsap.min.js", "ScrollTrigger.min.js"]) {
  copyFileSync(join(root, "node_modules/gsap/dist", f), join(out, f));
  console.log(`✓ assets/vendor/${f}`);
}
