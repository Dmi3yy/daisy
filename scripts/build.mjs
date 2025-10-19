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

// Function to read all theme JSON files from a directory
function loadThemesFromDirectory(dirPath) {
  const themes = [];
  if (!fs.existsSync(dirPath)) {
    return themes;
  }
  
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(dirPath, file);
      try {
        const themeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        // Extract real theme colors from JSON (OKLCH format supported by modern browsers)
        const colors = themeData.colors || {};
        const themeColors = [
          colors['--color-base-100'] || 'oklch(100% 0 0)',
          colors['--color-primary'] || 'oklch(70% 0.15 220)',
          colors['--color-secondary'] || 'oklch(70% 0.15 280)',
          colors['--color-accent'] || 'oklch(70% 0.15 160)',
          colors['--color-base-200'] || 'oklch(95% 0 0)'
        ];
        themes.push({
          id: themeData.name,
          name: themeData.name,
          mode: themeData.mode,
          colors: themeColors,
          primaryColor: colors['--color-primary'] || 'oklch(70% 0.15 220)',
          navbar: themeData.navbar || { light: '#ffffff', dark: '#1e1e1e' },
          file: file
        });
      } catch (err) {
        console.warn(`[build] Warning: Could not parse ${file}: ${err.message}`);
      }
    }
  }
  return themes;
}

// Load all themes from JSON files
console.log("[build] Loading themes from JSON files...");
const lightThemesPath = path.join(root, "themes/light");
const darkThemesPath = path.join(root, "themes/dark");

const lightThemes = loadThemesFromDirectory(lightThemesPath);
const darkThemes = loadThemesFromDirectory(darkThemesPath);

const builtInThemes = [...lightThemes, ...darkThemes];

console.log(`[build] ✓ Loaded ${lightThemes.length} light themes and ${darkThemes.length} dark themes from JSON files`);

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

// Read middleDaisy components
let middleDaisy = read(path.join(root, "src/components/middleDaisy.html"));

// Read middleDaisy editor components
const editorHeader = read(path.join(root, "src/components/middleDaisy/editor/header.html"));
const editorColors = read(path.join(root, "src/components/middleDaisy/editor/colors-section.html"));
const editorRadius = read(path.join(root, "src/components/middleDaisy/editor/radius-section.html"));
const editorEffects = read(path.join(root, "src/components/middleDaisy/editor/effects-section.html"));
const editorOptions = read(path.join(root, "src/components/middleDaisy/editor/options-section.html"));

// Read middleDaisy preview components
const previewFilterCard = read(path.join(root, "src/components/middleDaisy/preview/filter-card.html"));
const previewCalendar = read(path.join(root, "src/components/middleDaisy/preview/calendar-card.html"));
const previewTabs = read(path.join(root, "src/components/middleDaisy/preview/tabs-example.html"));
const previewPriceRange = read(path.join(root, "src/components/middleDaisy/preview/price-range-card.html"));
const previewProductCard = read(path.join(root, "src/components/middleDaisy/preview/product-card.html"));
const previewSearchForm = read(path.join(root, "src/components/middleDaisy/preview/search-form.html"));
const previewChartsCard = read(path.join(root, "src/components/middleDaisy/preview/charts-card.html"));
const previewPageScore = read(path.join(root, "src/components/middleDaisy/preview/page-score-card.html"));
const previewRecentOrders = read(path.join(root, "src/components/middleDaisy/preview/recent-orders-card.html"));
const previewRevenueStat = read(path.join(root, "src/components/middleDaisy/preview/revenue-stat.html"));
const previewRegisterForm = read(path.join(root, "src/components/middleDaisy/preview/register-form.html"));
const previewWritePost = read(path.join(root, "src/components/middleDaisy/preview/write-post-form.html"));
const previewChatBubbles = read(path.join(root, "src/components/middleDaisy/preview/chat-bubbles.html"));
const previewDockNav = read(path.join(root, "src/components/middleDaisy/preview/dock-nav.html"));
const previewAdminMenu = read(path.join(root, "src/components/middleDaisy/preview/admin-menu.html"));
const previewMediaPlayer = read(path.join(root, "src/components/middleDaisy/preview/media-player.html"));
const previewCodeMockup = read(path.join(root, "src/components/middleDaisy/preview/code-mockup.html"));
const previewAlerts = read(path.join(root, "src/components/middleDaisy/preview/alerts.html"));
const previewTimeline = read(path.join(root, "src/components/middleDaisy/preview/timeline.html"));
const previewPricingCard = read(path.join(root, "src/components/middleDaisy/preview/pricing-card.html"));

