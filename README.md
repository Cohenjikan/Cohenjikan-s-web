# cohenjikan.com

Personal portfolio for Cohen — built with Vite + React + TypeScript + Tailwind, with [react-bits](https://github.com/DavidHDev/react-bits) for the high-end visual effects (Aurora / Silk / Prism backgrounds, Magic Bento, Lanyard, Staggered Menu, etc.).

Live at <https://cohenjikan.com>.

---

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
npm run preview  # serve dist/ locally
```

> Node 20+ recommended. The build pulls in three.js / OGL / GSAP / framer-motion — first install takes a minute or two.

---

## How to change things

### Add or edit a project

1. Drop screenshots into `public/projects/<slug>/`. Convention:
   - `hero.png` — main hero image used on the project card and detail-page hero
   - `feature-1.jpg`, `feature-2.jpg`, `feature-3.jpg` — one per feature row
   - Missing files automatically render a "Screenshot coming soon" placeholder, so partial coverage is fine.
2. Open [`src/content/projects.ts`](src/content/projects.ts) and add a new entry to the `projects` array. Each entry follows `ProjectDetail` and supports `zh` / `en` for tagline / description / features.
3. The project will appear on the home page Bento grid and gain a route at `/projects/<slug>` automatically.

### Edit the About copy

Just edit the `zh` and `en` strings in [`src/content/about.ts`](src/content/about.ts).

### Edit any UI string

All copy lives in [`src/i18n/index.ts`](src/i18n/index.ts) under the `zh` / `en` resource objects.

### Add or remove a background

Backgrounds are listed in [`src/components/BackgroundSwitcher.tsx`](src/components/BackgroundSwitcher.tsx) inside the `ENTRIES` array. Each entry declares a `weight` of `light` or `heavy` — heavy backgrounds only enter the random pool on desktops with `navigator.hardwareConcurrency >= 4`.

To add one:
```tsx
const NewBg = lazy(() => import('./reactbits/Backgrounds/SomeBg/SomeBg'));
// ...
{ id: 'somebg', weight: 'heavy', render: () => <NewBg ... /> }
```

To remove one, just delete its entry.

### Switch the color theme

Two dark themes are defined in [`src/styles/globals.css`](src/styles/globals.css) as CSS variables:

- **Theme A — Violet → Cyan** (default, applied to `:root`)
- **Theme B — Magenta → Lime** (set `<html data-theme="magenta-lime">`)

To make Theme B the default, swap the CSS variables under `:root` with the ones under `[data-theme='magenta-lime']`, or add `data-theme="magenta-lime"` to `<html>` in `index.html`.

### Update fonts

`public/fonts/` holds the two woff2 files. `src/styles/globals.css` declares the `@font-face` rules — replace files there and update the CSS to match.

---

## Project layout

```
.
├── _legacy/                 # old static HTML kept for reference (gitignored)
├── public/
│   ├── CNAME                # custom-domain marker for GitHub Pages
│   ├── 404.html             # SPA-routing shim
│   ├── fonts/
│   └── projects/<slug>/     # per-project screenshots
├── src/
│   ├── App.tsx              # router + layout shell
│   ├── main.tsx             # entry
│   ├── i18n/                # react-i18next setup
│   ├── content/             # about + project data (zh / en)
│   ├── pages/               # HomePage, ProjectDetailPage
│   ├── components/
│   │   ├── BackgroundSwitcher.tsx
│   │   ├── layout/          # SiteNav (Staggered Menu), SiteDock, Footer
│   │   ├── sections/        # Hero, About, Projects, Social, Contact
│   │   └── reactbits/       # copied react-bits components (ts-tailwind variant)
│   └── styles/
└── .github/workflows/deploy.yml
```

---

## Deployment

The repository deploys to GitHub Pages via the workflow at `.github/workflows/deploy.yml`. Any push to `main` triggers a build and publishes `dist/` to the `github-pages` environment.

One-time GitHub setup:

1. In **Settings → Pages → Build and deployment**, set **Source** to `GitHub Actions`.
2. In **Settings → Pages → Custom domain**, enter `cohenjikan.com`. The `public/CNAME` file is already in place so the build will preserve it.
3. Configure your DNS:
   - Apex (`cohenjikan.com`) → `A` records pointing at `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` (optional) → `CNAME` to `<your-github-username>.github.io`

Routes such as `/projects/sync-station` are handled via the SPA fallback in `public/404.html` plus the redirect shim in `index.html`.

---

## Notes

- `_legacy/` is gitignored. The original static HTML (`_legacy/index.html`) and the originating screenshots live there for reference only; nothing references them at build time.
- Lanyard on the Contact section uses the upstream react-bits GLB geometry with a local `cohen-card.svg` texture applied in the React material layer, so the card face can be edited without re-baking the GLB in Blender.
- `prefers-reduced-motion: reduce` disables the background transition, the Lanyard 3D scene, and most decorative animations.
- Mobile (< 768px): the heavy backgrounds (Prism / Silk / Iridescence / Beams) are excluded from the random pool, the Bento collapses to one column, and Lanyard is hidden.
