# 🚀 Автоматичний деплой - НАЛАШТОВАНО!

## ✅ Що вже зроблено:

1. ✅ Git ініціалізовано
2. ✅ GitHub Actions налаштовано (`.github/workflows/deploy.yml`)
3. ✅ Всі зміни закомічені
4. ✅ Push на GitHub виконано

**Твій репозиторій:** https://github.com/Dmi3yy/daisy

---

## 🎯 Тепер налаштуй деплой (один раз):

### Варіант 1: GitHub Pages (безкоштовно)

1. Іди на https://github.com/Dmi3yy/daisy/settings/pages

2. **Source:** Deploy from a branch
3. **Branch:** `gh-pages` / `(root)`
4. **Save**

5. Іди на https://github.com/Dmi3yy/daisy/actions
6. Дозволь Actions якщо потрібно

7. **Готово!** Сайт буде на `https://dmi3yy.github.io/daisy/`

---

### Варіант 2: Cloudflare Pages (рекомендовано, швидше)

1. Іди на https://dash.cloudflare.com/
2. **Pages** → **Create a project** → **Connect to Git**
3. Вибери репозиторій `Dmi3yy/daisy`
4. Build settings:
   ```
   Build command:    npm run build
   Build directory:  dist
   ```
5. **Save and Deploy**

**Готово!** Сайт буде на `https://daisy.pages.dev` (або свій домен)

---

### Варіант 3: Vercel (теж хороший)

1. Іди на https://vercel.com/new
2. Import `Dmi3yy/daisy`
3. Framework Preset: `Other`
4. Build settings:
   ```
   Build Command:     npm run build
   Output Directory:  dist
   ```
5. **Deploy**

**Готово!** Сайт буде на `https://daisy.vercel.app`

---

## 🔄 Як оновлювати сайт (дуже просто):

### Спосіб 1: Через термінал
```bash
# 1. Внеси зміни в файли src/

# 2. Закомить
git add .
git commit -m "Update themes"

# 3. Push
git push

# ✨ Деплой запуститься автоматично!
```

### Спосіб 2: Через GitHub Web
1. Відкрий файл на GitHub
2. Натисни кнопку ✏️ Edit
3. Внеси зміни
4. Commit changes
5. ✨ Деплой запуститься автоматично!

---

## 📊 Відстежувати деплой:

- **GitHub Actions:** https://github.com/Dmi3yy/daisy/actions
- **Cloudflare Pages:** https://dash.cloudflare.com/ → Pages → daisy → Deployments
- **Vercel:** https://vercel.com/dashboard → daisy → Deployments

---

## 🎨 Що оновлювати:

### Теми
```
themes/evo/light.json  ← Light-Evo тема
themes/evo/dark.json   ← Dark-Evo тема
```

### Контент
```
src/content/home.html  ← Головна сторінка
```

### Стилі
```
src/app.css            ← CSS + теми
```

### Компоненти
```
src/components/navbar.html  ← Навбар з перемикачем тем
```

---

## ⚡ Швидкі команди для розробки:

```bash
# Локальна розробка
npm run build        # Зібрати
open dist/index.html # Відкрити в браузері

# Коли все ОК
git add .
git commit -m "описання змін"
git push             # Автодеплой!
```

---

## 🎉 Готово!

Тепер кожен `git push` автоматично деплоїть сайт! 

**Наступний крок:** Вибери один з варіантів деплою вище і налаштуй його (один раз, займе 2 хвилини).

Після цього просто роби `git push` і сайт оновиться автоматично! ✨

