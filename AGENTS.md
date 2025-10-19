# AGENTS.md — Evolution Build (Tailwind CSS 4 + daisyUI 5)

## Мета репозиторію
- **Головна ціль**: Побудувати універсальну тему на основі **Tailwind CSS v4** з накладкою **daisyUI v5**, щоб можна було швидко генерувати варіації (light/dark/EVO + кастомні палітри).
- **Рівень оновлення**: тримаємо залежності на останніх стабільних/альфа версіях Tailwind CLI 4 та daisyUI 5; будь-які оновлення одразу відбиваємо у `package.json` і документації.

## Технологічний стек
- Node.js ≥ 18
- Tailwind CSS 4 CLI (`@tailwindcss/cli` + `tailwindcss` 4.0.0-alpha.x)
- daisyUI 5 (через Tailwind plugin API)
- Live Server + chokidar + custom Node.js скрипти (`scripts/*.mjs`)
- Juice (інлайнинг CSS у HTML артефакти)

## Структура проєкту
### Корінь
- `package.json` — скрипти збірки/дев-сервера та список залежностей.
- `README.md`, `PROJECT_SUMMARY.md`, інші довідники — не видаляємо, але синхронізуємо після оновлень.
- `dist/` — згенеровані артефакти (`styles.css`, `index.html`, `index.inline.html`). Очищається командою `npm run clean`.
- `themes/` — JSON-файли з описами тем. Підпапки `light/`, `dark/`, `evo/` підтримуються скриптом збірки.

### `src/`
- `app.css` — єдиний вхід Tailwind; оголошує підключення `@plugin "daisyui"` та кастомні теми `light-evo`/`dark-evo`, а також глобальні стилі (navbar, glass, safe-area).
- `components/` — HTML-фрагменти, що вставляються у шаблони (navbar/footer/settings + конструктор тем у `middleDaisy/`).
- `content/` — контент сторінок (поки `home.html`).
- `templates/` — базовий шаблон (`base.html`) для рендерингу сторінок.
- `config/ui-components.json` — метадані для builder’а (віджетів, слайдерів тощо).
- `backgrounds.json`, `palettes.json` — допоміжні дані для вибору бекграундів і палітр.

### `scripts/`
- `build.mjs` — збірка HTML, злиття тем, побудова списків тем/мов/палітр.
- `watch.mjs` — спостереження за HTML/JSON для дев-сценарію.
- `inline.mjs` — виклик `juice` для створення `dist/index.inline.html`.
- `validate.mjs` — швидка перевірка структури.
- `ui-builder.mjs` — утиліти для генерування секцій редактора (експериментально).

## Робочі процеси
1. **Інсталяція**: `npm install`.
2. **Повна збірка**: `npm run build` → виконує clean → build:css (Tailwind+daisyUI) → build:html → build:inline.
3. **Dev-режим**: `npm run dev` (одночасно watch CSS, watch HTML, live-server на http://localhost:3000).
4. **Окремі задачі**: `npm run dev:css`, `npm run dev:html`, `npm run dev:server`, `npm run validate`.
5. **Збірка з параметрами**: `THEME=<id> LANG=<code> PALETTE=<id> npm run build` (див. `README.md`).

## Практичні нотатки
- Кастомні теми оголошуємо двічі: JSON-файл у `themes/` для даних builder’а + CSS-токени в `src/app.css` для runtime.
- Скрипт `build.mjs` обробляє вкладені каталоги у `themes/`; назва файлу стає `theme.id` (для EVO тем пріоритет вище).
- Нові компоненти розбиваємо на атомарні HTML-фрагменти в `src/components` та підключаємо через шаблони — уникаємо inline-розмітки у скриптах.
- Для Tailwind класи використовуємо JIT патерни; якщо потрібно whitelist — додаємо у `app.css` або `tailwind.config` (коли з’явиться).

## Чекліст впорядкування
1. **Актуалізувати залежності Tailwind/daisyUI**
   - Перевірити останні релізи CLI 4 та daisyUI 5.
   - Оновити `package.json` і зафіксувати зміни в `README.md`.
   - Запустити `npm run build` + smoke-тест у браузері.
2. **Нормалізувати структуру тем**
   - Вирівняти неймінг JSON (`name`, `mode`, `colors`, `navbar`).
   - Додати опис полів у документацію builder’а.
   - Перевірити, що `build.mjs` коректно сортує EVO та вбудовані теми.
3. **Уніфікувати компоненти**
   - Розділити великі блоки у `src/components/middleDaisy` на логічні секції (header/options/effects/тощо вже є — рев’ю на узгодженість класів).
   - Виписати інтерфейси/атрибути, які очікують скрипти (`data-theme`, `data-lang`).
4. **Документація**
   - Звести дублікати (`QUICKSTART.md`, `QUICK_START.md`, `Themeschithecr.md`) у єдину структуру.
   - Оновити приклади команд і посилання.
5. **Автоматизація та перевірки**
   - Додати лінтер/форматер для HTML (наприклад, Prettier) і CSS.
   - Розширити `validate.mjs` перевірками на наявність усіх необхідних полів у темах/конфігах.

Дотримуємось цього файлу як єдиного джерела правди для структури та процесів; при зміні архітектури — спершу оновити `AGENTS.md`, потім код.
