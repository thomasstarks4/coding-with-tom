# Coding With Tom

Portfolio site for **Thomas Starks** — full-stack software engineer, Navy veteran, and builder of web apps, education tools, and games.

## Stack

- **React 18** + **Vite**
- **React Router 6** with lazy-loaded routes
- **Tailwind CSS** + shared design-system components
- **Vitest** for tests

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # output → dist/
npm run preview    # preview production build
npm test           # run tests
```

## Project visibility

Public-facing projects are defined in [`src/config/project-registry.js`](src/config/project-registry.js):

| Tier | Meaning |
|------|---------|
| `featured` | Shown on Home + top of Projects |
| `listed` | Shown in Projects grid |
| `hidden` | Route works via direct URL but not linked or indexed |

**Hidden for now:** store, Grow App, OSRS Helper, Meal Tracker, SimplyDo, Birthday Invitation Maker, WIP game placeholders.

## Structure

```
src/
  app/              # App shell + route modules
  config/           # Project visibility registry
  design-system/    # Shared UI primitives
  features/portfolio/   # Home, About, Contact, Projects
  components/       # Legacy app components (games, learning hub, etc.)
```

## Deploy (Hostinger)

1. `npm run build`
2. Upload contents of `dist/` to `public_html/`
3. Ensure `.htaccess` SPA rewrite rules are in place (see `public/.htaccess`)

PHP APIs (e.g. progress-tracker) are excluded from SPA rewrite via `.htaccess` rules.
