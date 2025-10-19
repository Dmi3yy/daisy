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
const theme = arg("theme", process.env.THEME || "light-evo");
const lang = arg("lang", process.env.LANG || "uk");
const keepCss = (arg("keep-css", process.env.KEEP_CSS || "false") || "false") === "true";

console.log(`[build] Starting build with theme="${theme}" lang="${lang}"`);

// Function to read all theme JSON files from a directory
function loadThemesFromDirectory(dirPath) {
  const themes = [];
  if (!fs.existsSync(dirPath)) {
    return themes;
  }
  
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    // Якщо це папка, шукаємо теми всередині (наприклад themes/evo/light.json)
    if (stat.isDirectory()) {
      const subFiles = fs.readdirSync(filePath);
      for (const subFile of subFiles) {
        if (subFile.endsWith('.json')) {
          const subFilePath = path.join(filePath, subFile);
          try {
            const themeData = JSON.parse(fs.readFileSync(subFilePath, 'utf8'));
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
              file: `${file}/${subFile}`
            });
          } catch (err) {
            console.warn(`[build] Warning: Could not parse ${file}/${subFile}: ${err.message}`);
          }
        }
      }
    } else if (file.endsWith('.json')) {
      // Звичайний JSON файл
      try {
        const themeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
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
const evoThemesPath = path.join(root, "themes/evo");

let lightThemes = loadThemesFromDirectory(lightThemesPath);
let darkThemes = loadThemesFromDirectory(darkThemesPath);

// Load EVO themes from themes/evo folder
const evoThemes = loadThemesFromDirectory(evoThemesPath);
for (const theme of evoThemes) {
  if (theme.name === 'light-evo') {
    lightThemes.unshift(theme); // Додаємо на початок
  } else if (theme.name === 'dark-evo') {
    darkThemes.unshift(theme); // Додаємо на початок
  }
}

// Sort: EVO themes first, then alphabetically
const sortThemes = (themes) => {
  return themes.sort((a, b) => {
    const aIsEvo = a.id.includes('evo');
    const bIsEvo = b.id.includes('evo');
    if (aIsEvo && !bIsEvo) return -1;
    if (!aIsEvo && bIsEvo) return 1;
    return a.id.localeCompare(b.id);
  });
};

sortThemes(lightThemes);
sortThemes(darkThemes);

// Add built-in daisyUI themes
const builtInLightThemes = [
  { id: 'light', name: 'light', colors: ['#ffffff', '#570df8', '#f000b8', '#1dcdbc', '#f2f2f2'] },
  { id: 'cupcake', name: 'cupcake', colors: ['#faf7f5', '#65c3c8', '#ef9fbc', '#eeaf3a', '#e7e7e8'] },
  { id: 'bumblebee', name: 'bumblebee', colors: ['#fffbeb', '#f59e0b', '#facc15', '#0ea5e9', '#fef3c7'] },
  { id: 'emerald', name: 'emerald', colors: ['#ffffff', '#10b981', '#8b5cf6', '#06b6d4', '#f3f4f6'] },
  { id: 'corporate', name: 'corporate', colors: ['#ffffff', '#1f2937', '#4b5563', '#3b82f6', '#e5e7eb'] },
  { id: 'retro', name: 'retro', colors: ['#f9f7f3', '#ef9995', '#a4cbb4', '#e4d8b4', '#e6e4da'] },
  { id: 'valentine', name: 'valentine', colors: ['#fef2f2', '#e96d7b', '#f8b4d9', '#67cba0', '#fce7f3'] },
  { id: 'garden', name: 'garden', colors: ['#ffffff', '#16a34a', '#f59e0b', '#06b6d4', '#f3f4f6'] },
  { id: 'pastel', name: 'pastel', colors: ['#ffffff', '#a991f7', '#f6d860', '#37cdbe', '#f3f4f6'] },
  { id: 'fantasy', name: 'fantasy', colors: ['#ffffff', '#6e0b75', '#007ebd', '#d82222', '#f3f4f6'] },
  { id: 'wireframe', name: 'wireframe', colors: ['#ffffff', '#000000', '#000000', '#000000', '#f3f4f6'] },
  { id: 'cmyk', name: 'cmyk', colors: ['#ffffff', '#45AEEE', '#E8488A', '#FFF232', '#f3f4f6'] },
  { id: 'autumn', name: 'autumn', colors: ['#ffffff', '#8C0327', '#d97706', '#16a34a', '#f3f4f6'] },
  { id: 'acid', name: 'acid', colors: ['#fafafa', '#d9f99d', '#facc15', '#ec4899', '#f5f5f5'] },
  { id: 'lemonade', name: 'lemonade', colors: ['#ffffff', '#16a34a', '#a3e635', '#facc15', '#f3f4f6'] },
  { id: 'winter', name: 'winter', colors: ['#ffffff', '#047AFF', '#463AA2', '#5390D9', '#f3f4f6'] },
  { id: 'nord', name: 'nord', colors: ['#ffffff', '#5E81AC', '#81A1C1', '#8FBCBB', '#f3f4f6'] },
  { id: 'lofi', name: 'lofi', colors: ['#ffffff', '#000000', '#808080', '#000000', '#f3f4f6'] }
];

const builtInDarkThemes = [
  { id: 'dark', name: 'dark', colors: ['#2a303c', '#38bdf8', '#818cf8', '#f471b5', '#242933'] },
  { id: 'synthwave', name: 'synthwave', colors: ['#1a103d', '#e779c1', '#58c7f3', '#f6d860', '#261754'] },
  { id: 'cyberpunk', name: 'cyberpunk', colors: ['#1a103d', '#ff7598', '#ffee00', '#79f2c0', '#261754'] },
  { id: 'halloween', name: 'halloween', colors: ['#1f2029', '#ff9f1c', '#8b5cf6', '#ec4899', '#25252d'] },
  { id: 'forest', name: 'forest', colors: ['#171212', '#06b6d4', '#8b5cf6', '#059669', '#1e1e1e'] },
  { id: 'aqua', name: 'aqua', colors: ['#09161d', '#00b4d8', '#8b5cf6', '#ec4899', '#0d2633'] },
  { id: 'black', name: 'black', colors: ['#000000', '#cccccc', '#ffffff', '#ffffff', '#1a1a1a'] },
  { id: 'luxury', name: 'luxury', colors: ['#09090b', '#ffffff', '#d4af37', '#14b8a6', '#18181b'] },
  { id: 'dracula', name: 'dracula', colors: ['#282a36', '#ff79c6', '#bd93f9', '#ffb86c', '#1e1f29'] },
  { id: 'business', name: 'business', colors: ['#1f2937', '#3b82f6', '#6366f1', '#06b6d4', '#1a202c'] },
  { id: 'night', name: 'night', colors: ['#0f172a', '#3b82f6', '#8b5cf6', '#ec4899', '#0a0f1f'] },
  { id: 'coffee', name: 'coffee', colors: ['#282828', '#db924b', '#e25c3b', '#20282c', '#32302f'] },
  { id: 'dim', name: 'dim', colors: ['#1e2837', '#9fdf9f', '#6699cc', '#ff9999', '#15202b'] },
  { id: 'sunset', name: 'sunset', colors: ['#1b1d28', '#ff865b', '#ff6b6b', '#ffc845', '#1f222e'] }
];

// Merge with JSON themes, EVO themes first
lightThemes.push(...builtInLightThemes.filter(t => !lightThemes.find(lt => lt.id === t.id)));
darkThemes.push(...builtInDarkThemes.filter(t => !darkThemes.find(dt => dt.id === t.id)));

const builtInThemes = [...lightThemes, ...darkThemes];

console.log(`[build] ✓ Loaded ${lightThemes.length} light themes and ${darkThemes.length} dark themes from JSON files`);

// Animated backgrounds
const backgrounds = [
  { id: "none", name: "None", icon: "⬜" },
  { id: "gradient-spheres", name: "Gradient Spheres", icon: "🌈" },
  { id: "magic", name: "Magic Aurora", icon: "🪄" },
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

// Inline CSS if available
const cssPath = path.join(root, "dist/styles.css");
let inlineCss = "";

if (fs.existsSync(cssPath)) {
  console.log(`[build] Inlining CSS from ${cssPath}`);
  inlineCss = read(cssPath);
} else {
  console.warn(`[build] ⚠ Warning: ${cssPath} not found. Inline styles placeholder will remain.`);
}

base = base.replace("/* @@INLINE_CSS */", inlineCss);

if (!keepCss && fs.existsSync(cssPath)) {
  fs.unlinkSync(cssPath);
  console.log(`[build] ✓ Removed ${cssPath} after inlining`);
} else if (keepCss) {
  console.log("[build] ℹ Preserving dist/styles.css (keep-css enabled)");
}

// Write output
const outputPath = path.join(root, "dist/index.html");
write(outputPath, base);

console.log(`[build] ✓ Successfully built index.html`);
console.log(`[build] ✓ Theme: ${theme}`);
console.log(`[build] ✓ Language: ${lang}`);
console.log(`[build] ✓ Total themes: ${builtInThemes.length} (${lightThemes.length} light + ${darkThemes.length} dark)`);
console.log(`[build] ✓ Total backgrounds available: ${backgrounds.length}`);
console.log(`[build] ✓ Output: ${outputPath}`);

