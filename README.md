# Evolution Build — DaisyUI 5 + Tailwind CSS 4

> Потужна система збірки компонентів на базі Tailwind CSS v4 та daisyUI v5.7

## 🎯 Особливості

- ✅ **33+ вбудовані теми** daisyUI + кастомна тема 'evo'
- 🎨 **Theme Builder** з повним контролем над radius, sizes, borders, depth, noise
- 🌍 **Мультимовність** (українська, англійська, польська)
- 🎭 **Колірні палітри** (default, teal, violet, amber, rose)
- 📦 **Компонентна система** з drop-in HTML фрагментами
- 💾 **Export/Import** тем в JSON
- 🚀 **Inline CSS** для самодостатніх артефактів
- ⚡ **Швидка збірка** без Webpack/Vite

## 📋 Вимоги

- Node.js >= 18
- npm або yarn

## 🚀 Швидкий старт

### 1. Встановлення залежностей

```bash
npm install
```

### 2. Збірка проекту

```bash
# Повна збірка (clean + css + html + inline)
npm run build

# Або покроково:
npm run clean          # Очистити dist/
npm run build:css      # Скомпілювати Tailwind + daisyUI
npm run build:html     # Зібрати HTML з компонентів
npm run build:inline   # Створити inline версію
```

### 3. Режим розробки

```bash
# Watch режим для CSS
npm run dev
```

### 4. Валідація

```bash
# Перевірити структуру проекту та виконати тестову збірку
npm run validate
```

## 📁 Структура проекту

```
evo-daisy/
├── package.json                 # Конфігурація та залежності
├── src/
│   ├── app.css                  # Tailwind v4 + daisyUI конфіг
│   ├── palettes.json            # Колірні палітри
│   ├── templates/
│   │   └── base.html            # Базовий шаблон
│   ├── components/
│   │   ├── navbar.html          # Навігаційна панель
│   │   ├── footer.html          # Футер
│   │   └── settings.html        # Панель налаштувань
│   └── content/
│       └── home.html            # Контент головної сторінки
├── scripts/
│   ├── build.mjs                # Скрипт збірки HTML
│   ├── inline.mjs               # Скрипт інлайнингу CSS
│   └── validate.mjs             # Скрипт валідації
└── dist/                        # Вихідні файли (генеруються)
    ├── styles.css
    ├── index.html
    └── index.inline.html
```

## 🎨 Використання тем

### Через CLI/ENV

```bash
# Вибір теми при збірці
THEME=cyberpunk npm run build

# Вибір мови
LANG=en npm run build

# Вибір палітри
PALETTE=violet npm run build

# Комбінація всіх параметрів
THEME=evo LANG=uk PALETTE=teal npm run build
```

### В браузері

1. Відкрийте `dist/index.html` у браузері
2. Використовуйте селектори в Navbar для перемикання теми/мови/палітри
3. Або відкрийте Settings panel (⚙️) для детального налаштування

## ⚙️ Theme Builder

Theme Builder дозволяє налаштувати:

### Border Radius
- **Selector Radius** (0-2rem) — для checkbox, toggle, badge
- **Field Radius** (0-2rem) — для button, input, select, tab
- **Box Radius** (0-2rem) — для card, modal, alert

### Sizes
- **Selector Size** (0.1875-0.3125rem) — базовий розмір селекторів
- **Field Size** (0.1875-0.3125rem) — базовий розмір полів

### Visual Effects
- **Border Width** (0-2px) — товщина рамок
- **Depth** (on/off) — 3D ефект глибини
- **Noise** (on/off) — ефект зерна/текстури

### Export/Import
- **Export** — зберегти поточну тему як JSON файл
- **Import** — завантажити раніше збережену тему
- **Reset** — повернути всі налаштування до дефолтних

## 🎭 Колірні палітри

### Доступні палітри

1. **Default** — стандартна колірна схема daisyUI
2. **Teal Ocean** — спокійні тіаловий та блакитний
3. **Violet Dream** — глибокі фіолетові відтінки
4. **Amber Sunset** — теплі бурштинові та помаранчеві
5. **Rose Garden** — романтичні рожеві тони

