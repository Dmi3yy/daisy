# 🚀 Evolution — Швидкий старт

## ✅ Проект успішно створено!

Ваш новий проект Evolution на базі **Tailwind CSS v4** та **daisyUI v5** готовий до використання.

## 📦 Що вже зроблено

### ✨ Структура проекту
```
evo-daisy/
├── src/
│   ├── app.css                  # Конфігурація Tailwind + daisyUI з темою 'evo'
│   ├── palettes.json            # 5 колірних палітр
│   ├── templates/base.html      # Базовий шаблон
│   ├── components/              # Navbar, Footer, Settings panel
│   └── content/home.html        # Контент головної сторінки
├── scripts/
│   ├── build.mjs               # Збірка HTML з компонентів
│   ├── inline.mjs              # Інлайнинг CSS
│   └── validate.mjs            # Валідація проекту
└── dist/                       # 3 готові артефакти ✓
    ├── styles.css              (253 KB)
    ├── index.html              (35 KB)
    └── index.inline.html       (85 KB)
```

### 🎨 Реалізовані фічі

✅ **33 теми** — всі вбудовані теми daisyUI + кастомна тема 'evo'
✅ **Theme Builder** — повний контроль:
  - Border Radius (selector, field, box)
  - Base Sizes (selector, field)
  - Visual Effects (border, depth, noise)
✅ **5 колірних палітр** — default, teal, violet, amber, rose
✅ **3 мови** — українська, англійська, польська
✅ **Export/Import тем** — збереження та завантаження через JSON
✅ **Компонентна система** — маркери @@NAVBAR, @@FOOTER, @@CONTENT, @@SETTINGS
✅ **Inline CSS** — самодостатній HTML файл для публікації

## 🏃 Запуск

### 1. Перегляд результату

Відкрийте у браузері:
```bash
open dist/index.html
```

### 2. Перемикання тем

- Використовуйте селектор теми в Navbar (праворуч)
- Або відкрийте Settings panel (⚙️) для детального налаштування

### 3. Розробка

```bash
# Watch режим для CSS (автокомпіляція при змінах)
npm run dev

# В іншому терміналі можна запустити локальний сервер
npx serve dist
```

### 4. Збірка

```bash
# Повна збірка
npm run build

# З параметрами
THEME=cyberpunk LANG=en PALETTE=violet npm run build
```

## 🎯 Наступні кроки

### Додати свій контент
1. Відредагуйте `src/content/home.html`
2. Запустіть `npm run build:html && npm run build:inline`

### Створити нову сторінку
1. Створіть файл `src/content/about.html`
2. Додайте маркер в `src/templates/base.html`: `<!-- @@ABOUT -->`
3. Оновіть `scripts/build.mjs` для включення нового компонента

### Налаштувати кастомну тему
1. Відредагуйте блок `@plugin "daisyui/theme"` в `src/app.css`
2. Змініть кольори та параметри
3. Запустіть `npm run build`

### Додати нову палітру
1. Відкрийте `src/palettes.json`
2. Додайте новий об'єкт з кольорами
3. Оновіть `scripts/build.mjs` для відображення в селекті

## 🛠 Корисні команди

```bash
npm run clean          # Очистити dist/
npm run build:css      # Тільки CSS
npm run build:html     # Тільки HTML
npm run build:inline   # Тільки inline версія
npm run build          # Повна збірка
npm run dev            # Watch режим
npm run validate       # Перевірити проект
```

## 📊 Створені файли

1. **dist/styles.css** (253 KB)
   - Скомпільований Tailwind CSS + daisyUI
   - Всі 33 теми включено
   - Мінімізований

2. **dist/index.html** (35 KB)
   - Складений з компонентів
   - Підключає styles.css зовні
   - Використовується для розробки

3. **dist/index.inline.html** (85 KB)
   - Самодостатній HTML
   - CSS вбудовано всередину
   - Готовий для публікації/демо

## 🎨 Доступні теми

light, dark, cupcake, bumblebee, emerald, corporate, synthwave, retro, cyberpunk, valentine, halloween, garden, forest, aqua, lofi, pastel, fantasy, wireframe, black, luxury, dracula, cmyk, autumn, business, acid, lemonade, night, coffee, winter, dim, nord, sunset, **evo** (custom)

## 🎭 Доступні палітри

1. **Default** — стандартна схема
2. **Teal Ocean** — тіаловий та блакитний
3. **Violet Dream** — фіолетові відтінки
4. **Amber Sunset** — бурштинові та помаранчеві
5. **Rose Garden** — рожеві тони

## 📖 Документація

Детальну документацію дивіться в **README.md**

## 🔥 Приклади використання

### Змінити тему при збірці
```bash
THEME=dracula npm run build
```

### Створити версію англійською
```bash
LANG=en npm run build
```

### Застосувати фіолетову палітру
```bash
PALETTE=violet npm run build
```

### Комбінований білд
```bash
THEME=cyberpunk LANG=uk PALETTE=teal npm run build
```

## ⚠️ Важливо

- Node.js >= 18 обов'язково
- Всі налаштування зберігаються в localStorage браузера
- Settings panel працює тільки після відкриття index.html у браузері
- Для production використовуйте index.inline.html

## 🎉 Готово!

Ваш проект повністю налаштований та готовий до використання. 

**Відкрийте `dist/index.html` у браузері та насолоджуйтесь!** 🚀

---

Створено з ❤️ за допомогою Evolution Build System
Powered by Tailwind CSS v4 + daisyUI v5

