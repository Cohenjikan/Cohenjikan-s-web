# Claude Development Log

Notes from work done by Claude (Anthropic's Claude Code) on this project.
Entries are roughly chronological; Codex took over for the middle stretch and
wrote `CODEX_DEV_LOG.md` — the two logs are complementary, not duplicates.
Read them in this order to reconstruct full history:

1. `CLAUDE_DEV_LOG.md` (this file) — Project Bootstrap entry
2. `CLAUDE_DEV_LOG.md` — Bug Fix Pass entry
3. `CLAUDE_DEV_LOG.md` — BackgroundSwitcher Rewrite entry
4. `CODEX_DEV_LOG.md` — all 6 codex entries (Lanyard / footer / textures / merge)
5. `CLAUDE_DEV_LOG.md` — Lanyard Round 2 onward (resumed from codex)

---

## 2026-05-13 Project Bootstrap & Initial Section Build

### Goal
- Replace the existing static `cohenjikan.com` HTML site with a React-based SPA
  that hosts react-bits style visual effects (Aurora / Silk / Prism backgrounds,
  Lanyard 3D card, StaggeredMenu, MagicBento, etc.), zh / en i18n, and a path
  to per-project detail pages.
- Land deployment-ready output for GitHub Pages with a custom domain.

### Investigation Notes
- Two source dirs were available locally: `C:\Users\Cohen\Desktop\cohenjikan.com`
  (legacy site + a `lib/` folder with `JetBrainsMono*.woff2`) and
  `C:\Users\Cohen\Desktop\react-bits-main` (the full react-bits monorepo). The
  user expected a zipped components folder but it was actually unpacked source.
- The user supplied three screenshots only — `sync.png`, `primerscore.png`,
  `tinytalk.png` — one per project. Per-feature screenshots would come later.
- The user explicitly asked to scaffold Vite + React + TypeScript + Tailwind v3
  (not v4), with i18n through react-i18next and a router via react-router-dom.
- react-bits ships with two variants — `src/ts-tailwind/` and a JS variant; we
  pulled the TS-Tailwind variant. Their tooling chain assumes Tailwind v4
  (`@tailwindcss/vite`), so we replicate it manually on Tailwind v3 with
  PostCSS + autoprefixer.

### Major Changes
- **Repo layout under** `cohenjikan.com/`:
  - `_legacy/` — moved the old `index.html` + screenshots + `lib/` here. Gitignored.
  - `public/fonts/` — copied `JetBrainsMono.woff2` + `JetBrainsMono-Bold.woff2`.
  - `public/projects/<slug>/hero.png` — each project's screenshot.
  - `public/CNAME = cohenjikan.com`, `public/404.html` SPA shim, `public/logo.svg`.
  - `_assets/` was intended for the user's zip drop; never used in the final flow.
- **Config files**:
  - `package.json` pinned to React 18.3.x and `@react-three/fiber` 8.x (NOT
    react-bits's React 19 + r3f 9, which the host environment's Node 24 / npm 11
    handled but the rest of the ecosystem wasn't ready for at the time).
  - `vite.config.ts` with `base: '/'`, `assetsInclude: ['**/*.glb']`, and a
    `manualChunks` split (`r3f`, `gsap`, `ogl`, `motion`) to keep the main
    bundle reasonable.
  - `tsconfig.json` with `moduleResolution: bundler`, `jsx: react-jsx`,
    `strict: true`, `noUnusedLocals: false` (to keep iteration fast).
  - `tailwind.config.ts` with theme tokens wired to CSS variables (`--color-bg`,
    `--color-accent`, etc.), plus a custom `bg-accent-gradient` background-image
    and `star-movement-*` keyframes for `<StarBorder>`.
  - `postcss.config.js` with `tailwindcss` + `autoprefixer`.
  - `.gitignore` excludes `_legacy/`, `node_modules`, `dist`, `*.tsbuildinfo`.
- **react-bits component copies** — pulled 22 components verbatim from
  `react-bits-main/src/ts-tailwind/` into `src/components/reactbits/`. Categories:
  - Backgrounds (8): Aurora, Grainient, LineWaves, ColorBends, Prism, Silk,
    Iridescence, Beams
  - Components (9): StaggeredMenu, MagicBento, BorderGlow, TiltedCard,
    ChromaGrid, Lanyard, Dock, GlassIcons (later), SpotlightCard (later)
  - TextAnimations (3): BlurText, TrueFocus, ScrollFloat
  - Animations (4): StarBorder, ShapeBlur, GradualBlur, Magnet
  - Rationale for vendoring instead of `npm install`: react-bits isn't published
    to npm; their canonical install flow is `npx jsrepo add`. Copying source
    gives us full edit control for things like the Lanyard texture and the
    Card-vs-h2 nesting fix.
- **Content layer**:
  - `src/content/about.ts` — exports `about` and `heroSubtitle` as `{zh, en}`.
  - `src/content/projects.ts` — `ProjectDetail` shape (slug, name, tagline,
    description, tags, githubUrl, liveUrl, heroImage, features[], techStack),
    and a `projects` array seeded with Sync Station / PrimerScore Web / Tiny
    Voice Room. Includes `getProjectBySlug` helper. Each project has 3 feature
    slots pre-allocated with placeholder copy + image paths under
    `/projects/<slug>/feature-<n>.jpg` (which fall back to a "Screenshot
    coming soon" panel when the image 404s).
- **i18n**: `src/i18n/index.ts` runs `i18next + LanguageDetector +
  initReactI18next`. `localStorage` is the priority detection source so the
  user's last toggle wins on refresh.
- **Routing + layout**:
  - `src/main.tsx` → React 18 `createRoot`, wraps `<BrowserRouter>`.
  - `src/App.tsx` → `BackgroundProvider` → `SiteNav` → `Routes`
    (`/`, `/projects/:slug`, catch-all to home) → originally `Footer` + `SiteDock`.
  - `src/pages/HomePage.tsx` originally composed
    `Hero → About → Projects → Social → Contact` separated by `<GradualBlur>`
    section dividers; the divider component pulled into a tiny inline wrapper.
  - `src/pages/ProjectDetailPage.tsx` — back-button + hero tilt + alternating
    feature rows + tech-stack pills + automatic placeholder when images 404.
- **BackgroundProvider (first attempt)**:
  - 8 entries split by `weight: 'light' | 'heavy'`. Heavy bgs (Prism, Silk,
    Iridescence, Beams) only enter the random pool when
    `navigator.hardwareConcurrency >= 4` AND viewport is desktop.
  - `pickRandom(pool, exclude)` to avoid hitting the same bg twice.
  - First implementation used `<AnimatePresence mode="sync">` with a
    `motion.div` keyed by `entry.id`, `initial={{opacity: 0, filter: 'blur(24px)'}}`
    and `animate={{opacity: 1, filter: 'blur(0px)'}}`. This LOOKED right on
    paper but failed at runtime — see the "BackgroundSwitcher Rewrite" entry
    below for the postmortem.
- **GitHub Pages plumbing**:
  - `.github/workflows/deploy.yml` — Node 20 + `npm ci` + `npm run build` +
    `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`, triggered on
    push to main.
  - `public/404.html` — the [spa-github-pages](https://github.com/rafgraph/spa-github-pages)
    shim that 302-bounces deep links back into the SPA with the original path
    encoded into the query string.
  - `index.html` head — the matching client-side decoder that reads the encoded
    path and `history.replaceState`s it back to the real URL.

### Technical Blockers
- **react-bits expects React 19 + r3f 9**, the rest of the ecosystem (drei,
  rapier, etc.) was lagging behind. Compromised on React 18.3 + r3f 8.17 +
  drei 9.114 + rapier 1.5 — fully compatible chain.
- **`tailwind.config.ts`** instead of `.js` — TS configs need a runner. Vite +
  Tailwind v3 picks it up fine via PostCSS, no special setup.
- **`assetsInclude: ['**/*.glb']`** required so `import cardGLB from './card.glb'`
  inside the Lanyard component resolves to a URL string.
- **vite-env.d.ts** had to declare `*.glb`, `*.png`, `*.jpg`, `*.svg`, `meshline`,
  and (later) `JSX.IntrinsicElements.meshLineGeometry / meshLineMaterial`
  for TypeScript to compile.

### Verification
- `npm install` resolved 228 packages in 26s on Node 24.14 / npm 11.
- `npm run dev` came up at `http://localhost:5173` with HMR working.
- All 4 home sections plus the hero rendered with content. Project cards
  navigated to `/projects/<slug>`. i18n menu toggled. CNAME present in dist.

---

## 2026-05-13 Bug Fix Pass: First-Look Regressions

### Goal
Fix the visible defects after the first run:
- Background was invisible despite being lazy-mounted (canvas was in DOM but
  the screen was uniformly dark).
- Hero "Hi, I'm Cohen." rendered as an invisible space between the eyebrow and
  the subtitle.
- DOM-nesting warning and stuck render once Projects scrolled into view.
- Contact section's tilt card was throwing.

### Investigation Notes
- **Black background mystery**: `document.body` had `background-color:
  rgb(6, 6, 14)` (from globals.css). The background canvas was at
  `z-index: -10`. Negative z-index paints BELOW the body's own background fill
  — so the canvas existed but was hidden by body. The `<html>` element already
  has the same bg via `html { background-color: rgb(var(--color-bg)) }`, so
  body's bg is redundant.
- **Hero gradient invisible**: BlurText splits each character into a
  `<motion.span style={{display: 'inline-block'}}>`. CSS `bg-clip-text` only
  clips the parent's text — when inline-block children are introduced, the
  parent's clipping no longer paints through them. The DOM had the right
  characters, but every span computed to `color: rgba(0,0,0,0)` with no
  background.
- **ScrollFloat nested h2**: I had wrapped a `ScrollFloat` (which itself
  renders an `<h2>`) inside a `SectionLabel` that also rendered an `<h2>`.
  React's DOM-nesting warning fired and downstream consumers (project cards)
  threw weird layout glitches.
- **Contact useTransform hook violation**: my ContactSection's tilted-card
  variant called `useTransform([glareX, glareY], ([x,y]) => ...)` inline inside
  a `style={{ background: useTransform(...) }}` JSX prop — that's a hook call
  in render-time conditional context. Motion barked.

### Major Changes
- `src/styles/globals.css`:
  - Switched `body { background-color: transparent }` so negative-z-index
    siblings of `<body>` show through.
  - Added a `.blur-text > span { background-image: inherit;
    -webkit-background-clip: text; background-clip: text; color: transparent; }`
    rule so each split character paints its slice of the parent gradient.
- `src/components/sections/SectionLabel.tsx` — changed the heading element
  from `<h2>` to `<div role="heading" aria-level={2}>` so children can inject
  their own animated h2 wrapper (ScrollFloat) without nesting violations.
- `src/components/sections/ContactSection.tsx` — lifted the
  `useTransform([glareX, glareY], …)` out of JSX into the function body so
  it became a stable motion value referenced in `style={{ background: glareBg }}`.
- Set up `public/logo.svg` (small "cohen·" gradient mark) so StaggeredMenu's
  default `logoUrl` fallback (which points to an internal `/src/assets/...`
  path that doesn't exist in our copy) doesn't 404.

### Verification
- DOM eval after fixes:
  - Background canvas opacity = 1, filter = blur(0px) → background visible.
  - `.blur-text > span` had non-empty background and `bg-clip-text` resolving
    through the gradient.
  - No more DOM-nesting warnings in the console.
- Headless preview screenshot caveat appeared here for the first time — see
  the Handoff Notes section "Dev preview gotcha" at the bottom.

---

## 2026-05-13 BackgroundSwitcher Rewrite: AnimatePresence → Two-layer Fade

### Goal
The first-pass `<AnimatePresence>`-based background switcher visually got stuck
at `opacity: 0, filter: blur(24px)` on initial mount — the user-clicked switch
button appeared to do nothing. Replace with a deterministic two-layer fade that
works on every browser, including the throttled headless preview.

### Investigation Notes
- DOM eval showed the motion.div had `style="opacity: 0; filter: blur(24px);"`
  immediately after mount and never progressed.
- AnimatePresence with `mode="sync"` plus a Suspense boundary inside the
  motion.div appears to land in a state where the `animate` prop's transition
  never fires — possibly because Suspense holds the child render off until
  the lazy chunk loads, and by the time it does, the motion has already
  passed its initial-frame trigger.
- Switching to `mode="popLayout"` had its own issues with the WebGL canvases
  being unmounted before exit animations completed.
- Conclusion: AnimatePresence + Suspense + lazy WebGL components is a thorny
  combination. Skip the abstraction.

### Major Changes
- `src/components/BackgroundSwitcher.tsx` — full rewrite:
  - State is now two layers (`a` and `b`), each holding `{entry, visible}`.
    A `slot` ref tracks which layer currently owns the "visible" state.
  - On `next()`:
    1. Mount the incoming layer in the OTHER slot with `visible: false` (paints
       at `opacity: 0, filter: blur(20px)`).
    2. After `setTimeout(40)` — one browser paint cycle — flip the new layer
       to `visible: true` and the old layer to `visible: false`. CSS transitions
       on `opacity` (600 ms) and `filter` (600 ms) interpolate both sides.
    3. Toggle `slot.current` to the new slot.
  - Each layer renders as `<BgLayer state={state} fadeMs={FADE_MS}/>` with
    `data-bg-id` and `data-bg-visible` attributes for easy DOM inspection.
  - `prefersReducedMotion()` short-circuits the timeout dance and swaps
    instantly.
  - Removed the `motion` / `AnimatePresence` imports entirely; this file no
    longer depends on framer-motion.

### Technical Blockers
- Forwarded `setTimeout(..., 40)` was originally `requestAnimationFrame` ×2;
  switched to setTimeout because rAF callbacks weren't reliably firing under
  the headless preview's throttling, and a fixed timeout works in both real
  browsers and the test environment.
- Still observed `currentTime: 0` on the CSS animations under the headless
  preview — confirmed that's a tooling throttle, not a real bug. State flips
  and `data-bg-visible` attribute toggles fire correctly per DOM eval.

### Verification
- DOM eval timeline after clicking the "switch background" link in the menu:
  - At t=0: 1 layer in DOM (the initial bg).
  - At t=40ms: 2 layers in DOM — slot A (active, `visible: true`), slot B
    (new bg, `visible: false`).
  - At t=900ms: slot A `visible: false`, slot B `visible: true`,
    `localStorage[cohen.lastBg]` updated to the new id.
- Clicking the link 4 times in a row produced 4 different bgs (e.g.
  `linewaves → aurora → grainient → iridescence`).

---

## 2026-05-15 Lanyard Card Visual Overhaul (round 2)

### Goal
- Replace the simplified front face with a layout that matches the user-provided
  `carddesign.png` mock — including the decorative chip + lotus icon + barcode bars
  Codex's previous pass had intentionally omitted.
- Replace the QR area on the back with a real, scannable WeChat QR generated from
  `wechatqr.jpg`.
- Keep everything inline in `cohen-card.svg` so the GLB texture pipeline stays
  unchanged (no Blender re-bake).

### Investigation Notes
- The user shared `carddesign.png` (1067 × 1474) showing both faces. Front has a
  rounded pill at the bottom with an 8-petal lotus icon, two-line microcopy
  ("BUILDING WITH INTENT, / SHARING WITH CARE."), and a row of vertical barcode
  bars at the very bottom. Back has microcopy on top, QR in the middle, footer text.
- The previous SVG covered the upper text content but stopped at a single line of
  microcopy — the chip, icon and barcode were never drawn.
- `wechatqr.jpg` is 608 × 589, 157 KB. Converting to base64 yields ~210 KB. The SVG
  is sampled by `useTexture` (drei) which goes through the browser image loader,
  so a data URI inside `<image href="data:...">` works without any CORS/asset
  pipeline change.
- The 3D GLB samples a 2048 × 1536 atlas; front lives at `(0..928, 0..1240)` and
  back at `(1084..1940, 52..1180)` per the pre-existing layout. Bottom 100-ish
  pixels of the front can clip into the bevel, so anything below ~y=1180 was kept
  to thin barcode strokes only.

### Major Changes
- `_backup/2026-05-15-pre-card-redesign/` — saved the previous `cohen-card.svg`,
  Hero/About/Projects/Contact sections, HomePage, SectionLabel and TrueFocus
  source files before touching them, so the user can roll back this revision
  individually. (After deploy, this folder was moved into `_legacy/_backup/` to
  keep it out of the published artifact.)
- `src/components/reactbits/Components/Lanyard/cohen-card.svg`:
  - Preserved the existing `<defs>` block (JetBrains Mono Regular/Bold woff2 as
    data URLs, plus ink / glow / cyanViolet / microLines defs) — only the body
    after `</defs>` was rewritten.
  - Front face now: COHENJIKAN.COM eyebrow → big gradient "Cohen" → "WEB DEVELOPER
    / MELBOURNE" → short divider → "@Cohenjikan" + email → rounded chip with an
    8-petal lotus icon and the two-line "BUILDING WITH INTENT, / SHARING WITH
    CARE." microcopy → 46-bar barcode at the bottom.
  - Back face now: "EVERY LINK / LEADS SOMEWHERE." top microcopy → white-padded
    contrast panel (560 × 560, rx 32) → the actual WeChat QR as inline base64
    JPEG (520 × 520, `preserveAspectRatio="xMidYMid meet"`) → "SCAN ME ON WECHAT"
    + "@Cohenjikan" footer.
  - Final SVG is ≈ 465 KB on disk (font embed + body + QR base64). Fine for
    bundling as a texture.

### Technical Blockers
- The Write tool / conversation context can't comfortably carry a 210 KB base64
  blob inline. Worked around by piping the conversion through bash:
  ```bash
  base64 -w 0 wechatqr.jpg > /tmp/qr_b64.txt
  head -n 52 cohen-card.svg > /tmp/svg_head.txt              # preserves defs + fonts
  cat > /tmp/svg_body.txt <<'EOF' ... __QR_BASE64__ ... EOF  # body draft
  awk -v qr="$(cat /tmp/qr_b64.txt)" '{gsub(/__QR_BASE64__/, qr); print}' \
      /tmp/svg_body.txt >> cohen-card.svg
  ```
  Same trick applies any future time the QR or card art changes. The source
  `wechatqr.jpg` sits in `_legacy/source-assets/` (gitignored) for re-runs.

### Verification
- `document.querySelector('#contact canvas')` reports 508 × 640 after the local
  resize nudge Codex added — texture loads correctly on the new SVG.
- Real-browser verification still required for the actual 3D card face since
  the headless preview throttles WebGL frames hard; structural eval confirms the
  atlas region positions are correct.

---

## 2026-05-15 About Heading + Section Balance

### Goal
- The "About me" intro became dominant again as the parent heading for Projects
  and Contact; user requested it be enlarged, with `TrueFocus` preserved.
- Balance Projects vs Contact heading weight so they read as siblings beneath
  About.
- Fix the regression where "About" and "me" wrapped onto two lines at certain
  viewport widths.

### Investigation Notes
- Codex previously merged About into `ProjectsSection` (shared `id="about"`).
  That coupling made it impossible to scale About independently of the project
  grid heading — they were rendered together.
- `TrueFocus` lays its words in a flex container with `flex-wrap` and `gap-4`. At
  `text-9xl` (128 px) and the lg `1.05fr_1fr` column split, two words exceed the
  column width on a 1024 px viewport and wrap.

### Major Changes
- New `src/components/sections/AboutSection.tsx` — owns `id="about"` and renders
  a large `TrueFocus` "About me" plus the `about[locale]` paragraph in a 2-col
  grid. `className="!justify-start !flex-nowrap"` plus `wordClassName=
  "!text-5xl md:!text-6xl lg:!text-7xl !leading-[0.92] ... whitespace-nowrap"`
  forces same-line layout at all widths.
- `ProjectsSection`: stripped the About intro block out; now only renders the
  project grid. Heading reduced from `text-3xl md:text-5xl` (via ScrollFloat) to
  a plain `text-2xl md:text-3xl` span. `id="projects"` moves back onto the
  `<section>` root.
- `ContactSection`: heading similarly shrunk to `text-2xl md:text-3xl`. Vertical
  padding aligned to `py-16 md:py-20` to match Projects.
- `HomePage` flow: Hero → About → Projects → Contact. Imports `AboutSection`.

### Verification
- `getComputedStyle(aboutTrueFocusWord).fontSize` ≈ 72 px at md+ (text-6xl).
- `getComputedStyle(projectsHeadingSpan).fontSize` = 30 px and `contactHeadingSpan`
  = 30 px — Projects and Contact balanced.
- `getBoundingClientRect()` of the two About words confirms same `top` value
  → both on one line.
- Visual ratio About : Projects : Contact ≈ 72 : 30 : 30 = 2.4 : 1 : 1, which
  reads as clearly parent-vs-child.

---

## 2026-05-15 Credits / Acknowledgments Page

### Goal
- Add a `/credits` route reachable from the StaggeredMenu (below Contact) that
  lists every open-source dependency used to build the site, grouped by category,
  plus a "Special Thanks" section for Louie, OpenAI's GPT and Anthropic's Claude.

### Major Changes
- `src/content/credits.ts` — 27 entries across 6 categories (`foundations`,
  `routing`, `animation`, `webgl`, `ui`, `fonts`). Each entry: name, role,
  license, url. Special thanks entries hold a key + accent color + url; the
  human-readable copy lives in i18n.
- `src/pages/CreditsPage.tsx` — top-left "Back to home" link, big gradient title
  reusing `bg-accent-gradient`, intro paragraph, then the 6 dep-card grids
  (`sm:grid-cols-2`), then the Special Thanks 3-card grid with per-card accent
  glow. Closes with the license footnote.
- `src/i18n/index.ts` — added `section.credits`, `credits.*` (title / subtitle /
  intro / categories.* / specialThanksTitle / specialThanksIntro /
  thanks.{louie,gpt,claude}.{name,role,note} / license / backHome) for both
  `zh` and `en`.
- `src/App.tsx` — registered `<Route path="/credits" element={<CreditsPage/>}/>`
  before the catch-all.
- `src/components/layout/SiteNav.tsx` — added Credits to the menu items array.
  Extended `handleClick` so anchors whose href starts with `/` (and isn't
  `/#anchor`) get intercepted and routed through `useNavigate()` — without this
  the menu would do a full page reload and lose background / menu state.

### Verification
- `window.location.href = '/credits'` then DOM check returned `depCount = 27`,
  6 category headings (zh: "框架与构建" / "路由 与 国际化" / "动效与交互" /
  "3D 与 WebGL" / "组件与样式" / "字体") plus "特别感谢" header.
- Three thanks cards link out to `louie1.com`, `openai.com`,
  `anthropic.com/claude-code` respectively.
- Lang toggle from menu switches all credits copy between zh and en correctly.

---

## 2026-05-15 Credits Menu Item De-emphasis

### Goal
- The Credits item in the StaggeredMenu rendered at the same scale as the primary
  Home / Projects / Contact entries, which is wrong: Credits is an auxiliary /
  utility route (license + thanks), not a peer of the main sections.
- Wanted: smaller font + accent color, while keeping the same StaggeredMenu
  layout flow for the other items.

### Investigation Notes
- `StaggeredMenu` renders items with a single hard-coded class set
  (`text-black font-semibold text-[4rem] ... uppercase tracking-[-2px]`). Items
  don't accept a per-item className prop, so per-item styling has to happen via
  CSS rather than via component edits.
- The menu also injects an inline `<style>` block at render time with rules like
  `.sm-scope .sm-panel-item { color: #000; font-size: 4rem; ... }`. That selector
  has specificity (0, 2, 0), exactly equal to a naive `.sm-panel-item[href='/credits']`
  rule. The inline `<style>` is mounted later in the DOM than `globals.css`, so
  source order in the cascade favours it.
- Verified via `document.styleSheets` that my rule was being parsed, but
  `getComputedStyle(creditsLink).color` still reported `rgb(0,0,0)`. Even with
  `!important` the override failed in practice on this codebase — likely because
  `!important` is meant for cascade tiebreaks rather than specificity equality
  shenanigans, and chasing it was less productive than just outranking the
  selector.

### Major Changes
- `src/styles/globals.css` — added a rules block scoped to the credits menu link:
  ```css
  :is(.sm-scope) .sm-panel-item[href='/credits'] { ... }
  ```
  The `:is(.sm-scope)` prefix raises specificity to (0, 3, 0) so it cleanly
  beats `.sm-scope .sm-panel-item` even without `!important` for the bits that
  inherit. The override:
  - `font-size: 2.25rem` (36 px), `letter-spacing: 0`, `text-transform: none`
  - `color: #5227FF` (resting), `color: #A78BFA` on hover/focus
  - `opacity: 0.85` resting, `1` on hover
  - `::before { content: '↗ '; ... }` to give the link a quiet auxiliary marker
  - explicit `.sm-panel-itemLabel { color: inherit }` so the inner label span
    picks up the override too.
- The other primary items (`Home`, `Projects`, `Contact`) keep the
  StaggeredMenu defaults: 64 px, black, uppercase, tight letter-spacing.

### Verification
- After menu open, computed styles:
  - Credits link: `fontSize: 36px`, `color: rgb(82, 39, 255)`,
    `letter-spacing: normal`, `::before content: "↗ "`.
  - Projects link: `fontSize: 64px`, `color: rgb(0, 0, 0)` (default).
- Visual ratio Credits : primary ≈ 36 : 64 ≈ 0.56, plus colour contrast — the
  hierarchy reads as "main pages + an extra".

---

## 2026-05-16 Mobile Polish + Background GPU Pass

### Goal
- Fix four mobile-specific UX regressions reported after the first deploy:
  - (1a) StaggeredMenu panel covers the whole viewport on mobile and the close
    button is invisible — user can't dismiss the menu.
  - (1b) Page can be scrolled horizontally on mobile (rubber-band overflow).
  - (1c) The Lanyard 3D card on Contact can't be dragged on touch devices.
  - (1d) Hero "Hi, I'm Cohen" wraps a single glyph (the C) onto its own line on
    Android Chrome at narrow widths.
- (#2) The close icon in the menu's top-right is hidden because its colour
  matches the white panel background (root cause of 1a).
- (#3) Project detail pages render leftover unknown-font text bleeding out
  beside the project hero image.
- (#4) On certain backgrounds + low-end devices, GPU usage spikes and the page
  stutters.

### Investigation Notes
- **Menu close invisible (#2 / 1a).** `SiteNav` was passing `openMenuButtonColor="#fff"`
  *and* `menuButtonColor="#fff"`. The toggle button is `text-black` via Tailwind
  when open, but GSAP's `colorTweenRef` overrides that with the `openMenuButtonColor`
  white — so once open, the close label sat as white-on-white on the panel.
- **Horizontal overflow (1b).** `StaggeredMenu` host wrapped its scope in
  `w-screen h-screen` (= `100vw`). On Android Chrome `100vw` includes the
  viewport scrollbar gutter; combined with `body { overflow-x: hidden }` only
  (not `html`), the page allowed a horizontal swipe. Mobile media queries also
  pinned the panel to `width: 100%` of the wrapper but the prelayers stayed at
  `clamp(260px, 38vw, 420px)`, leaking past the viewport.
- **3D card not draggable on touch (1c).** Two issues stacked. First,
  `react-three-fiber`'s `<Canvas>` `style` prop only applies to the wrapping
  `<div>`, not the inner `<canvas>` — so my initial `style={{ touchAction: 'none' }}`
  on Canvas didn't reach the actual touch target. Browsers default
  `touch-action: auto` on canvas → page steals the gesture for scroll before
  pointer-down can claim it. Second, `e.target.setPointerCapture(...)` can throw
  on touch when `e.target` is the canvas, not the mesh.
- **Hero glyph wrap (1d).** `BlurText` splits "Hi, I'm Cohen" into 13
  inline-block flex spans inside a `<p class="flex flex-wrap">`. With `flex-wrap: wrap`
  any single span can wrap to a new line. The hero clamp `clamp(3.75rem,10vw,7.75rem)`
  pinned a 60px floor, so on a 375px viewport the line was ~13 × 33px ≈ 429px and
  one or two glyphs (the `C` of `Cohen` typically) would land on a new row.
- **Project page leftover font (#3).** `ProjectDetailPage` rendered the hero
  via `<TiltedCard containerHeight="auto" imageHeight="auto" />`. TiltedCard's
  `<figure>` wraps a `motion.div` whose `<img>` is `position: absolute`. With
  `height: auto` on both the figure and the inner div there are no flow
  children, so both collapse to **height 0**. The image still paints — it just
  doesn't push siblings down — so it overlaid the next section ("核心特性"
  heading + first feature row). The "未知字体" the user was seeing was actually
  the SmartImage placeholder text "截图待补充" (set in `text-sm uppercase
  tracking-[0.2em]`, which renders awkwardly in CJK) bleeding out from
  underneath the hero image's left edge.
- **Heavy backgrounds (#4).** `pickPool()` only excluded heavy bgs on mobile
  or `<4` cores. That missed: Save-Data hint, slow connections, low device
  memory, coarse-pointer desktops, and any heavy-bg / device combo where it
  *did* mount and then tanked frame rate after the fact (no escape hatch).

### Major Changes
- **`src/components/layout/SiteNav.tsx`** — `openMenuButtonColor` `#fff` →
  `#0f0a1f` (resolves #2 / 1a).
- **`src/components/reactbits/Components/StaggeredMenu/StaggeredMenu.tsx`** —
  - `w-screen h-screen overflow-hidden` → `inset-0 overflow-hidden` on the host.
  - Mobile media queries now pin **both** `.staggered-menu-panel` and
    `.sm-prelayers` to `width: 100vw; max-width: 100%; left: 0; right: 0`.
  - Mobile (`<= 640px`): panel padding shrunk to `5em 1.5em 2em 1.5em`,
    `.sm-panel-item` font-size dropped to `2.75rem`, header padding `1.25em`.
  - `.sm-toggle` gets `padding: 0.5rem 0.6rem`, `min-height: 44px`,
    `touch-action: manipulation`. When the wrapper is `[data-open]`, the toggle
    sits inside a white pill (`background: rgba(255,255,255,0.85)`,
    `border-radius: 9999px`, soft shadow) so the close label always reads
    against the panel.
- **`src/components/reactbits/Components/Lanyard/Lanyard.tsx`** —
  - Outer wrapper + `<Canvas>` both get `style={{ touchAction: 'none' }}`.
    (Wrapper is the one that actually sticks; the canvas-side rule is in
    `globals.css` — see below.)
  - Added `gl={{ alpha: transparent, antialias: !isMobile, powerPreference: 'high-performance' }}`
    so mobile drops MSAA.
  - `onPointerDown` / `onPointerUp` capture calls wrapped in `try { ... } catch`
    so touch events with non-capturable targets don't throw; `pointerdown` also
    `e.stopPropagation()`'s to keep the gesture inside the card group.
- **`src/styles/globals.css`** —
  - `html { overflow-x: hidden; overscroll-behavior-x: none; }` (1b).
  - `body { max-width: 100% }` (belt-and-braces against `100vw` children).
  - New `.hero-title-blur` utility: `flex-wrap: nowrap !important; white-space:
    nowrap; max-width: 100%`. This is the override applied in HeroSection.
  - New `#contact canvas { touch-action: none; }` — the actual fix for 1c. R3F's
    style prop lands on the outer div, not the canvas, so we need a CSS rule
    targeting the inner element directly.
- **`src/components/sections/HeroSection.tsx`** — BlurText className becomes
  `"hero-title-blur bg-accent-gradient bg-clip-text text-[clamp(2.5rem,9vw,7.75rem)] ..."`.
  Min font-size 3.75rem → 2.5rem; max stays 7.75rem; vw scale 10 → 9.
- **`src/pages/ProjectDetailPage.tsx`** —
  - Hero image now renders as a plain `<img class="block h-auto w-full
    object-contain" />` inside a `max-w-4xl rounded-2xl border` wrapper. No
    more TiltedCard for the hero. (TiltedCard is kept in the codebase for
    other potential use; it's not deleted.)
  - SmartImage `Placeholder` typography cleaned: dropped `uppercase
    tracking-[0.2em]`, wrapped the label in `<span class="font-mono
    tracking-wide">` so CJK ("截图待补充") renders normally instead of with
    blown-out letter-spacing.
  - Section headings (`核心特性` / `技术栈`) use a CJK-aware class:
    `font-mono text-sm uppercase tracking-[0.18em] text-accent
    [&:lang(zh)]:tracking-normal`. (Affects only `lang=zh` ancestors, but is
    harmless when the lang attr isn't set.)
- **`src/components/BackgroundSwitcher.tsx`** —
  - Replaced `pickPool()` with `isLowEndDevice()` that checks: mobile width,
    `(pointer: coarse)`, `hardwareConcurrency < 4`, `navigator.deviceMemory < 4`,
    Network Information API `saveData` / `effectiveType === '2g'`.
  - Heavy bg parameters tuned down (Prism `timeScale 0.4 → 0.3`, Beams
    `beamNumber 14 → 10` + `speed 2 → 1.6`, Silk `speed 2.5 → 2`, etc.).
  - **FPS watchdog** on the active heavy bg: samples rAF deltas; if more than
    60 frames inside the rolling window come in over 36ms (≈ <28fps), it picks
    a random light bg and runs the same two-step fade as `next()`. Skips
    sampling while `document.hidden` is true to avoid false positives from
    background-tab throttling. Skipped entirely under `prefersReducedMotion()`.
  - **`BgLayer`** now subscribes to `visibilitychange` and returns `null` while
    `document.hidden` is true. That fully unmounts the WebGL canvas / rAF when
    the tab loses focus, so a backgrounded tab burns zero GPU cycles instead
    of the throttled-but-still-running default.

### Verification
- Tooling: `npx tsc --noEmit` passes clean.
- Preview at 375 × 812 (mobile preset):
  - `getComputedStyle('.hero-title-blur')`: `flexWrap: 'nowrap'`,
    `whiteSpace: 'nowrap'`, `fontSize: '40px'`. Title `scrollWidth = 327px`
    inside a `375px` viewport — fits with margin to spare.
  - `document.documentElement.scrollWidth === clientWidth` (375 px), no
    horizontal scroll, `htmlOverflowX: 'hidden'`.
  - With menu open: `.sm-toggle` computed `color: rgb(15, 10, 31)` on a
    white pill, `height: 44px`, position `(260, 17)` — fully on-screen,
    label "Close ×" clearly visible.
  - `#contact canvas`: `getComputedStyle().touchAction === 'none'` ✓ (the
    important one — confirms the CSS rule, not just the wrapper style).
- Preview at desktop on `/projects/sync-station`: hero image now sits in its
  own bordered card with proper flow height, `核心特性` heading appears below
  it (not under it), no "截图待补充" text leaking out beside the hero. No
  console errors, no server errors.
- The FPS watchdog wasn't triggered in preview (we're on a fast desktop) —
  the code path is exercised only on real low-end mobile / older GPUs.
  Tested manually by temporarily lowering the threshold to 5 frames and
  confirming the fallback fade fires, then reverted.

### Technical Blockers
- **R3F Canvas style prop misdirection.** Spent a round assuming
  `style={{ touchAction: 'none' }}` on `<Canvas>` would land on the
  `<canvas>`. It doesn't — R3F applies it to the wrapper div. The CSS
  `#contact canvas { touch-action: none }` rule is what actually resolves
  the touch-drag failure. Worth remembering: any per-element CSS that
  needs to land on the canvas element itself in R3F has to go through
  global CSS or a callback ref, not the style prop.
- **Orphan vite on port 5173.** During verification, an earlier dev server
  was still bound to 5173, so `preview_start` quietly created a new one on
  5174 while the preview tab still talked to the stale 5173 instance.
  Symptom was "edits not reflecting in the browser" despite HMR. Killed
  the orphan (`taskkill //F //PID …`) and restarted preview. If this
  happens again: check `netstat -ano | grep 5173` for a stranded PID
  before restarting preview.

---

## 2026-05-16 First Deploy to `Cohenjikan/Cohenjikan-s-web`

### Goal
- Publish the React build to the user's existing GitHub Pages repository,
  replacing the legacy static HTML site that had been there.
- Preserve the Apache-2.0 `LICENSE` file the legacy repo already had.

### Investigation Notes
- The remote `main` carried 5 legacy commits (static site iterations) plus the
  Apache `LICENSE` and a `PR #1`. No CI had ever run on it — Pages was deploying
  from the branch directly.
- Custom domain `cohenjikan.com` was already wired up in the repo's Pages
  settings, and DNS already pointed at the GitHub Pages IPs — verified by the
  fact that `cohenjikan.com` was previously serving the legacy site from this
  same repo.
- Force-pushing was the right move (user-confirmed): the legacy main only
  contained the static HTML that this whole project replaces.

### Major Changes
- **Cleanup before push**:
  - Moved `carddesign.png` + `wechatqr.jpg` → `_legacy/source-assets/`
    (gitignored, kept on disk for QR re-renders).
  - Moved `_backup/2026-05-15-pre-card-redesign/` → `_legacy/_backup/`
    (gitignored, kept on disk for selective rollback).
  - Deleted `dist/` and `tsconfig.tsbuildinfo` (gitignored anyway, but
    redundant locally).
  - Added `.claude/settings.local.json` to `.gitignore` — that's a per-user
    Claude Code permission whitelist, not portable.
  - Kept `.claude/launch.json` tracked — it's the local Vite-dev preview
    config and is portable enough to share.
- **Push pipeline**:
  ```bash
  git init -b main
  git remote add origin https://github.com/Cohenjikan/Cohenjikan-s-web.git
  git fetch origin main
  git checkout origin/main -- LICENSE   # preserve Apache 2.0
  git add -A
  git commit -m "Rebuild site as Vite + React + TypeScript SPA"   # 69 files, 12 629 +
  git push --force-with-lease -u origin main
  ```
  Resulting state: remote head moved from `d143cd2` (legacy) → `fb8064c`
  (this build).

### Technical Blockers
- Initial `mv _backup _legacy/_backup` hit a Windows permission error. Worked
  around with `cp -r _backup _legacy/_backup && rm -rf _backup`.
- `.claude/settings.local.json` was already staged (because `git add -A` runs
  before the .gitignore patch is committed). Needed
  `git rm --cached -f .claude/settings.local.json` to unstage.

### Verification
- `git log --oneline -1` on remote `main` returns `fb8064c Rebuild site as
  Vite + React + TypeScript SPA`.
- The workflow file `.github/workflows/deploy.yml` is on the remote — pushing
  triggers it automatically.
- User-side handoff: must verify Settings → Pages → Source is
  `GitHub Actions` (not `Branch`). The legacy site used Branch mode and the
  new build won't render correctly if that's still selected.

---

## Handoff Notes for the Next Contributor

If you're picking this up cold, here's what's worth knowing in addition to the
README:

### Repository / workflow
- **Two parallel logs.** `CODEX_DEV_LOG.md` and `CLAUDE_DEV_LOG.md` are split by
  agent author. Read order at the top of this file reconstructs full history.
- **`_legacy/`** is gitignored and holds:
  - `_legacy/index.html` + `_legacy/lib/` — the original static site this
    project replaces.
  - `_legacy/sync.png`, `primerscore.png`, `tinytalk.png` — the original
    project screenshots before they were renamed to `public/projects/*/hero.png`.
  - `_legacy/source-assets/carddesign.png` + `wechatqr.jpg` — the user-provided
    sources for the Lanyard front-mock and the back QR. Re-run the SVG pipeline
    from the "Lanyard Card Visual Overhaul (round 2)" entry if either changes.
  - `_legacy/_backup/2026-05-15-pre-card-redesign/` — snapshots of every file
    the Lanyard / About / Credits passes touched, in case any of those visual
    changes needs to be reverted in isolation.
- **Node**: developed on Node 24 / npm 11, CI runs on Node 20 LTS. Both work;
  Node 18 will likely also work but isn't tested.
- **No tests yet.** Verification has been: `npm run build` exits clean +
  Playwright-ish hand checks in real browsers + the Claude Preview MCP for in-loop
  DOM eval. If you add tests, Vitest + Testing Library is the natural fit.

### Visual / animation system
- **Lanyard texture** lives entirely in `cohen-card.svg`. The GLB geometry is
  untouched. As of the 2026-05-16 Codex repair, the front is one blended raster
  atlas spanning (0..1084, 0..1240): the real front card art plus a feathered
  right-edge continuation, so the old (928..1084) gap is intentionally occupied.
  The back is still (1084..1940, 52..1180), with a dark bleed guard at
  (1052..1084) to stop mip/filtering bleed from the front. Anything below
  ~y=1180 on the front clips into the card's lower bevel, so keep that area for
  thin decorative strokes only.
- **QR replacement**: drop a new image at `_legacy/source-assets/<name>.jpg`
  and re-run the bash pipeline at the top of the "Lanyard Card Visual Overhaul
  (round 2)" entry to regenerate `cohen-card.svg`.
- **Background pool**: edit the `ENTRIES` array in
  `src/components/BackgroundSwitcher.tsx`. Each entry needs `id`, `weight`
  ('light' or 'heavy'), and a `render` thunk. Heavy bgs only enter the pool
  when desktop + 4+ cores; the `pickPool()` helper enforces that.
- **Theme variables**: `globals.css` defines two palettes via CSS variables on
  `:root` and `[data-theme='magenta-lime']`. Switch by toggling `data-theme`
  on `<html>`. Codex also added `html[data-bg-tone='light' | 'dark']` overrides
  for the BG provider to flip text/accent colors when a light background
  (eg. Aurora) is rolled — the provider writes those attributes onto `<html>`
  whenever it switches.
- **Reduced motion**: the BG provider's `prefersReducedMotion()` short-circuit
  swaps backgrounds instantly. The Lanyard section also has a `reduced` branch
  that renders a static placeholder when the user prefers reduced motion.

### Adding content
- **New project**: append to `src/content/projects.ts`. Drop
  `public/projects/<slug>/hero.png` (other `feature-N.jpg` are optional;
  missing ones get a "Screenshot coming soon" panel automatically).
- **New language**: extend the `resources` map in `src/i18n/index.ts` and
  every `Localized` field in `src/content/projects.ts` /
  `src/content/about.ts`. Add the new locale to `supportedLngs`.
- **New dependency in Credits**: add an entry to the right category in
  `src/content/credits.ts`. Special thanks: add a `ThanksEntry` to
  `specialThanks` plus a `credits.thanks.<key>` block in both `zh` and `en`
  i18n resources.

### Common gotchas
- **`SocialSection.tsx` doesn't exist.** It used to (early-draft Social grid
  with ChromaGrid / GlassIcons). When Codex condensed sections, it was removed
  and the contact methods folded into ContactSection. If Vite's HMR ever
  references it in an error, it's a stale cache key — a hard reload clears it.
- **`SiteDock` and `Footer` no longer mount.** They live in
  `src/components/layout/` but Codex stopped importing them from `App.tsx` /
  `HomePage.tsx`. The files are kept in case someone wants to revive them.
- **Menu link styling.** The Credits styling pattern in `globals.css`
  (`:is(.sm-scope) .sm-panel-item[href='/...']`) is the prescribed way to
  demote any menu item — StaggeredMenu does not accept per-item classes, and
  you'll fight its inline `<style>` block on specificity if you forget the
  prefix.
- **Dev preview gotcha.** The headless browser used for in-loop verification
  (Claude Preview / Codex's preview) throttles rAF hard when WebGL backgrounds
  are active. Screenshots can time out and CSS transitions may appear stuck
  at `currentTime: 0` — this is a tooling artefact, not a production bug.
  Trust DOM `eval` results for state checks; trust the user's real-browser
  screenshots for visual verification.
- **`base: '/'` in vite.config**. Works because the site is served from a
  custom domain root (`cohenjikan.com`). If the next contributor ever needs
  to serve from `cohenjikan.github.io/Cohenjikan-s-web/`, change `base` to
  `/Cohenjikan-s-web/` or asset paths will 404.

### Deploy
- `git push origin main` triggers `.github/workflows/deploy.yml`. It builds
  `dist/` with `npm ci && npm run build`, uploads via
  `actions/upload-pages-artifact@v3`, and publishes via
  `actions/deploy-pages@v4`. Custom domain is preserved through
  `public/CNAME` which gets copied into `dist/CNAME` at build time.
- **First-time GitHub settings (only if Source isn't already `GitHub Actions`)**:
  - Settings → Pages → Build and deployment → Source: `GitHub Actions`.
  - Settings → Pages → Custom domain: `cohenjikan.com` (already set as of
    2026-05-16).
  - Enforce HTTPS: tick it once GH has issued the cert.
- **DNS**: apex A records → `185.199.108.153`, `185.199.109.153`,
  `185.199.110.153`, `185.199.111.153`. `www` CNAME →
  `cohenjikan.github.io` (optional). These were already in place from the
  legacy site as of 2026-05-16.
