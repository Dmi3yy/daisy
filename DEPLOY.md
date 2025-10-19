# 🚀 Деплой на сервер

## 📁 Файли для завантаження на сервер

Після `npm run build` у папці `dist/` з'являються файли:

### Варіант 1: З окремим CSS (рекомендовано)
```
dist/
├── index.html       ← головний файл
└── styles.css       ← стилі (мінімізовані)
```

**Завантажуй на сервер:**
- `dist/index.html` → `/public_html/index.html`
- `dist/styles.css` → `/public_html/styles.css`

### Варіант 2: Один файл (все в одному)
```
dist/
└── index.inline.html  ← все CSS вбудовано в HTML (600KB)
```

**Завантажуй на сервер:**
- `dist/index.inline.html` → `/public_html/index.html`

---

## 🔄 GitHub + Cloudflare Pages / Vercel

### 1. Створи `.gitignore` (якщо немає)
```gitignore
node_modules/
dist/
.DS_Store
```

### 2. Додай GitHub Actions для автодеплою

Створи файл `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 3. Налаштуй GitHub Pages
1. Іди в Settings → Pages
2. Source: `gh-pages` branch
3. Збережи

### 4. Або підключи Cloudflare Pages
1. Cloudflare Dashboard → Pages → Create project
2. Connect to Git → вибери свій репозиторій
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy!

---

## 🔨 Команди для роботи

```bash
# Розробка (локальний сервер)
npm run dev

# Білд для продакшну
npm run build

# Очистити dist/
npm run clean
```

---

## 📝 Структура проекту

```
daisy/
├── src/                    # Вихідні файли
│   ├── app.css            # Стилі + теми
│   ├── templates/         # HTML шаблони
│   ├── components/        # Компоненти (navbar, etc)
│   └── content/           # Контент сторінок
├── themes/                # JSON теми
│   ├── evo/              # EVO теми
│   │   ├── light.json
│   │   └── dark.json
│   ├── light/            # Інші light теми
│   └── dark/             # Інші dark теми
├── scripts/              # Білд скрипти
├── dist/                 # Зібрані файли (не комітити)
└── package.json          # Залежності

```

---

## ✅ Чеклист перед деплоєм

- [ ] `npm run build` без помилок
- [ ] Перевірити `dist/index.html` локально
- [ ] Закомітити зміни в git
- [ ] Push в GitHub
- [ ] Перевірити деплой на сервері

---

## 🔗 Корисні посилання

- **Cloudflare Pages:** https://pages.cloudflare.com/
- **Vercel:** https://vercel.com/
- **Netlify:** https://www.netlify.com/
- **GitHub Pages:** https://pages.github.com/

Всі ці сервіси безкоштовні для статичних сайтів!

