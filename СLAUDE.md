DAISY Evolution Build — PRD (CloudMD)

Versioning (must-have):
•	Tailwind CSS: ^4.1.x (вимагається для DaisyUI v5)  ￼
•	daisyUI: ^5.7.x (гілка v5, сумісна з Tailwind v4; див. upgrade guide)  ￼
•	Node: >=18 (рекомендація для сучасних CLI, щоб уникати ESM/FS проблем)

Примітка: daisyUI 5 офіційно таргетить Tailwind v4; якщо мігруємо з v3 — див. upgrade guide.  ￼

⸻

1. Мета

Зробити збірку “Evolution”, яка:
1.	Складає сторінки з HTML-компонентів (drop-in фрагменти).
2.	Компілює Tailwind v4 + daisyUI v5.7 у єдиний CSS, а потім інлайнить стилі у вихідний index.inline.html.
3.	Має стандартний Navbar із:
•	Перемикачем тем (усі базові теми + кастомні).
•	Перемикачем мови (i18n).
•	Вибором колірної гами (palette / accent / semantic).
•	Панель налаштувань теми (повний набір controls з Theme Builder: радіуси, розміри, border, depth, noise тощо).  ￼
4.	Приймає вхідні параметри (CLI/ENV) для генерації сторінки/теми на льоту.

⸻

2. Зона відповідальності (Scope)

Включено
•	Мінімальний білдер без Webpack/Vite: Tailwind CLI + невеликий Node-скрипт.
•	Композиція HTML із компонентів: @@NAVBAR, @@FOOTER, @@CONTENT маркери.
•	Theme System:
•	Підключення усіх вбудованих тем daisyUI + можливість кастомної теми.  ￼
•	Theme Builder controls (radius, size, border, depth, noise, base/semantic colors) на UI.  ￼
•	Language Switcher із локальним зберіганням вибору.
•	Inline CSS (пост-процес інлайнингу).
•	One-shot artifact: dist/index.inline.html.

Не включено (поки)
•	Runtime i18n із зовнішніх джерел (файли перекладів) — базовий механізм, без бекенду.
•	Будь-які SPA-framework інтеграції.

⸻

3. Структура репозиторію
   evo-daisy/
   ├─ package.json
   ├─ tailwind.config.js            # v4 syntax (@import plugins у CSS)
   ├─ src/
   │  ├─ app.css                    # Tailwind + @plugin daisyUI
   │  ├─ templates/
   │  │  └─ base.html
   │  ├─ components/
   │  │  ├─ navbar.html
   │  │  └─ footer.html
   │  └─ content/
   │     └─ home.html
   ├─ scripts/
   │  ├─ build.mjs                  # compose HTML + theming
   │  └─ inline.mjs                 # inline CSS -> index.inline.html
   └─ dist/

4. Конфігурація Tailwind v4 + daisyUI v5.7

У v4 конфіг переноситься в CSS через директиви @import / @plugin. daisyUI 5 підтримує теми й кастомізацію через CSS-змінні / плагін.  ￼

src/app.css
@import "tailwindcss";
@plugin "daisyui";

/* Enable all built-in themes (optional helper) */
@plugin "daisyui/themes";

/* Example: custom theme 'evo' via Theme API */
@plugin "daisyui/theme" {
name: "evo";
default: false;
prefersdark: false;
color-scheme: light;

/* Base & content */
--color-base-100: oklch(98% 0.02 240);
--color-base-200: oklch(95% 0.03 240);
--color-base-300: oklch(92% 0.04 240);
--color-base-content: oklch(20% 0.05 240);

/* Brand & semantic */
--color-primary: oklch(55% 0.30 260);
--color-primary-content: oklch(98% 0.01 260);
--color-secondary: oklch(70% 0.25 200);
--color-accent: oklch(65% 0.25 160);
--color-neutral: oklch(50% 0.05 240);
--color-info: oklch(70% 0.20 220);
--color-success: oklch(65% 0.25 140);
--color-warning: oklch(80% 0.25  80);
--color-error:   oklch(65% 0.30  30);

/* Theme-builder knobs */
--radius-selector: 1rem;
--radius-field: .25rem;
--radius-box: .5rem;
--size-selector: .25rem;
--size-field: .25rem;
--border: 1px;
--depth: 1;
--noise: 0;
}

