#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Helper functions
function read(p) {
  return fs.readFileSync(p, "utf8");
}

function write(p, s) {
  fs.writeFileSync(p, s, "utf8");
}

function arg(name, def) {
  const a = process.argv.find(x => x.startsWith(`--${name}=`));
  return a ? a.split("=")[1] : def;
}

// Get CLI/ENV arguments with defaults
const theme = arg("theme", process.env.THEME || "light");
const lang = arg("lang", process.env.LANG || "uk");

console.log(`[build] Starting build with theme="${theme}" lang="${lang}"`);

// All built-in themes from daisyUI v5 with color indicators and mode
const builtInThemes = [
  // Light themes
  { id: "light", name: "light", mode: "light", colors: ["#570df8", "#f000b8", "#37cdbe", "#fbbf24"] },
  { id: "cupcake", name: "cupcake", mode: "light", colors: ["#65c3c8", "#ef9fbc", "#eeaf3a", "#fbbf24"] },
  { id: "bumblebee", name: "bumblebee", mode: "light", colors: ["#e0a82e", "#f9d72f", "#181830", "#fbbf24"] },
  { id: "emerald", name: "emerald", mode: "light", colors: ["#66cc8a", "#377cfb", "#ea5234", "#fbbf24"] },
  { id: "corporate", name: "corporate", mode: "light", colors: ["#4b6bfb", "#7b92b2", "#67cba0", "#fbbf24"] },
  { id: "retro", name: "retro", mode: "light", colors: ["#ef9995", "#a4cbb4", "#fbbf24", "#fbbf24"] },
  { id: "valentine", name: "valentine", mode: "light", colors: ["#e96d7b", "#a991f7", "#88dbdd", "#fbbf24"] },
  { id: "garden", name: "garden", mode: "light", colors: ["#5c7f67", "#ecf4e7", "#fbbf24", "#fbbf24"] },
  { id: "aqua", name: "aqua", mode: "light", colors: ["#09ecf3", "#966fb3", "#fef3c7", "#fbbf24"] },
  { id: "pastel", name: "pastel", mode: "light", colors: ["#d1c1d7", "#f6cbd1", "#b4e9d6", "#fbbf24"] },
  { id: "fantasy", name: "fantasy", mode: "light", colors: ["#6e0b75", "#007ebd", "#fbbf24", "#fbbf24"] },
  { id: "wireframe", name: "wireframe", mode: "light", colors: ["#b8b8b8", "#b8b8b8", "#b8b8b8", "#fbbf24"] },
  { id: "cmyk", name: "cmyk", mode: "light", colors: ["#45AEEE", "#E8488A", "#FFF232", "#fbbf24"] },
  { id: "autumn", name: "autumn", mode: "light", colors: ["#8C0327", "#D85251", "#fbbf24", "#fbbf24"] },
  { id: "acid", name: "acid", mode: "light", colors: ["#FF00F4", "#FF7400", "#FFED00", "#fbbf24"] },
  { id: "lemonade", name: "lemonade", mode: "light", colors: ["#519903", "#fbbf24", "#fbbf24", "#fbbf24"] },
  { id: "winter", name: "winter", mode: "light", colors: ["#047AFF", "#463AA2", "#C148AC", "#fbbf24"] },
  { id: "nord", name: "nord", mode: "light", colors: ["#5E81AC", "#BF616A", "#A3BE8C", "#fbbf24"] },
  { id: "sunset", name: "sunset", mode: "light", colors: ["#FF6B35", "#004E89", "#fbbf24", "#fbbf24"] },
  { id: "lofi", name: "lofi", mode: "light", colors: ["#0D0D0D", "#0D0D0D", "#0D0D0D", "#fbbf24"] },
  
  // Dark themes
  { id: "dark", name: "dark", mode: "dark", colors: ["#661AE6", "#D926AA", "#1FB2A6", "#fbbf24"] },
  { id: "synthwave", name: "synthwave", mode: "dark", colors: ["#e779c1", "#58c7f3", "#f4f019", "#fbbf24"] },
  { id: "cyberpunk", name: "cyberpunk", mode: "dark", colors: ["#ff7598", "#75d1f0", "#fbbf24", "#fbbf24"] },
  { id: "halloween", name: "halloween", mode: "dark", colors: ["#f28c18", "#6d3a9c", "#51a800", "#fbbf24"] },
  { id: "forest", name: "forest", mode: "dark", colors: ["#1eb854", "#1db88e", "#fbbf24", "#fbbf24"] },
  { id: "black", name: "black", mode: "dark", colors: ["#373737", "#373737", "#373737", "#fbbf24"] },
  { id: "luxury", name: "luxury", mode: "dark", colors: ["#ffffff", "#ffffff", "#ffffff", "#fbbf24"] },
  { id: "dracula", name: "dracula", mode: "dark", colors: ["#ff79c6", "#bd93f9", "#50fa7b", "#fbbf24"] },
  { id: "business", name: "business", mode: "dark", colors: ["#1C4E80", "#7C909A", "#EA6947", "#fbbf24"] },
  { id: "night", name: "night", mode: "dark", colors: ["#38bdf8", "#818cf8", "#f471b5", "#fbbf24"] },
  { id: "coffee", name: "coffee", mode: "dark", colors: ["#DB924B", "#263E3F", "#fbbf24", "#fbbf24"] },
  { id: "dim", name: "dim", mode: "dark", colors: ["#9FE88D", "#FF7D87", "#FDDD8E", "#fbbf24"] },
  
  // Custom
  { id: "evo", name: "evo", mode: "light", colors: ["#667eea", "#764ba2", "#f093fb", "#4facfe"] }
];