### Додавання власних палітр

Відредагуйте `src/palettes.json`:

```json
{
  "palettes": [
    {
      "id": "mypalette",
      "name": "My Custom Palette",
      "description": "Description here",
      "colors": {
        "--color-primary": "oklch(55% 0.30 260)",
        "--color-secondary": "oklch(70% 0.25 200)",
        "--color-accent": "oklch(65% 0.25 160)"
      }
    }
  ]
}
```

## 📦 Додавання нових компонентів

1. Створіть HTML файл в `src/components/` або `src/content/`
2. Додайте маркер в `src/templates/base.html`:
   ```html
   <!-- @@MYCOMPONENT -->
   ```
3. Оновіть `scripts/build.mjs` для включення нового компонента:
   ```javascript
   const myComponent = read(path.join(root, "src/components/mycomponent.html"));
   base = base.replace("<!-- @@MYCOMPONENT -->", myComponent);
   ```

## 🌍 Додавання мов

1. Додайте опцію в селекти мови в `src/components/navbar.html` та `src/components/settings.html`:
   ```html
   <option value="de">🇩🇪 Deutsch</option>
   ```
2. Мова зберігається в `localStorage` та застосовується через атрибут `lang` на `<html>`

## 🎨 Створення кастомної теми

Відредагуйте `src/app.css` і додайте новий блок `@plugin "daisyui/theme"`:

```css
@plugin "daisyui/theme" {
  name: "mytheme";
  default: false;
  prefersdark: false;
  color-scheme: light;

  /* Base colors */
  --color-base-100: oklch(98% 0.02 240);
  --color-base-200: oklch(95% 0.03 240);
  --color-base-300: oklch(92% 0.04 240);
  --color-base-content: oklch(20% 0.05 240);

  /* Brand colors */
  --color-primary: oklch(55% 0.30 260);
  --color-primary-content: oklch(98% 0.01 260);
  /* ... інші кольори ... */

  /* Theme controls */
  --radius-selector: 1rem;
  --radius-field: 0.25rem;
  --radius-box: 0.5rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 1;
  --noise: 0;
}
```

Не забудьте додати нову тему в `scripts/build.mjs` в масив `builtInThemes`.

## 🔧 Налаштування Tailwind CSS v4

Конфігурація Tailwind v4 знаходиться в `src/app.css` (не в `tailwind.config.js`):

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: light --default, dark --prefersdark, ...;
  logs: true;
}
```

Для додавання власних утиліт або варіантів, додайте їх безпосередньо в CSS файл.

## 📊 Розміри файлів

Типові розміри після збірки:
- `styles.css`: ~50-150 KB (мінімізований)
- `index.html`: ~30-50 KB
- `index.inline.html`: ~80-200 KB (самодостатній)

## 🐛 Troubleshooting

### Помилка "Cannot find module"
```bash
npm install
```

### CSS не компілюється
```bash
# Перевірте чи встановлені залежності
npm list tailwindcss daisyui

# Спробуйте очистити та перезібрати
npm run clean && npm run build
```

### Теми не відображаються
1. Перевірте чи правильно записані назви тем в `src/app.css`
2. Виконайте `npm run validate` для діагностики
3. Перевірте консоль браузера на помилки JavaScript

## 📚 Корисні посилання

- [daisyUI v5 Documentation](https://daisyui.com)
- [daisyUI для LLM](https://daisyui.com/llms.txt)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs/v4-beta)
- [daisyUI Upgrade Guide v4→v5](https://daisyui.com/docs/upgrade/)
- [daisyUI Theme Generator](https://daisyui.com/theme-generator/)

## 📄 Ліцензія

MIT © 2025 Evolution Team

## 🤝 Внесок

Contributions welcome! Відкривайте issues та pull requests.

## 🆘 Підтримка

Для питань та проблем створюйте issue в репозиторії.

---

**Зроблено з ❤️ використовуючи Tailwind CSS v4 та daisyUI v5.7**

