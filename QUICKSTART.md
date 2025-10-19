# 🚀 Evolution — Швидкий старт

Проект Evolution вже містить готову збірку на **Tailwind CSS v4** та **daisyUI v5**. Цей файл об'єднує попередні інструкції й допоможе швидко перейти від клонування до деплою.

## 📦 Що входить у репозиторій

```
evo-daisy/
├── src/                    # Вихідні файли (CSS, компоненти, контент)
├── scripts/                # Скрипти збірки, інлайнингу та валідації
├── dist/                   # Згенеровані артефакти після npm run build
└── .github/workflows/      # GitHub Actions для деплою на Pages
```

Основні фічі:

- ✅ 33 вбудовані теми daisyUI + кастомні `light-evo` та `dark-evo`
- ✅ Theme Builder із контролем радіусів, розмірів та ефектів
- ✅ 5 готових палітр кольорів
- ✅ 3 локалізації (uk, en, pl)
- ✅ Експорт/імпорт тем у JSON
- ✅ Inline-білд для однофайлового деплою

## 🧑‍💻 Локальна розробка

```bash
npm install        # якщо залежності ще не встановлені
npm run dev        # Tailwind watch + HTML watch + live-server на http://localhost:3000
```

Команда `npm run dev` паралельно запускає компіляцію CSS, HTML watcher та локальний сервер. За потреби можна запускати частини окремо:

```bash
npm run dev:css      # тільки Tailwind watch
npm run dev:html     # тільки HTML watcher
npm run dev:server   # тільки live-server
```

Щоб швидко переглянути останній білд без сервера, відкрийте `dist/index.html` у браузері.

## 🏗️ Збірка і артефакти

```bash
npm run build        # clean → build:css → build:html → build:inline
```

Після виконання у `dist/` будуть доступні:

- `dist/styles.css` — мінімізований CSS із темами (≈300 KB, розмір залежить від версій пакунків)
- `dist/index.html` — складений HTML, що підключає CSS як окремий файл
- `dist/index.inline.html` — автономна версія HTML із вбудованим CSS

Для ручного деплою достатньо завантажити `index.html` + `styles.css`, або ж використати `index.inline.html`, якщо потрібен один файл.

## 🌐 Автоматичний деплой (GitHub Pages)

У репозиторії вже налаштований workflow `.github/workflows/deploy.yml`, який збирає проєкт і публікує результат на GitHub Pages.

1. Переконайтесь, що remote вказує на ваш GitHub репозиторій:
   ```bash
   git remote add origin https://github.com/<user>/<repo>.git
   git branch -M main
   ```
2. На сторінці **Settings → Pages** оберіть **Source: GitHub Actions**. Якщо деплой уже працює — нічого змінювати не потрібно.
3. Зробіть `git push origin main`. Workflow автоматично виконає `npm run build`, підготує артефакти та задеплоїть їх на Pages.
4. Статус першого запуску можна перевірити в **Actions → Build and Deploy to GitHub Pages**.

Адреса сайту: `https://<user>.github.io/<repo>/`.

## ☁️ Альтернативи (за бажанням)

**Cloudflare Pages**

1. Під'єднайте репозиторій у Cloudflare Pages.
2. Build command: `npm run build`
3. Output directory: `dist`

**Vercel / Netlify** — використовують ті самі параметри (`npm run build`, output `dist`).

## 🔄 Оновлення сайту

```bash
# 1. Вносимо зміни у src/ або themes/
npm run build          # 2. Перевіряємо, що білд збирається
# 3. Коммітимо
git add .
git commit -m "Describe your change"
git push
# 4. Очікуємо автоматичний деплой (GitHub Pages або інша платформа)
```

## 🎨 Робота з темами та палітрами

- Вибір тем/палітр доступний у navbar або через Settings (⚙️).
- Параметри зберігаються в `localStorage` (`evo-theme`, `evo-lang`, `evo-palette`, `evo-theme-variables`).
- Для створення нової палітри відредагуйте `src/palettes.json` і запустіть `npm run build`.

## 🛠 Корисні команди

```bash
npm run clean        # очистити dist/
npm run build:css    # лише Tailwind → CSS
npm run build:html   # скласти HTML без інлайнингу
npm run build:inline # сформувати inline HTML
npm run validate     # швидка перевірка структури
npm test             # запуск node:test зі сценарієм tests/
```

## ⚠️ Вимоги

- Node.js ≥ 18
- Для dev-сервера потрібен вільний порт 3000
- Рекомендовано періодично запускати `npm run validate` перед деплоєм

## ✅ Все готово

Відкрийте `dist/index.html` або зайдіть на адресу GitHub Pages — проект готовий до демонстрації. У разі додаткових питань звертайтеся до `README.md` та `AUTO_DEPLOY.md`.

Насолоджуйтесь Evolution Build! ✨

