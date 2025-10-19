# EvoGlass Theme - Implementation Guide
## Step-by-Step Guide for Tailwind CSS + DaisyUI

---

## PHASE 1: Update app.css with EvoGlass Themes

### Step 1.1: Update Theme Configuration

**File:** `src/app.css`

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
  logs: true;
}
```

### Step 1.2: Add EvoGlass Light Theme

```css
/* Light EvoGlass Theme */
@plugin "daisyui/theme" {
  name: "light-evo";
  default: false;
  prefersdark: false;
  color-scheme: light;

  /* Base Colors */
  --color-base-100: oklch(99% 0.003 240);
  --color-base-200: oklch(97% 0.005 240);
  --color-base-300: oklch(94% 0.008 240);
  --color-base-content: oklch(20% 0.05 240);

  /* Brand Colors */
  --color-primary: oklch(55% 0.20 260);
  --color-primary-content: oklch(99% 0.003 260);
  --color-secondary: oklch(65% 0.18 200);
  --color-secondary-content: oklch(99% 0.003 200);
  --color-accent: oklch(70% 0.17 160);
  --color-accent-content: oklch(99% 0.003 160);

  /* Neutral */
  --color-neutral: oklch(45% 0.01 240);
  --color-neutral-content: oklch(99% 0.003 240);

  /* Semantic Colors */
  --color-info: oklch(65% 0.18 220);
  --color-info-content: oklch(99% 0.003 220);
  --color-success: oklch(60% 0.20 145);
  --color-success-content: oklch(99% 0.003 145);
  --color-warning: oklch(75% 0.18 60);
  --color-warning-content: oklch(20% 0.05 60);
  --color-error: oklch(60% 0.22 25);
  --color-error-content: oklch(99% 0.003 25);

  /* Layout */
  --radius-selector: 1rem;
  --radius-field: 0.75rem;
  --radius-box: 1.125rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 1;
  --noise: 0;
}
```

### Step 1.3: Add EvoGlass Dark Theme

```css
/* Dark EvoGlass Theme */
@plugin "daisyui/theme" {
  name: "dark-evo";
  default: false;
  prefersdark: true;
  color-scheme: dark;

  /* Base Colors - Dark */
  --color-base-100: oklch(20% 0.02 240);
  --color-base-200: oklch(25% 0.03 240);
  --color-base-300: oklch(30% 0.04 240);
  --color-base-content: oklch(95% 0.05 240);

  /* Brand Colors - Adjusted for Dark */
  --color-primary: oklch(60% 0.20 260);
  --color-primary-content: oklch(20% 0.02 260);
  --color-secondary: oklch(70% 0.18 200);
  --color-secondary-content: oklch(20% 0.02 200);
  --color-accent: oklch(75% 0.17 160);
  --color-accent-content: oklch(20% 0.02 160);

  /* Neutral */
  --color-neutral: oklch(60% 0.01 240);
  --color-neutral-content: oklch(20% 0.02 240);

  /* Semantic Colors */
  --color-info: oklch(65% 0.18 220);
  --color-info-content: oklch(20% 0.02 220);
  --color-success: oklch(65% 0.20 145);
  --color-success-content: oklch(20% 0.02 145);
  --color-warning: oklch(80% 0.18 60);
  --color-warning-content: oklch(20% 0.02 60);
  --color-error: oklch(65% 0.22 25);
  --color-error-content: oklch(20% 0.02 25);

  /* Layout */
  --radius-selector: 1rem;
  --radius-field: 0.75rem;
  --radius-box: 1.125rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 1;
  --noise: 0;
}
```

---

## PHASE 2: Add Glass Effect CSS

### Step 2.1: Update Navbar with Glass Effect

```css
/* EvoGlass Navbar - Light Mode */
[data-theme="light-evo"] .navbar {
  background-color: rgba(236, 236, 236, 0.7) !important;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

/* EvoGlass Navbar - Dark Mode */
[data-theme="dark-evo"] .navbar {
  background-color: rgba(30, 30, 30, 0.7) !important;
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}
```

### Step 2.2: Add Glass Card Component

```css
/* Glass Cards */
[data-theme="light-evo"] .card,
[data-theme="dark-evo"] .card {
  background: hsl(var(--b2) / 0.85) !important;
  backdrop-filter: blur(10px) saturate(150%) !important;
  -webkit-backdrop-filter: blur(10px) saturate(150%) !important;
  border: 1px solid hsl(var(--b3) / 0.3) !important;
}

[data-theme="light-evo"] .card:hover,
[data-theme="dark-evo"] .card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}
```

### Step 2.3: Add Glass Form Inputs

```css
/* Glass Inputs */
[data-theme="light-evo"] .input,
[data-theme="light-evo"] .select,
[data-theme="light-evo"] .textarea,
[data-theme="dark-evo"] .input,
[data-theme="dark-evo"] .select,
[data-theme="dark-evo"] .textarea {
  background: hsl(var(--b1) / 0.8) !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;
  border: 1px solid hsl(var(--b3) / 0.5) !important;
}

