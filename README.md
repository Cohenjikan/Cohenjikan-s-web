# cohenjikan.com

Personal site for Cohen. Live at <https://cohenjikan.com>.

Since October 2026 the site is a single static page: the name fills the hero and the project
covers stream through its letters as soft colour (three.js, flat orthographic). Scrolling dives
through the C into a full-bleed cover that becomes a scrolling reel, and each project opens into
its own case page.
There is no build step. GSAP, ScrollTrigger, three.js and Lenis load from public CDNs.

---

## Layout

```
site/
├── index.html        # the whole site: markup, styles, script, and the project data (const P)
├── 404.html          # redirects old /projects/<slug> links to the matching case page
├── CNAME             # custom domain for GitHub Pages
├── favicon.svg
└── tex/
    ├── <project>.jpg # 2:1 covers used by the ring, the reel and the case-page hero
    └── case/         # screenshots and GIFs shown in the case pages
```

## Run locally

```bash
python -m http.server 5173 --directory site
```

Then open <http://localhost:5173>. Any static file server works.

## Add or edit a project

1. Add a 2:1 cover at `site/tex/<name>.jpg` (2400×1200 works well).
2. Put case-page screenshots in `site/tex/case/`.
3. In `site/index.html`, add an entry to the `P` array. Each entry has:
   - `id` (used for the `#id` link to the case page), `name`, `cn`, `tex`, `tags`, `desc`, `links`
   - optional `stars` (shown only when 50 or more), `role` (`Contributor` or `Fork`), `fresh` (shows a New chip)
   - `case`: `tagline`, `intro`, `features`, `how`, `facts`, `stack`, `license`, `gallery`,
     and optionally `contribution`, `note`, `chart`

Case pages are reachable directly at `https://cohenjikan.com/#<id>`.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which uploads `site/` to GitHub Pages.
Pages must be set to **Source: GitHub Actions** (it already is).

## History

The previous Vite + React + TypeScript version of the site lives in the git history.
Its last commit on `main` is `fb43ab5` if anything needs to be recovered.
