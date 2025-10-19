# Themes Structure

Ця папка містить конфігураційні файли для всіх тем проекту.

## Структура

```
themes/
├── light/          # Світлі теми
│   ├── evo.json
│   ├── liquidglass.json
│   └── ... інші світлі теми
├── dark/           # Темні теми
│   └── ... темні теми
└── README.md
```

## Формат JSON файлу теми

```json
{
  "name": "theme-name",
  "mode": "light|dark",
  "default": false,
  "prefersdark": false,
  "colorScheme": "light|dark",
  "colors": {
    "base-100": "oklch(...)",
    "base-200": "oklch(...)",
    "base-300": "oklch(...)",
    "base-content": "oklch(...)",
    "primary": "oklch(...)",
    "primary-content": "oklch(...)",
    "secondary": "oklch(...)",
    "secondary-content": "oklch(...)",
    "accent": "oklch(...)",
    "accent-content": "oklch(...)",
    "neutral": "oklch(...)",
    "neutral-content": "oklch(...)",
    "info": "oklch(...)",
    "info-content": "oklch(...)",
    "success": "oklch(...)",
    "success-content": "oklch(...)",
    "warning": "oklch(...)",
    "warning-content": "oklch(...)",
    "error": "oklch(...)",
    "error-content": "oklch(...)"
  },
  "radius": {
    "selector": "1rem",
    "field": "0.25rem",
    "box": "0.5rem"
  },
  "size": {
    "selector": "0.25rem",
    "field": "0.25rem"
  },
  "border": "1px",
  "depth": 0|1,
  "noise": 0|1,
  "description": "Optional description"
}
```

## Використання

Кожна тема може бути:
- **Кастомна** - повністю визначена в JSON з усіма кольорами
- **Вбудована daisyUI** - використовує стандартні теми daisyUI (light, dark, cupcake, і т.д.)

Система автоматично генерує CSS з цих JSON файлів.