// Compose middleDaisy component
console.log("[build] Composing middleDaisy components...");
middleDaisy = middleDaisy
  .replace("<!-- @@MIDDLEDAISY_EDITOR_HEADER -->", editorHeader)
  .replace("<!-- @@MIDDLEDAISY_EDITOR_COLORS -->", editorColors)
  .replace("<!-- @@MIDDLEDAISY_EDITOR_RADIUS -->", editorRadius)
  .replace("<!-- @@MIDDLEDAISY_EDITOR_EFFECTS -->", editorEffects)
  .replace("<!-- @@MIDDLEDAISY_EDITOR_OPTIONS -->", editorOptions)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_FILTER_CARD -->", previewFilterCard)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_CALENDAR_CARD -->", previewCalendar)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_TABS -->", previewTabs)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_PRICE_RANGE -->", previewPriceRange)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_PRODUCT_CARD -->", previewProductCard)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_SEARCH_FORM -->", previewSearchForm)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_CHARTS_CARD -->", previewChartsCard)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_PAGE_SCORE -->", previewPageScore)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_RECENT_ORDERS -->", previewRecentOrders)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_REVENUE_STAT -->", previewRevenueStat)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_REGISTER_FORM -->", previewRegisterForm)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_WRITE_POST -->", previewWritePost)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_CHAT_BUBBLES -->", previewChatBubbles)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_DOCK_NAV -->", previewDockNav)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_ADMIN_MENU -->", previewAdminMenu)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_MEDIA_PLAYER -->", previewMediaPlayer)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_CODE_MOCKUP -->", previewCodeMockup)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_ALERTS -->", previewAlerts)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_TIMELINE -->", previewTimeline)
  .replace("<!-- @@MIDDLEDAISY_PREVIEW_PRICING_CARD -->", previewPricingCard);

// Inject component placeholders
console.log("[build] Composing components...");
base = base
  .replace("<!-- @@NAVBAR -->", navbar)
  .replace("<!-- @@FOOTER -->", footer)
  .replace("<!-- @@CONTENT -->", content)
  .replace("<!-- @@SETTINGS -->", settings)
  .replace("<!-- @@MIDDLEDAISY -->", middleDaisy)
  .replace(/\[\[THEME\]\]/g, theme)
  .replace(/\[\[LANG\]\]/g, lang);

// Inject theme options into theme menu (navbar) - will be filtered by JS
console.log("[build] Injecting theme options...");
const themeMenuItems = builtInThemes
  .map(t => `<li data-mode="${t.mode}" class="theme-item">
          <button data-set-theme="${t.id}" data-act-class="active" class="flex w-full items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:shadow-sm">
            <svg class="h-6 w-6 flex-shrink-0 rounded-md overflow-hidden shadow-sm" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="${t.colors[0]}"/>
              <circle cx="28" cy="28" r="9" fill="${t.colors[1]}"/>
              <circle cx="52" cy="28" r="9" fill="${t.colors[2]}"/>
              <circle cx="28" cy="52" r="9" fill="${t.colors[3]}"/>
              <circle cx="52" cy="52" r="9" fill="${t.colors[4]}"/>
            </svg>
            <span class="flex-1 text-left text-sm capitalize theme-name" style="color: ${t.primaryColor}">${t.name}</span>
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

// Inject theme lists for Evo Auto mode
const lightThemesList = lightThemes.map(t => t.id);
const darkThemesList = darkThemes.map(t => t.id);

base = base.replace(
  "/* @@THEME_LISTS */",
  `const __lightThemes = ${JSON.stringify(lightThemesList)};
      const __darkThemes = ${JSON.stringify(darkThemesList)};`
);

// Write output
const outputPath = path.join(root, "dist/index.html");
write(outputPath, base);

console.log(`[build] ✓ Successfully built index.html`);
console.log(`[build] ✓ Theme: ${theme}`);
console.log(`[build] ✓ Language: ${lang}`);
console.log(`[build] ✓ Total themes: ${builtInThemes.length} (${lightThemes.length} light + ${darkThemes.length} dark)`);
console.log(`[build] ✓ Total backgrounds available: ${backgrounds.length}`);
console.log(`[build] ✓ Output: ${outputPath}`);