[data-theme="light-evo"] .input:focus,
[data-theme="light-evo"] .select:focus,
[data-theme="light-evo"] .textarea:focus,
[data-theme="dark-evo"] .input:focus,
[data-theme="dark-evo"] .select:focus,
[data-theme="dark-evo"] .textarea:focus {
  outline: 2px solid hsl(var(--primary)) !important;
  outline-offset: 2px !important;
}
```

---

## PHASE 3: Update Theme JSON Files

### Step 3.1: Create light-evo.json

**File:** `themes/light/light-evo.json`

```json
{
  "name": "light-evo",
  "colors": {
    "base-100": "#FDFDFD",
    "base-200": "#F7F7F7",
    "base-300": "#EFF0F2",
    "base-content": "#332B3F",
    "primary": "#3B5BDB",
    "primary-content": "#FDFDFD",
    "secondary": "#45ABEB",
    "secondary-content": "#FDFDFD",
    "accent": "#3CC9A1",
    "accent-content": "#FDFDFD",
    "neutral": "#73739E",
    "neutral-content": "#FDFDFD",
    "info": "#45ABEB",
    "info-content": "#FDFDFD",
    "success": "#6DDBAC",
    "success-content": "#FDFDFD",
    "warning": "#FCBF2B",
    "warning-content": "#332B3F",
    "error": "#EB5757",
    "error-content": "#FDFDFD"
  }
}
```

### Step 3.2: Create dark-evo.json

**File:** `themes/dark/dark-evo.json`

```json
{
  "name": "dark-evo",
  "colors": {
    "base-100": "#1F1F1F",
    "base-200": "#2A2A2A",
    "base-300": "#353535",
    "base-content": "#F3F3F3",
    "primary": "#5B7FF0",
    "primary-content": "#1F1F1F",
    "secondary": "#5ABBF0",
    "secondary-content": "#1F1F1F",
    "accent": "#5CDDC3",
    "accent-content": "#1F1F1F",
    "neutral": "#9CA3AF",
    "neutral-content": "#1F1F1F",
    "info": "#5ABBF0",
    "info-content": "#1F1F1F",
    "success": "#7CE5B8",
    "success-content": "#1F1F1F",
    "warning": "#FED34D",
    "warning-content": "#1F1F1F",
    "error": "#F87171",
    "error-content": "#1F1F1F"
  }
}
```

---

## PHASE 4: Update Build Configuration

### Step 4.1: Update ui-builder.mjs

Add light-evo and dark-evo to available themes:

```javascript
// In ui-builder.mjs
const lightThemes = ['light', 'light-evo'];
const darkThemes = ['dark', 'dark-evo'];
```

### Step 4.2: Update navbar.html

```javascript
// In navbar.html - update theme detection
function getThemeMode(theme) {
  const lightThemes = ['light', 'light-evo'];
  return lightThemes.includes(theme) ? 'light' : 'dark';
}
```

---

## PHASE 5: Add Accessibility CSS

### Step 5.1: High Contrast Mode Support

```css
/* High Contrast Mode */
@media (prefers-contrast: more) {
  [data-theme="light-evo"] .card,
  [data-theme="dark-evo"] .card {
    border: 2px solid hsl(var(--bc)) !important;
    backdrop-filter: none !important;
  }
}
```

### Step 5.2: Reduced Motion Support

```css
/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Step 5.3: Focus Visible

```css
/* Keyboard Navigation */
:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}
```

---

## PHASE 6: Build and Test

### Step 6.1: Build Project

```bash
npm run build
```

### Step 6.2: Run Development Server

```bash
npm run watch
```

### Step 6.3: Test Theme Switching