/* Optional: dark alias via @custom-variant (docs example) */
/* Add if we want Tailwind's `dark:` to map to a specific theme */
@custom-variant dark (&:where([data-theme=night], [data-theme=night] *));

API тем (змінні, builder-knobs і підключення тем) базуються на офіційних прикладах/доках Themes (включно з custom theme блоком та variant mapping).  ￼

⸻

5. Командний інтерфейс (CLI)

package.json (scripts)
{
"scripts": {
"clean": "rm -rf dist && mkdir -p dist",
"build:css": "tailwindcss -i ./src/app.css -o ./dist/styles.css --minify",
"build:html": "node ./scripts/build.mjs --theme=${THEME:-light} --lang=${LANG:-uk} --palette=${PALETTE:-default}",
"build:inline": "node ./scripts/inline.mjs",
"build": "npm run clean && npm run build:css && npm run build:html && npm run build:inline",
"dev": "tailwindcss -i ./src/app.css -o ./dist/styles.css --watch"
},
"devDependencies": {
"tailwindcss": "^4.1.14"
},
"dependencies": {
"daisyui": "^5.7.0",
"juice": "^10.0.0"
}
}

	•	Параметри:
	•	THEME — ім’я теми (light, dark, evo, будь-яка built-in).  ￼
	•	LANG — локаль (uk, en, pl, …).
	•	PALETTE — попередньо визначена колірна палітра (див. розд. 7).

⸻

6. Збирання HTML

src/templates/base.html

<!DOCTYPE html>
<html lang="[[LANG]]" data-theme="[[THEME]]">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Evolution + DaisyUI 5.7</title>
  <link rel="stylesheet" href="./styles.css" />
  <script>
    (function () {
      const themeKey = "evo-theme";
      const langKey = "evo-lang";
      const storedTheme = localStorage.getItem(themeKey);
      const storedLang = localStorage.getItem(langKey);
      if (storedTheme) document.documentElement.setAttribute("data-theme", storedTheme);
      if (storedLang) document.documentElement.setAttribute("lang", storedLang);

      window.__setTheme = function (t) {
        document.documentElement.setAttribute("data-theme", t);
        localStorage.setItem(themeKey, t);
      }
      window.__setLang = function (l) {
        document.documentElement.setAttribute("lang", l);
        localStorage.setItem(langKey, l);
      }
    })();
  </script>
</head>
<body class="bg-base-100 text-base-content min-h-screen">
  <!-- @@NAVBAR -->
  <main class="container mx-auto px-4 py-8">
    <!-- @@CONTENT -->
  </main>
  <!-- @@FOOTER -->
</body>
</html>


NAVBAR

<div class="navbar bg-base-200">
  <div class="navbar-start">
    <a class="btn btn-ghost text-xl">Evolution</a>
  </div>

  <div class="navbar-center">
    <ul class="menu menu-horizontal px-1">
      <li><a>Home</a></li>
      <li><a>Docs</a></li>
      <li><a>Components</a></li>
    </ul>
  </div>

  <div class="navbar-end gap-2">
    <!-- Theme select -->
    <select class="select select-bordered" id="themeSelect" onchange="__setTheme(this.value)">
      <!-- буде заповнено у build.mjs із реального переліку -->
    </select>

    <!-- Palette select -->
    <select class="select select-bordered" id="paletteSelect"></select>

    <!-- Language select -->
    <select class="select select-bordered" id="langSelect" onchange="__setLang(this.value)">
      <option value="uk">Українська</option>
      <option value="en">English</option>
      <option value="pl">Polski</option>
    </select>
  </div>
</div>
<script>
  (function(){
    const themeSel = document.getElementById('themeSelect');
    const langSel = document.getElementById('langSelect');
    const curTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const curLang  = document.documentElement.getAttribute('lang') || 'uk';
    if (themeSel) themeSel.value = curTheme;
    if (langSel)  langSel.value  = curLang;
  })();
</script>


FOOTER

