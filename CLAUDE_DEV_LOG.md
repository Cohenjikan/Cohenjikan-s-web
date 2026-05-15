# Claude Development Log

Notes from work done by Claude (Anthropic's Claude Code) on this project.
Authored after Codex finished the entries in `CODEX_DEV_LOG.md`; the two logs are
complementary, not duplicates.

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
  individually.
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
  Same trick applies any future time the QR or card art changes.

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

## Handoff Notes for the Next Contributor

If you're picking this up cold, here's what's worth knowing in addition to the
README:

- **Two parallel logs.** Codex started `CODEX_DEV_LOG.md`, I added this one. Both
  are intentionally separate by author so you can see which agent owns which
  decisions; the README points readers to whichever is relevant.
- **`_backup/<date>-*/`** holds the pre-overhaul copies of every file the
  Lanyard / About / Credits passes touched. Restore individual files from there
  if any of those visual changes need to be reverted in isolation.
- **Lanyard texture** lives entirely in `cohen-card.svg`. The GLB geometry is
  untouched. Front art runs from atlas region (0..928, 0..1240); back is
  (1084..1940, 52..1180). Anything below ~y=1180 on the front clips into the
  card's lower bevel — keep that area for thin decorative strokes only.
- **QR replacement.** Drop a new image at the project root and re-run the bash
  pipeline at the top of the "Lanyard Card Visual Overhaul (round 2)" entry to
  regenerate `cohen-card.svg`.
- **Credits page.** Adding / removing a dependency means editing
  `src/content/credits.ts` only. Special-thanks copy lives under
  `credits.thanks.<key>` in `src/i18n/index.ts`; add a matching `ThanksEntry`
  to the array in `credits.ts` if you want a new card.
- **Menu link styling.** The Credits styling pattern in `globals.css` (`:is(.sm-scope)
  .sm-panel-item[href='/...']`) is the prescribed way to demote any menu item —
  StaggeredMenu does not accept per-item classes, and you'll fight its inline
  `<style>` block on specificity if you forget the prefix.
- **Dev preview gotcha.** The headless browser used for in-loop verification
  throttles rAF when WebGL backgrounds are active. Screenshots can time out and
  CSS transitions may appear stuck at `currentTime: 0` — this is a tooling
  artefact, not a production bug. Trust DOM `eval` results for state checks;
  trust the user's real-browser screenshots for visual verification.