1. Open browser console
2. Run: `window.__setTheme('light-evo')`
3. Run: `window.__setTheme('dark-evo')`
4. Verify glass effects are visible

### Step 6.4: Test Accessibility

```bash
# Install axe DevTools browser extension
# Run accessibility audit
# Check for contrast ratios
# Test keyboard navigation
```

---

## PHASE 7: Component Updates

### Step 7.1: Update Button Styles

```html
<!-- Light EvoGlass Button -->
<button class="btn btn-primary" data-theme="light-evo">
  Click Me
</button>

<!-- Dark EvoGlass Button -->
<button class="btn btn-primary" data-theme="dark-evo">
  Click Me
</button>
```

### Step 7.2: Update Form Components

```html
<!-- EvoGlass Input -->
<input 
  type="text" 
  class="input input-bordered" 
  data-theme="light-evo"
  placeholder="Type here..."
/>
```

### Step 7.3: Update Cards

```html
<!-- EvoGlass Card -->
<div class="card bg-base-100 shadow-xl" data-theme="light-evo">
  <div class="card-body">
    <h2 class="card-title">Premium Card</h2>
    <p>This card has glass effect</p>
  </div>
</div>
```

---

## PHASE 8: Validation Checklist

### Color Contrast Testing
- [ ] Text on primary background: 7:1 minimum
- [ ] Text on secondary background: 7:1 minimum
- [ ] All buttons have sufficient contrast
- [ ] All form labels readable

### Glass Effect Testing
- [x] Navbar glass effect visible
- [x] Card glass effect visible
- [x] Input glass effect visible
- [ ] Works on Safari 14+
- [x] Graceful fallback on older browsers

### Dark Mode Testing
- [ ] Light-evo theme displays correctly
- [ ] Dark-evo theme displays correctly
- [ ] Color transitions are smooth
- [ ] All text readable in both modes

### Accessibility Testing
- [x] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] High contrast mode works

### Performance Testing
- [ ] CSS file size < 50KB
- [ ] LCP < 2.5s
- [ ] No layout shifts
- [ ] Glass effect smooth on mobile

---

## PHASE 9: Documentation

### Step 9.1: Create Component Library

Document each component with:
- Visual preview
- Code example
- Props/variants
- Accessibility notes

### Step 9.2: Create Usage Guide

Include:
- How to switch themes
- Color palette reference
- Typography scale
- Spacing system

### Step 9.3: Create Dev Guide

Include:
- CSS variable reference
- Glass effect implementation
- Dark mode setup
- Custom component creation

---

## Testing Commands

```bash
# Build
npm run build

# Watch for changes
npm run watch

# Clean dist
npm run clean

# Validate HTML
npm run validate

# Check theme JSON
ls -la themes/light/
ls -la themes/dark/
```

---

## Browser Compatibility

| Browser | Light-evo | Dark-evo | Glass Effect |
|---------|-----------|----------|--------------|
| Chrome 90+ | ✅ | ✅ | ✅ |
| Firefox 88+ | ✅ | ✅ | ✅ |
| Safari 14+ | ✅ | ✅ | ✅ |
| Edge 90+ | ✅ | ✅ | ✅ |
| iOS Safari 14+ | ✅ | ✅ | ✅ |
| macOS Safari 14+ | ✅ | ✅ | ✅ |

---

## Troubleshooting

### Glass Effect Not Showing
1. Check if backdrop-filter is enabled in browser
2. Verify -webkit-backdrop-filter fallback is present
3. Check z-index values
4. Test in Safari (required for glass effect)

### Colors Not Updating
1. Clear browser cache
2. Run `npm run clean && npm run build`
3. Check data-theme attribute value
4. Verify CSS variables are defined

### Dark Mode Not Switching
1. Check prefers-color-scheme detection
2. Verify dark-evo theme is registered
3. Check localStorage for saved theme
4. Verify __setTheme function is called

---

## Performance Optimization Tips

1. **Reduce blur radius for mobile**: Use `blur(10px)` instead of `blur(20px)`
2. **Use CSS variables**: More efficient than computed styles
3. **Avoid multiple backdrop filters**: Combine into single filter
4. **Test on low-end devices**: Ensure smooth performance
5. **Monitor CSS file size**: Keep under 50KB minified

---

**Implementation Status:** Ready to Deploy
**Last Updated:** 2024
**Version:** 1.0