<footer class="footer footer-center bg-base-200 text-base-content p-6">
  <aside>
    <p>© 2025 Evolution • DaisyUI 5.7</p>
  </aside>
</footer>


src/content/home.html

<section class="prose max-w-none">
  <h1>Starter</h1>
  <p>Drop-in components go here.</p>
  <button class="btn btn-primary">Primary</button>
</section>


7. Theme Builder — вимоги до UI

Має бути панель “Settings” (може відкриватись з Navbar), де користувач у рантаймі міняє:
•	Theme: список усіх вбудованих тем + evo (кастом).  ￼
•	Palette: пресети (набір --color-* для semantic, accent, neutral).
•	Radius: --radius-selector, --radius-field, --radius-box.
•	Base sizes: --size-selector, --size-field.
•	Border: --border.
•	Depth/Noise: --depth, --noise.

Ці ручки відображаються у CSS variables теми (див. приклад у документації Themes та llms.txt).  ￼

Збереження налаштувань: localStorage (ключі evo-theme, evo-palette, evo-theme-variables).
Експорт/Імпорт теми: JSON (див. схему нижче).

JSON Schema (theme export)

{
"name": "evo",
"palette": "default",
"vars": {
"--color-base-100": "oklch(98% 0.02 240)",
"--color-primary": "oklch(55% 0.30 260)",
"--radius-selector": "1rem",
"--border": "1px",
"--depth": 1,
"--noise": 0
}
}


8. Складання з компонентів (build.mjs)

scripts/build.mjs

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function read(p){ return fs.readFileSync(p, "utf8"); }
function write(p,s){ fs.writeFileSync(p, s, "utf8"); }
function arg(name, def){ const a = process.argv.find(x=>x.startsWith(`--${name}=`)); return a ? a.split("=")[1] : def; }

const theme = arg("theme", process.env.THEME || "light");
const lang  = arg("lang",  process.env.LANG  || "uk");
const palette = arg("palette", process.env.PALETTE || "default");

// Templates
let base = read(path.join(root, "src/templates/base.html"));
const navbar = read(path.join(root, "src/components/navbar.html"));
const footer = read(path.join(root, "src/components/footer.html"));
const content = read(path.join(root, "src/content/home.html"));

// inject placeholders
base = base
.replace("<!-- @@NAVBAR -->", navbar)
.replace("<!-- @@FOOTER -->", footer)
.replace("<!-- @@CONTENT -->", content)
.replace(/\[\[THEME\]\]/g, theme)
.replace(/\[\[LANG\]\]/g, lang);

// Fill theme list (could be fetched from a registry; hardcode common built-ins)
const builtInThemes = [
"light","dark","cupcake","bumblebee","emerald","corporate",
"synthwave","retro","cyberpunk","valentine","halloween","garden",
"forest","aqua","lofi","pastel","fantasy","wireframe","black",
"luxury","dracula","cmyk","autumn","business","acid","lemonade",
"night","coffee","winter","dim","nord","sunset","evo"
];
// inject options into <select id="themeSelect">
base = base.replace(
/(<select[^>]*id="themeSelect"[^>]*>)([\s\S]*?)(<\/select>)/,
(_, open, _inner, close) => open + builtInThemes.map(t => `<option value="${t}">${t}</option>`).join("") + close
);

// Palette presets (example)
const palettes = ["default","teal","violet","amber","rose"];
base = base.replace(
/(<select[^>]*id="paletteSelect"[^>]*>)([\s\S]*?)(<\/select>)/,
(_, open, _inner, close) => open + palettes.map(p => `<option value="${p}">${p}</option>`).join("") + close
);

fs.mkdirSync(path.join(root, "dist"), { recursive: true });
write(path.join(root, "dist/index.html"), base);
console.log(`[build] index.html -> theme="${theme}" lang="${lang}" palette="${palette}"`);


9. Інлайн стилів (inline.mjs)
10. import fs from "node:fs";
    import path from "node:path";
    import url from "node:url";
    import juice from "juice";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const htmlPath = path.join(root, "dist/index.html");
const cssPath  = path.join(root, "dist/styles.css");

const html = fs.readFileSync(htmlPath, "utf8");
const css  = fs.readFileSync(cssPath, "utf8");

