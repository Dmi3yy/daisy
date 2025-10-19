# EvoGlass Theme - Product Requirements Document (PRD)
## Based on Apple Design Guidelines & Liquid Glass Design System

---

## 1. OVERVIEW

### Vision
Create a premium, modern theme called **EvoGlass** that implements Apple's Liquid Glass design philosophy with Tailwind CSS + daisyUI, achieving 100% compliance with Apple's Human Interface Guidelines (HIG).

### Core Values
- **Clarity**: Clear hierarchy and readable typography
- **Deference**: UI elements support content without overwhelming it
- **Depth**: Visual layers create spatial hierarchy using glass effects
- **Coherence**: Consistent visual language across all components
- **Accessibility**: WCAG AAA compliance with adaptive colors

---

## 2. COLOR SYSTEM (Apple HIG Compliant)

### 2.1 Light Mode (light-evo)

#### Base Colors (Semantic)
```
--color-base-100: oklch(99% 0.003 240)    # Pure white background
--color-base-200: oklch(97% 0.005 240)    # Elevated surface
--color-base-300: oklch(94% 0.008 240)    # Secondary surface
--color-base-content: oklch(20% 0.05 240) # Primary text (high contrast)
```

#### Brand Colors
```
--color-primary: oklch(55% 0.20 240)      # Apple Blue (System Blue)
--color-primary-content: oklch(99% 0.003 240)

--color-secondary: oklch(65% 0.18 200)    # Apple Cyan
--color-secondary-content: oklch(99% 0.003 200)

--color-accent: oklch(70% 0.17 160)       # Apple Green
--color-accent-content: oklch(99% 0.003 160)
```

#### Semantic Status Colors
```
--color-info: oklch(65% 0.18 220)         # System Blue (Information)
--color-info-content: oklch(99% 0.003 220)

--color-success: oklch(60% 0.20 145)      # System Green
--color-success-content: oklch(99% 0.003 145)

--color-warning: oklch(75% 0.18 60)       # System Orange
--color-warning-content: oklch(20% 0.05 60)

--color-error: oklch(60% 0.22 25)         # System Red
--color-error-content: oklch(99% 0.003 25)
```

#### Neutral & Secondary Colors
```
--color-neutral: oklch(45% 0.01 240)      # Gray for disabled states
--color-neutral-content: oklch(99% 0.003 240)
```

### 2.2 Dark Mode (dark-evo)

#### Base Colors (Semantic)
```
--color-base-100: oklch(20% 0.02 240)     # Deep black background
--color-base-200: oklch(25% 0.03 240)     # Elevated surface (dark)
--color-base-300: oklch(30% 0.04 240)     # Secondary surface (dark)
--color-base-content: oklch(95% 0.05 240) # Primary text (high contrast)
```

#### Brand Colors (Adjusted for dark backgrounds)
```
--color-primary: oklch(60% 0.20 240)      # Apple Blue (lighter for dark)
--color-primary-content: oklch(20% 0.02 240)

--color-secondary: oklch(70% 0.18 200)    # Apple Cyan (lighter)
--color-secondary-content: oklch(20% 0.02 200)

--color-accent: oklch(75% 0.17 160)       # Apple Green (lighter)
--color-accent-content: oklch(20% 0.02 160)
```

#### Semantic Status Colors (Dark Mode)
```
--color-info: oklch(65% 0.18 220)         # System Blue
--color-info-content: oklch(20% 0.02 220)

--color-success: oklch(65% 0.20 145)      # System Green (lighter)
--color-success-content: oklch(20% 0.02 145)

--color-warning: oklch(80% 0.18 60)       # System Orange (lighter)
--color-warning-content: oklch(20% 0.02 60)

--color-error: oklch(65% 0.22 25)         # System Red (lighter)
--color-error-content: oklch(20% 0.02 25)
```

#### Neutral (Dark Mode)
```
--color-neutral: oklch(60% 0.01 240)      # Light gray for disabled
--color-neutral-content: oklch(20% 0.02 240)
```

---

## 3. GLASS EFFECT SPECIFICATIONS

### 3.1 Material Design (Apple Liquid Glass)

#### Primary Glass Surface
```css
background: rgba(var(--base-100-rgb), 0.7);
backdrop-filter: blur(20px) saturate(180%);
-webkit-backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.2);  /* Light mode */
```

#### Secondary Glass Surface (More frosted)
```css
background: rgba(var(--base-200-rgb), 0.5);
backdrop-filter: blur(10px) saturate(150%);
-webkit-backdrop-filter: blur(10px) saturate(150%);
border: 1px solid rgba(255, 255, 255, 0.1);
```

