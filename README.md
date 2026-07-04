# Coding With Tom

Portfolio site for **Thomas Starks** — full-stack software engineer, Navy veteran, and builder of web apps, education tools, and games.

## Stack

- **React 18** + **Vite 6**
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

**Hidden for now:** store, Grow App, OSRS Helper, Meal Tracker, SimplyDo, Birthday Invitation Maker.

Update `public/robots.txt` and `public/sitemap.xml` when changing visibility.

## Structure

```
src/
  app/                  # App shell + route modules
  config/               # Project visibility registry
  design-system/        # Shared UI primitives + usePageTitle
  features/portfolio/     # Home, About, Contact, Projects
  components/           # App implementations (games, learning hub, etc.)
```

## Deploy (Hostinger)

1. `npm run build` — outputs to `dist/` (includes `public/.htaccess`, `robots.txt`, `sitemap.xml`)
2. Upload **contents of `dist/`** to `public_html/`
3. PHP APIs (e.g. progress-tracker) use rules in `public/.htaccess` to bypass SPA rewrite

**Store:** PHP backend may exist in `deploy/hostinger/store/` but has no public UI or routes until re-enabled in `project-registry.js`.

## Route map

| Path | App |
|------|-----|
| `/`, `/about`, `/contact`, `/projects` | Portfolio shell |
| `/sentence-starters`, `/starter`, `/writer`, `/highlighter`, `/math` | Tom's Learning Hub (`/tuner` redirects to `/starter#configure`) |
| `/JavaScriptIDE`, `/label-maker`, `/progress-tracker` | Utility apps |
| `/games/spirit-quest`, `/games/forest-platformer` | Games |
| `/tpc/home`, `/tpc/chat`, `/tpc/about` | Truly Private Chat |

Hidden routes (unlisted): `/meal-tracker`, `/simplydo`, `/birthday-invitation-maker`, `/osrs-wilderness`, `/grow-app`