const inlined = juice.inlineContent(html, css, {
removeStyleTags: true,
preserveMediaQueries: true
});

fs.writeFileSync(path.join(root, "dist/index.inline.html"), inlined, "utf8");
console.log("[inline] index.inline.html created");


10. Використання
# 1) Install
npm i

# 2) Build (default: THEME=light, LANG=uk, PALETTE=default)
npm run build

# 3) Build with custom theme/lang/palette
THEME=evo LANG=en PALETTE=violet npm run build

# 4) Dev watch (CSS only)
npm run dev

Вихід:
•	dist/styles.css — згенерований Tailwind+daisyUI.
•	dist/index.html — скомпонований із компонентів.
•	dist/index.inline.html — самодостатній HTML із інлайн-стилями.

⸻

11. Navbar — вимоги деталізовано
    •	Theme Select: повний перелік тем (вбудовані + evo). Клік → data-theme на <html> + localStorage.  ￼
    •	Palette Select: міняє набір semantic/accent змінних (через динамічний <style> або додатковий data-palette + CSS).
    •	Language Select: міняє lang на <html> + localStorage; тексти компонентів — мінімальне демо (дві-три стрічки), без серверної i18n.
    •	Settings panel (off-canvas / modal): слайдери/селектори для --radius-*, --size-*, --border, --depth, --noise + кнопки Export JSON / Import JSON. (Відповідає можливостям Theme Builder).  ￼

⸻

12. Дизайн-системні засади
    •	Класи daisyUI components (btn, card, menu, navbar, footer, select, …) — як базова мова інтерфейсу.  ￼
    •	data-theme як головний перемикач (scoped теми підтримуються на вкладених нодах за потреби).  ￼
    •	Кастомні стилі — тільки через CSS variables теми (без жорстких кольорів).

⸻

13. Сумісність і ризики
    •	Tailwind v4 + Plugins: даємо конфіг у CSS через @plugin, без tailwind.config.js. Стежимо за мажорними змінами.  ￼
    •	daisyUI v5: орієнтуємось на офіційний Upgrade Guide та Themes docs. Якщо з’являться мінорні зміни API (наприклад, нові змінні теми) — оновлюємо панель Settings.  ￼

⸻

14. Критерії приймання (Acceptance)
    1.	npm run build створює 3 артефакти (styles.css, index.html, index.inline.html) без помилок.
    2.	На рендері index.html:
          •	Перемикач Theme змінює вигляд компонентів миттєво і зберігає вибір.
          •	Перемикач Language міняє lang і зберігає вибір.
          •	Palette перемикає семантичні кольори (помітно на btn, alert, badge).
          •	Settings panel дозволяє правити radius/size/border/depth/noise; Export/Import працюють.
    3.	index.inline.html рендериться без зовнішніх ресурсів (крім favicon/зображень, якщо будуть).

⸻

15. Подальші покращення (Next)
    •	Імпорт пресетів тем із JSON (CLI: --theme-file=... → оновлювати блок @plugin "daisyui/theme" перед компіляцією).
    •	Додати генерацію thumbnail preview теми (Canvas snapshot).
    •	Каталог components/ з маніфестом components.json для декларативної композиції.

⸻

Джерела
•	daisyUI Themes (вбудовані/кастомні теми, variables, data-theme) — офіційні доки.  ￼
•	daisyUI 5 upgrade guide (Tailwind v4 + daisyUI v5) — офіційні доки.  ￼
•	llms.txt (довідка для LLM, підтверджує v5 + Tailwind v4, базові принципи) — офіційний ресурс.  ￼
•	Tailwind v4 upgrade guide — офіційні доки.  ￼

⸻

якщо ок — можу додати у цей PRD конкретний Settings UI (HTML+JS) і 3-4 готові palette-пресети, щоби з коробки було видно різницю.


Оброби все це і перепиши акуратно + збери цей проект розбий все на детальні таски і роби крок за кроком також додай інструменти щоб валідувати код що все білдиться коректно і без варнінгов і помилок 

ось це перевіряй завжди і тільки звідти бери інфу це 100% правдива інформація: 
https://daisyui.com/llms.txt