#### Dark Mode Glass
```css
background: rgba(30, 30, 30, 0.6);
backdrop-filter: blur(20px) saturate(150%);
-webkit-backdrop-filter: blur(20px) saturate(150%);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### 3.2 Depth Layers (Z-index & Shadow Strategy)

```
Level 1 (Base):      z-index: 0,   box-shadow: none
Level 2 (Elevated):  z-index: 10,  box-shadow: 0 2px 4px rgba(0,0,0,0.1)
Level 3 (Floating):  z-index: 20,  box-shadow: 0 8px 16px rgba(0,0,0,0.15)
Level 4 (Modal):     z-index: 1000, box-shadow: 0 20px 40px rgba(0,0,0,0.2)
```

---

## 4. TYPOGRAPHY

### 4.1 Font Family
```
Primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica Neue, sans-serif
Code: "Menlo", "Monaco", monospace
```

### 4.2 Type Scale

| Role | Size | Weight | Line-Height |
|------|------|--------|-------------|
| Display | 32px | 700 | 1.2 |
| Heading 1 | 28px | 700 | 1.3 |
| Heading 2 | 24px | 600 | 1.3 |
| Heading 3 | 20px | 600 | 1.4 |
| Body Large | 16px | 400 | 1.5 |
| Body | 14px | 400 | 1.6 |
| Label | 12px | 500 | 1.4 |
| Caption | 11px | 400 | 1.5 |

---

## 5. COMPONENT SPECIFICATIONS

### 5.1 Cards
```css
.card {
  background: hsl(var(--b2) / 0.95);
  backdrop-filter: blur(10px) saturate(150%);
  border-radius: var(--radius-box);  /* 1.125rem */
  border: 1px solid hsl(var(--b3) / 0.3);
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

### 5.2 Buttons
```
Primary: bg-primary, text-primary-content, rounded-lg (0.75rem)
Secondary: bg-base-200, text-base-content, border-base-300
Tertiary: bg-transparent, text-primary, border-primary
Disabled: opacity-50, cursor-not-allowed
```

### 5.3 Forms & Inputs
```css
.input, .select, .textarea {
  background: hsl(var(--b1) / 0.8);
  border-radius: var(--radius-field);  /* 0.75rem */
  border: 1px solid hsl(var(--b3) / 0.5);
  padding: 0.75rem 1rem;
}

.input:focus {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}
```

### 5.4 Navigation (Navbar)
```css
.navbar {
  background: hsl(var(--b2) / 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid hsl(var(--b3) / 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
}
```

---

## 6. SPACING & LAYOUT

### 6.1 Border Radius
```
--radius-selector: 1rem      # Checkboxes, badges, toggles
--radius-field: 0.75rem      # Buttons, inputs, tabs
--radius-box: 1.125rem       # Cards, modals, alerts
```

### 6.2 Spacing Scale (Tailwind 4)
```
xs: 0.25rem (4px)
sm: 0.5rem  (8px)
md: 1rem    (16px)
lg: 1.5rem  (24px)
xl: 2rem    (32px)
2xl: 3rem   (48px)
```

### 6.3 Gap & Padding
```
Standard padding: 1.5rem
Standard gap: 1rem
Compact spacing: 0.75rem
Spacious spacing: 2rem
```

---

## 7. INTERACTIVE STATES

### 7.1 Button States
```css
/* Normal */
btn { /* base styles */ }

/* Hover */
btn:hover { 
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Active/Pressed */
btn:active {
  transform: translateY(0);
}

/* Disabled */
btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Focus */
btn:focus {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}
```

### 7.2 Form States
```
default: border-base-300
hover: border-base-400
focus: border-primary, outline
error: border-error, error text
success: border-success
disabled: opacity-50, background-base-200
```

---

## 8. ANIMATIONS & TRANSITIONS

### 8.1 Timing Functions
```
Fast: 150ms ease-out (interactions)
Normal: 300ms ease-in-out (transitions)
Slow: 500ms ease-in-out (page transitions)
```

### 8.2 Effects
```css
/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, opacity;
  transition-duration: 300ms;
  transition-timing-function: ease-in-out;
}

/* Hover lift effect */
.interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}
```

---

## 9. ACCESSIBILITY (WCAG 2.1 AAA)

### 9.1 Color Contrast Requirements

| Type | Light Mode | Dark Mode | Ratio |
|------|-----------|-----------|-------|
| Normal text | #000000 on #FFFFFF | #FFFFFF on #000000 | 21:1 |
| Large text | #000000 on #F0F0F0 | #E8E8E8 on #1A1A1A | 12:1 |
| UI components | Per component | Per component | 7:1 minimum |

### 9.2 Interactive Elements
```
Minimum tap target: 44x44px
Focus indicators: 2px solid outline
High contrast mode: Supported
Reduced motion: Supported
```

---

## 10. RESPONSIVE DESIGN

### 10.1 Breakpoints
```
Mobile: 0px - 640px
Tablet: 640px - 1024px
Desktop: 1024px+
```

### 10.2 Responsive Classes
```
Text: text-sm (mobile) → text-base (tablet) → text-lg (desktop)
Padding: p-4 sm:p-6 lg:p-8
Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
```

---

## 11. DARK MODE IMPLEMENTATION

### 11.1 CSS Custom Properties
```css
:root[data-theme="light-evo"] {
  color-scheme: light;
  /* Light mode colors */
}

:root[data-theme="dark-evo"] {
  color-scheme: dark;
  /* Dark mode colors */
}
```

### 11.2 Media Query Fallback
```css
@media (prefers-color-scheme: light) {
  :root:not([data-theme]) { /* light-evo colors */ }
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) { /* dark-evo colors */ }
}
```

---

## 12. IMPLEMENTATION CHECKLIST

### Phase 1: Core Colors ✓
- [ ] Define all semantic colors in OKLCH format
- [ ] Test contrast ratios for accessibility
- [ ] Create CSS custom properties
- [ ] Validate against WCAG AAA

### Phase 2: Glass Effects
- [ ] Implement backdrop-filter effects
- [ ] Test browser compatibility (WebKit support)
- [ ] Add fallback for unsupported browsers
- [ ] Optimize blur radius values

### Phase 3: Components
- [ ] Style cards with glass effect
- [ ] Update buttons with new colors
- [ ] Style forms with proper focus states
- [ ] Implement navigation with glass navbar

### Phase 4: Dark Mode
- [ ] Create dark-evo theme variant
- [ ] Test all components in dark mode
- [ ] Verify color contrasts
- [ ] Test prefers-color-scheme detection

### Phase 5: Accessibility
- [ ] Run automated contrast tests
- [ ] Manual keyboard navigation testing
- [ ] Screen reader testing
- [ ] Test with high contrast mode

### Phase 6: Responsive Design
- [ ] Mobile-first responsive tests
- [ ] Tablet layout testing
- [ ] Desktop layout testing
- [ ] Touch target size validation

### Phase 7: Performance
- [ ] Optimize glass effect performance
- [ ] Reduce blur radius for low-end devices
- [ ] Minify CSS
- [ ] Test load times

### Phase 8: Documentation
- [ ] Create component library documentation
- [ ] Write usage guidelines
- [ ] Provide code examples
- [ ] Document CSS variables

---

## 13. TECHNICAL SPECIFICATIONS

### 13.1 CSS Variables Required
```
Color variables: --color-base-*, --color-primary, etc.
Radius variables: --radius-selector, --radius-field, --radius-box
Size variables: --size-selector, --size-field
Border variables: --border
Depth variables: --depth (0 or 1)
Noise variables: --noise (0 or 1)
```

### 13.2 Browser Support
```
Chrome/Edge: 90+
Firefox: 88+
Safari: 14+
iOS Safari: 14+
macOS Safari: 14+
```

### 13.3 Feature Detection
```
backdrop-filter: Core to glass effect
color-scheme: For dark mode detection
prefers-color-scheme: For system preference
prefers-reduced-motion: For accessibility
```

---

## 14. QUALITY ASSURANCE

### 14.1 Testing Requirements
- [ ] Visual regression testing on all components
- [ ] Cross-browser testing
- [ ] Accessibility audit (axe DevTools)
- [ ] Performance profiling
- [ ] Mobile device testing

### 14.2 Performance Targets
```
LCP (Largest Contentful Paint): < 2.5s
FID (First Input Delay): < 100ms
CLS (Cumulative Layout Shift): < 0.1
CSS file size: < 50KB (minified)
```

---

## 15. RESOURCES & REFERENCES

### Apple Design Guidelines
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)
- [Color](https://developer.apple.com/design/human-interface-guidelines/color)
- [Typography](https://developer.apple.com/design/human-interface-guidelines/typography)

### DaisyUI Documentation
- [DaisyUI Docs](https://daisyui.com)
- [DaisyUI Themes](https://daisyui.com/docs/themes/)
- [DaisyUI Components](https://daisyui.com/components/)

### Accessibility Standards
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## 16. SUCCESS METRICS

✅ 100% compliance with Apple HIG
✅ WCAG 2.1 AAA accessibility rating
✅ All components support light/dark mode
✅ Glass effect works on 95%+ of target browsers
✅ Performance score > 90 on Lighthouse
✅ Zero layout shifts (CLS = 0)
✅ All interactive elements properly focused
✅ Complete documentation provided

---

**Document Version:** 1.0
**Last Updated:** 2024
**Status:** Ready for Implementation