// Animated backgrounds
const backgrounds = [
  { id: "none", name: "None", icon: "⬜" },
  { id: "gradient-spheres", name: "Gradient Spheres", icon: "🌈" },
  { id: "colorful-dots", name: "Colorful Dots", icon: "✨" },
  { id: "cosmic-dream", name: "Cosmic Dream", icon: "🌌" }
];

// Read template files
console.log("[build] Reading template files...");
let base = read(path.join(root, "src/templates/base.html"));
const navbar = read(path.join(root, "src/components/navbar.html"));
const footer = read(path.join(root, "src/components/footer.html"));
const content = read(path.join(root, "src/content/home.html"));
const settings = read(path.join(root, "src/components/settings.html"));

// Inject component placeholders
console.log("[build] Composing components...");
base = base
  .replace("<!-- @@NAVBAR -->", navbar)
  .replace("<!-- @@FOOTER -->", footer)
  .replace("<!-- @@CONTENT -->", content)
  .replace("<!-- @@SETTINGS -->", settings)
  .replace(/\[\[THEME\]\]/g, theme)
  .replace(/\[\[LANG\]\]/g, lang);

// Inject theme options into theme menu (navbar) - will be filtered by JS
console.log("[build] Injecting theme options...");
const themeMenuItems = builtInThemes
  .map(t => `<li data-mode="${t.mode}" class="theme-item">
          <button onclick="__setTheme('${t.id}')" class="flex w-full items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:shadow-sm" data-theme="${t.id}">
            <svg class="h-6 w-6 flex-shrink-0 rounded-md overflow-hidden shadow-sm" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="${t.colors[0]}"/>
              <circle cx="28" cy="28" r="9" fill="${t.colors[1]}"/>
              <circle cx="52" cy="28" r="9" fill="${t.colors[2]}"/>
              <circle cx="28" cy="52" r="9" fill="${t.colors[3]}"/>
              <circle cx="52" cy="52" r="9" fill="oklch(from ${t.colors[0]} calc(l - 0.15) c h)"/>
            </svg>
            <span class="flex-1 text-left text-sm capitalize theme-name">${t.name}</span>
            <svg class="h-3.5 w-3.5 flex-shrink-0 opacity-0 theme-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </li>`)
  .join("\n        ");

base = base.replace(
  /(<ul[^>]*id="themeMenu"[^>]*>[\s\S]*?<li[^>]*>[\s\S]*?<\/li>)([\s\S]*?)(<\/ul>)/,
  (_, open, _inner, close) => open + "\n        " + themeMenuItems + "\n      " + close
);

// Inject theme options into settings select
const themeOptions = builtInThemes
  .map(t => `<option value="${t.id}">${t.name.charAt(0).toUpperCase() + t.name.slice(1)}</option>`)
  .join("\n        ");

base = base.replace(
  /(<select[^>]*id="settings_theme"[^>]*>)([\s\S]*?)(<\/select>)/g,
  (_, open, _inner, close) => open + "\n        " + themeOptions + "\n      " + close
);

// Inject background options into settings select
console.log("[build] Injecting background options...");
const backgroundOptions = backgrounds
  .map(bg => `<option value="${bg.id}">${bg.icon} ${bg.name}</option>`)
  .join("\n        ");

base = base.replace(
  /(<select[^>]*id="settings_background"[^>]*>)([\s\S]*?)(<\/select>)/g,
  (_, open, _inner, close) => open + "\n        " + backgroundOptions + "\n      " + close
);

// Ensure dist directory exists
fs.mkdirSync(path.join(root, "dist"), { recursive: true });

// Write output
const outputPath = path.join(root, "dist/index.html");
write(outputPath, base);

const lightThemes = builtInThemes.filter(t => t.mode === 'light').length;
const darkThemes = builtInThemes.filter(t => t.mode === 'dark').length;

console.log(`[build] ✓ Successfully built index.html`);
console.log(`[build] ✓ Theme: ${theme}`);
console.log(`[build] ✓ Language: ${lang}`);
console.log(`[build] ✓ Total themes: ${builtInThemes.length} (${lightThemes} light + ${darkThemes} dark)`);
console.log(`[build] ✓ Total backgrounds available: ${backgrounds.length}`);
console.log(`[build] ✓ Output: ${outputPath}`);

