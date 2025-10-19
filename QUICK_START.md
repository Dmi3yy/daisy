# ⚡ Швидкий старт

## 🚀 Локальний білд і деплой

### 1. Зібрати проект
```bash
npm run build
```

Результат: `dist/index.html` + `dist/styles.css`

### 2. Завантажити на сервер
Просто скопіюй файли з `dist/` на свій сервер в публічну папку.

---

## 🔄 Автоматичний деплой через GitHub

### Крок 1: Ініціалізуй Git (якщо ще не зробив)
```bash
git init
git add .
git commit -m "Initial commit"
```

### Крок 2: Створи репозиторій на GitHub
1. Іди на https://github.com/new
2. Створи новий репозиторій (назви як хочеш, наприклад `daisy-evo`)
3. **НЕ** додавай README, .gitignore, license (вони вже є)

### Крок 3: Підключи і push
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Крок 4: Налаштуй GitHub Pages
1. Іди в **Settings** → **Pages**
2. Source: `Deploy from a branch`
3. Branch: `gh-pages` / `(root)`
4. Save

### Крок 5: Активуй Actions
1. Іди в **Actions**
2. Дозволь Actions запускатися
3. Першиий деплой запуститься автоматично!

---

## 🌐 Альтернатива: Cloudflare Pages

1. Іди на https://dash.cloudflare.com/
2. Pages → Create project → Connect to Git
3. Вибери свій репозиторій
4. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Save and Deploy!

Твій сайт буде доступний на `https://YOUR_PROJECT.pages.dev`

---

## 📝 Оновлення сайту

```bash
# 1. Внеси зміни в файли src/

# 2. Перевір локально
npm run build
# Відкрий dist/index.html в браузері

# 3. Закомить і push
git add .
git commit -m "Update themes"
git push

# Деплой запуститься автоматично! ✨
```

---

## 🎨 Швидкі команди

```bash
npm run build        # Зібрати проект
npm run clean        # Очистити dist/
npm run build:css    # Тільки CSS
npm run build:html   # Тільки HTML
```

---

## ✅ Все готово!

Твій статичний сайт готовий до деплою! 🎉

**Файли для сервера:**
- `dist/index.html` (146 KB)
- `dist/styles.css` (287 KB)

або

- `dist/index.inline.html` (600 KB) - все в одному файлі

