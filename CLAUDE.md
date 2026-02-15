# Google Form Creator

## Project Goal

Build a simple, intuitive tool for teachers to auto-generate Google Forms quizzes from class content. Teachers paste their content (notes, textbook material, etc.) into the app, and it generates a ready-to-use Google Form in quiz format.

## Key Principles

- **Teacher-first UX**: The UI must be dead simple, straightforward, and intuitive. Teachers are not technical users — every interaction should be obvious and require zero learning curve.
- **No authentication**: Access is controlled via access keys. The site loads an access key entry page first; only valid keys grant access to the app.
- **Minimal friction**: Paste content, generate quiz, done. No unnecessary steps or configuration.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React (`lucide-react`)
- **Font**: Inter (via `next/font/google`)
- **Language**: JavaScript (no TypeScript)
- **Path alias**: `@/*` maps to `./src/*`

## Design System

Full reference: `docs/design-system/README.md`

Rules to follow on every UI change:
- **Light theme only** — no dark mode
- **Neutral colors only** — Tailwind `slate` scale, no accent/brand color
- **No gradients, no box shadows, no emojis**
- **Borders** for inputs/cards (`border-slate-200 rounded-lg`), **background contrast** (`bg-slate-50` vs `bg-white`) for page sections
- **Spacing**: 4px base unit, `p-4` mobile page padding, `p-12` desktop, `max-w-xl` content width
- **Typography**: `text-sm` body, `text-2xl font-semibold` page titles, `text-lg font-medium` section titles
- **Icons**: Lucide React, 16px inline / 20px standalone, only where they add clarity
- **Components**: Use `Button`, `Input`, `Textarea`, `Card` from `@/components/ui`

## Architecture

- `src/app/` — Next.js App Router pages and layouts
- `src/components/` — Reusable UI components
- `public/` — Static assets
- `docs/` — Feature documentation (see below)

## Documentation

All major features are documented in `docs/`. Each feature gets its own subfolder with a document covering:
- What the feature does
- How it works (flow/logic)
- Data structures and options
- Any API routes or integrations involved

Structure: `docs/<feature-name>/README.md`

## Access Key Flow

1. User lands on the site and sees an access key input screen
2. User enters their access key
3. Key is validated (server-side)
4. If valid, user gains access to the main app
5. If invalid, user sees a clear error message
