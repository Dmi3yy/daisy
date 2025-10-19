#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

console.log("[inline] Starting CSS inlining process...");

const htmlPath = path.join(root, "dist/index.html");
const cssPath = path.join(root, "dist/styles.css");
const outputPath = path.join(root, "dist/index.inline.html");

// Check if files exist
if (!fs.existsSync(htmlPath)) {
  console.error(`[inline] ✗ Error: ${htmlPath} not found. Run 'npm run build:html' first.`);
  process.exit(1);
}

if (!fs.existsSync(cssPath)) {
  console.error(`[inline] ✗ Error: ${cssPath} not found. Run 'npm run build:css' first.`);
  process.exit(1);
}

console.log("[inline] Reading HTML and CSS files...");
const html = fs.readFileSync(htmlPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

console.log("[inline] Inlining CSS into HTML...");
const cssLinkPattern = /\s*<link[^>]*id="evo-external-css"[^>]*>\s*/g;
const htmlWithoutLink = html.replace(cssLinkPattern, "\n");
const inlined = htmlWithoutLink.replace(
  /(<style id="evo-inline-css">)([\s\S]*?)(<\/style>)/,
  (_, start, _content, end) => `${start}${css}${end}`
);

console.log("[inline] Writing inlined HTML...");
fs.writeFileSync(outputPath, inlined, "utf8");

const htmlSize = (fs.statSync(htmlPath).size / 1024).toFixed(2);
const cssSize = (fs.statSync(cssPath).size / 1024).toFixed(2);
const inlinedSize = (fs.statSync(outputPath).size / 1024).toFixed(2);

console.log(`[inline] ✓ Successfully created index.inline.html`);
console.log(`[inline] ✓ Original HTML: ${htmlSize} KB`);
console.log(`[inline] ✓ CSS: ${cssSize} KB`);
console.log(`[inline] ✓ Inlined HTML: ${inlinedSize} KB`);
console.log(`[inline] ✓ Output: ${outputPath}`);
console.log(`[inline] ℹ Note: This file is fully self-contained and doesn't require external CSS`);

