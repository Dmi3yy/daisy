# 🎯 Як увімкнути GitHub Pages (30 секунд)

## Крок 1: Відкрий Settings

🔗 **Прямий лінк:** https://github.com/Dmi3yy/daisy/settings/pages

АБО:

1. Іди на https://github.com/Dmi3yy/daisy
2. Натисни **Settings** (зверху)
3. В лівому меню знайди **Pages**

---

## Крок 2: Налаштуй деплой

На сторінці GitHub Pages:

### Source (Джерело)
Вибери: **Deploy from a branch**

### Branch (Гілка)
Вибери: `gh-pages` → `/ (root)`

### Натисни: **Save**

---

## Крок 3: Дочекайся першого деплою

1. Іди на https://github.com/Dmi3yy/daisy/actions
2. Подивись на workflow "Build and Deploy"
3. Дочекайся зеленої галочки ✅ (займе 1-2 хвилини)

---

## 🎉 Готово!

Твій сайт буде доступний на:

### 🌐 https://dmi3yy.github.io/daisy/

---

## 🔄 Як оновлювати:

Просто роби:
```bash
git add .
git commit -m "Update"
git push
```

Сайт оновиться автоматично за 1-2 хвилини! ✨

---

## ⚠️ Якщо щось не працює:

1. **Actions не запускаються?**
   - Іди на https://github.com/Dmi3yy/daisy/settings/actions
   - Дозволь Actions: "Allow all actions and reusable workflows"

2. **Сторінка 404?**
   - Почекай 5 хвилин після першого деплою
   - Перевір що вибрано `gh-pages` branch в Settings → Pages

3. **Build fails?**
   - Подивись логи на https://github.com/Dmi3yy/daisy/actions
   - Можливо треба виправити помилки в коді

---

## 📱 Додатково: Свій домен

Якщо хочеш використати свій домен (наприклад `daisy.com`):

1. В Settings → Pages → Custom domain введи `daisy.com`
2. В налаштуваннях DNS домену додай CNAME запис:
   ```
   CNAME  @  dmi3yy.github.io
   ```

Готово! 🚀

