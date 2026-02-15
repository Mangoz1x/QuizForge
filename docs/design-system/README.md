# Design System

## Principles

- Light theme only
- Clean, polished, minimal
- No gradients, no box shadows, no emojis
- Neutral colors only (slate gray scale)
- Icons from Lucide React, used sparingly and appropriately
- Every element should feel intentional

---

## Colors

All colors use Tailwind's `slate` scale. No accent/brand color.

| Token            | Tailwind Class  | Hex       | Usage                          |
| ---------------- | --------------- | --------- | ------------------------------ |
| Background       | `bg-white`      | `#ffffff` | Main page background           |
| Surface          | `bg-slate-50`   | `#f8fafc` | Section backgrounds, page fill |
| Border           | `border-slate-200` | `#e2e8f0` | Input borders, card borders |
| Border hover     | `border-slate-300` | `#cbd5e1` | Hovered input/card borders  |
| Text primary     | `text-slate-900`   | `#0f172a` | Headings, primary text      |
| Text secondary   | `text-slate-600`   | `#475569` | Body text, descriptions     |
| Text tertiary    | `text-slate-400`   | `#94a3b8` | Placeholders, hints         |
| Button primary bg   | `bg-slate-900`  | `#0f172a` | Primary action buttons     |
| Button primary text | `text-white`    | `#ffffff` | Primary button text        |
| Button primary hover | `bg-slate-800` | `#1e293b` | Primary button hover       |
| Button secondary bg  | `bg-white`     | `#ffffff` | Secondary buttons          |
| Button secondary border | `border-slate-200` | `#e2e8f0` | Secondary button border |
| Button secondary hover  | `bg-slate-50`  | `#f8fafc` | Secondary button hover   |
| Disabled         | `bg-slate-100`  | `#f1f5f9` | Disabled state background    |
| Disabled text    | `text-slate-300` | `#cbd5e1` | Disabled state text          |
| Focus ring       | `ring-slate-400` | `#94a3b8` | Focus indicator              |
| Error            | `text-red-600`  | `#dc2626` | Error messages               |
| Error border     | `border-red-300` | `#fca5a5` | Error state borders         |
| Success          | `text-green-600` | `#16a34a` | Success messages             |

---

## Typography

**Font**: Inter (loaded via `next/font/google`)

| Element       | Classes                          | Size   |
| ------------- | -------------------------------- | ------ |
| Page title    | `text-2xl font-semibold`         | 24px   |
| Section title | `text-lg font-medium`            | 18px   |
| Body          | `text-sm text-slate-600`         | 14px   |
| Label         | `text-sm font-medium text-slate-700` | 14px |
| Small/hint    | `text-xs text-slate-400`         | 12px   |
| Button        | `text-sm font-medium`            | 14px   |

---

## Spacing

Base unit: **4px** (Tailwind default). Use Tailwind spacing scale consistently.

| Context                    | Value   | Tailwind |
| -------------------------- | ------- | -------- |
| Page padding (mobile)      | 16px    | `p-4`    |
| Page padding (desktop)     | 48px    | `p-12`   |
| Page max width             | 640px   | `max-w-xl` |
| Section gap                | 32px    | `gap-8`  |
| Component internal padding | 16px    | `p-4`    |
| Input padding              | 10px 12px | `px-3 py-2.5` |
| Tight element spacing      | 8px     | `gap-2`  |
| Normal element spacing     | 16px    | `gap-4`  |
| Loose element spacing      | 24px    | `gap-6`  |
| Label to input gap         | 6px     | `gap-1.5` |

---

## Borders & Containers

- **Inputs/cards**: 1px solid `slate-200` border, `rounded-lg` (8px)
- **Page sections**: No border, use `bg-slate-50` vs `bg-white` contrast
- **No box shadows anywhere**
- **No gradients anywhere**

| Element    | Border radius | Border              |
| ---------- | ------------- | ------------------- |
| Buttons    | `rounded-lg`  | None (primary) / `border-slate-200` (secondary) |
| Inputs     | `rounded-lg`  | `border-slate-200`  |
| Cards      | `rounded-lg`  | `border-slate-200`  |
| Textarea   | `rounded-lg`  | `border-slate-200`  |

---

## Icons

- **Library**: Lucide React (`lucide-react`)
- **Default size**: 16px (`size={16}`) for inline, 20px (`size={20}`) for standalone
- **Stroke width**: Default (2)
- **Color**: Inherit from text color (`currentColor`)
- **Usage**: Only where they add clarity. Never decorative.

---

## Interactive States

| State     | Style                                       |
| --------- | ------------------------------------------- |
| Default   | Base colors as defined above                |
| Hover     | Slight background/border shift (one step darker) |
| Focus     | `outline-none ring-2 ring-slate-400 ring-offset-2` |
| Disabled  | `opacity-50 cursor-not-allowed`             |
| Error     | `border-red-300` border, `text-red-600` message |

---

## Components

All reusable components live in `src/components/ui/`.

### Button

Two variants: `primary` and `secondary`.

```
Primary:  bg-slate-900 text-white hover:bg-slate-800
Secondary: bg-white border border-slate-200 text-slate-700 hover:bg-slate-50
Both:     rounded-lg px-4 py-2.5 text-sm font-medium transition-colors
          focus: outline-none ring-2 ring-slate-400 ring-offset-2
          disabled: opacity-50 cursor-not-allowed
```

Sizes: `sm` (px-3 py-1.5 text-xs), `md` (default), `lg` (px-5 py-3 text-base)

### Input

```
bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900
placeholder:text-slate-400
hover: border-slate-300
focus: outline-none ring-2 ring-slate-400 ring-offset-2
error: border-red-300
```

### Textarea

Same as Input, with `resize-none` and a min-height.

### Card

```
bg-white border border-slate-200 rounded-lg p-4
```

### Label

```
text-sm font-medium text-slate-700
```
