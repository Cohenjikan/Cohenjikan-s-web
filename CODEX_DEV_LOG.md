# Codex Development Log

## 2026-05-15 Contact / Lanyard Debug

### Goal
- Fix Contact section interactivity: Lanyard drag interaction is not working.
- Fix contact/social links that visually appear clickable but do not respond to clicks.
- Replace the default react-bits Lanyard card art with Cohen / 子午 identity content.

### Initial State
- Local preview: `http://localhost:5173/`.
- Site is a Vite + React + TypeScript + Tailwind personal portfolio.
- Lanyard implementation is based on `react-bits-main` reference components.
- Previous README note says the Lanyard GLB still uses the default react-bits placeholder texture.

### Investigation Notes
- The page-wide interaction failure was caused by `SiteNav`: a fixed full-viewport child used `pointer-events-auto`, so it sat above the whole site and swallowed clicks/drags even while visually transparent.
- Background layers are already `pointer-events-none`; they were not the click blocker.
- Local Lanyard is close to the upstream `C:\Users\Cohen\Desktop\react-bits-main\src\ts-tailwind\Components\Lanyard\Lanyard.tsx`, with the intentional local change from `h-screen` to parent-sized `h-full`.

### Major Changes
- Changed the SiteNav full-screen host child to `pointer-events-none`; StaggeredMenu's own button/panel still opt back into pointer events.
- Added `cohen-card.svg` and applied it as the card mesh texture instead of the upstream default placeholder map.
- Tuned card material away from the original highly metallic placeholder values so text remains legible on the badge.
- Updated README's Lanyard note so it no longer says the default placeholder texture is a pending follow-up.
- Added local JSX declarations for meshline primitives, removed an unused Vite alias that required Node typings, and narrowed a MagicBento ref prop so TypeScript can build the project.

### Technical Blockers
- Directly editing `card.glb` would require a binary GLB texture re-bake/export pipeline. The safer project-level approach is to keep the GLB geometry and replace only the material texture in React.
- The first build attempt failed on pre-existing type hygiene issues: meshline JSX intrinsic tags, a MagicBento ref type, and Vite config importing `node:path` without `@types/node`.

### Tried Approaches
- Chosen approach: local SVG texture loaded through `useTexture`, with `flipY = false` to match GLTF UV orientation.
- Rejected for now: Blender/GLB re-bake, because it is heavier and less maintainable for future text edits.
- Chosen build fix: remove the unused Vite alias instead of adding a new dependency just for `@types/node`.
- First texture draft used a square centered card design; browser verification showed the GLB samples a 2048x1536 atlas with the visible front on the left side, so the draft appeared cropped. Replaced it with a matching atlas layout.

### Verification
- `npm run build` passes when run with the approved non-sandbox build permission. Plain sandboxed build is blocked by an environment-level Vite/esbuild parent-directory access restriction.
- Browser check at `http://localhost:5173/#contact`: Lanyard renders with the Cohen / 子午 card face.
- Browser drag check: dragging the card moves the Lanyard, confirming the transparent navigation layer no longer blocks pointer input.
- Browser link/menu checks: StaggeredMenu still opens, and an internal project card click navigates to `/projects/sync-station`, confirming page links are clickable again.

## 2026-05-15 Visual Polish Pass

### Goal
- Improve Lanyard readability with a black card face and useful contact/identity text.
- Remove the bottom "Built with" footer bar.
- Make project cards visually equal in height.
- Remove blurred separators between homepage sections.
- Make text/accent colors adapt better to bright/pink versus dark backgrounds.

### Major Changes
- Rebuilt `cohen-card.svg` as a dark atlas texture and replaced the ambiguous "子午" label with a short identity/contact layout.
- Simplified the card face further after browser review: removed the fine-grain overlay and enlarged the name/contact text so it stays legible at the rendered 3D card size.
- Removed the footer render from `App`.
- Removed the `GradualBlur` section dividers from `HomePage`.
- Made project cards stretch to the same grid row height with full-height links/cards.
- Added `data-bg-current` and `data-bg-tone` on `<html>` from the background provider; CSS variables now switch text, surface, muted, and accent colors for light backgrounds.

### Verification
- `npm run build` passes with the approved non-sandbox build permission.
- Browser check: Contact renders with the black Cohen contact card, no footer element remains, and the old blurred section divider is gone.
- Browser check: Project cards now stretch to a uniform row height.
- Browser check: dark-background text remains readable with the updated sky/violet accent palette; light/pink backgrounds now receive a separate dark-text variable set through `data-bg-tone`.

## 2026-05-15 Lanyard Texture Redesign

### Goal
- Fix the Lanyard card looking muddy and overly nested.
- Make the front face readable at the small 3D render size.
- Improve the back face without losing the dark react-bits-style object feel.

### Major Changes
- Reworked `cohen-card.svg` again as a full-bleed card texture instead of drawing a smaller card inside the card.
- Enlarged the front hierarchy: large `COHEN`, readable `WEB DEVELOPER / MELBOURNE`, then `@Cohenjikan` and email.
- Moved bottom contact text upward after browser verification showed the email clipping near the lower card edge.
- Simplified the back face: quieter dark gradients, subtle line pattern, large `COHEN`, `WEB · TOOLS · PHOTOS`, and `COHENJIKAN.COM`.

### Verification
- Browser check at `http://localhost:5173/#contact` confirms the front face now reads as one full black card rather than a small inset card.
- `npm run build` passes with the approved non-sandbox build permission.

## 2026-05-15 Lanyard Font / Alignment Fix

### Goal
- Fix the front face looking off-center after accounting for the visible card bevel.
- Use the project's bundled `_legacy/lib` / `public/fonts` JetBrains Mono files instead of browser fallback typography.

### Major Changes
- Embedded JetBrains Mono Regular/Bold into `cohen-card.svg` as data URLs so SVG-as-texture rendering does not fall back to a system font.
- Shifted the front-face optical center to the right to compensate for the 3D card's visible right bevel.
- Switched the front title from all-caps `COHEN` to `Cohen` for a cleaner match with the rest of the site.

### Verification
- Browser screenshot at `http://localhost:5173/#contact` confirms the texture now renders with the bundled mono font and improved centering.
- `npm run build` passes with the approved non-sandbox build permission.

## 2026-05-15 Homepage Strength / About + Projects Merge

### Goal
- Increase the homepage's visual strength with larger typography.
- Merge the weak standalone About section into the Projects area while preserving the TrueFocus text effect.
- Keep both `/#about` and `/#projects` anchors working after the merge.

### Major Changes
- Enlarged the Hero headline, eyebrow, and subtitle typography for a stronger first viewport.
- Extended `TrueFocus` with optional `className` and `wordClassName` props so the existing effect can scale up without forking the component.
- Moved the About content into `ProjectsSection` as a large intro block above the project grid.
- Removed `AboutSection` from `HomePage`; `ProjectsSection` now owns `id="about"` and contains an inner `id="projects"` anchor.
- Enlarged the Projects heading via the existing `ScrollFloat` animation.

### Verification
- `npm run build` passes with the approved non-sandbox build permission.
- Browser checks for `/`, `/#about`, and `/#projects` confirm the larger hero, merged About/Projects flow, preserved TrueFocus effect, and working anchors.

## 2026-05-15 Navigation / Section Hierarchy Cleanup

### Goal
- Treat Projects, Social, and Contact as parts of the broader About flow.
- Replace the side-menu About item with Home, while keeping normal anchor jumps for the other sections.
- Remove visible section number markers and the stray dot that appeared under the hero headline.
- Reduce the About intro title so it no longer visually overpowers the other section titles.

### Major Changes
- Updated `SiteNav` items to `Home`, `Projects`, `Social`, and `Contact`; Home now links back to the hero anchor.
- Disabled StaggeredMenu item numbering and stopped rendering section numbers through `SectionLabel`.
- Changed the hero title text from `Hi, I'm Cohen.` to `Hi, I'm Cohen`, removing the wrapped trailing period that appeared as a floating dot.
- Reduced the merged About intro's TrueFocus text scale so About acts as a parent-context heading for the following Projects/Social/Contact content.

### Verification
- Browser menu check confirms the panel now shows `HOME`, `PROJECTS`, `SOCIAL`, and `CONTACT` with no numeric labels.
- Browser hero check confirms the stray dot under the title is gone.
- `npm run build` passes with the approved non-sandbox build permission.

## 2026-05-16 Lanyard Raster Atlas Repair

### Goal
- Replace the simplified Lanyard front art with the user's Image2-style card face.
- Remove the visible right-side black strip on the 3D card without making the front face look like a pasted patch.
- Fix front/back atlas bleed after extending the front art region.

### Investigation Notes
- The GLB uses a 2048x1536 texture atlas. The visible front face originally occupied `x=0..928`, while the card bevel/side could sample the empty `x=928..1084` gap.
- Simply scaling the 3D mesh narrower made the right-side strip more visible because the model still exposes bevel geometry.
- Drawing a synthetic SVG strip fixed the black edge but looked like a separate design layer.
- A separate right-edge PNG strip still left a vertical seam at `x=928`; the correct fix was to bake the front face plus edge continuation into one blended raster atlas.
- Extending the front raster to `x=1084` made the back face vulnerable to texture-filtering bleed from the front art, especially with mipmaps enabled.

### Major Changes
- Rebuilt the front atlas from `_legacy/source-assets/carddesign.png`:
  - cropped the user's real front card art,
  - extended the front atlas to `x=0..1084`,
  - crossfaded across `x=890..982` so the `x=928` UV boundary is no longer a hard image seam.
- Kept the back face in the existing `x=1084..1940, y=52..1180` region, but added a dark `x=1052..1084` bleed guard so back-edge filtering samples back-colored pixels instead of front purple pixels.
- Adjusted the rendered card proportions in `Lanyard.tsx`: collider `args={[0.66, 1.125, 0.006]}` and mesh scale `[1.86, 2.25, 0.65]`, keeping the card visually slim while reducing the exposed side thickness.
- Updated `cardTexture` settings for atlas safety: `ClampToEdgeWrapping`, disabled mipmaps, and set linear min/mag filters to prevent distant mip levels from blending unrelated atlas regions.

### Verification
- User browser review confirmed:
  - front face now matches the provided Image2 design closely,
  - right-side black strip is removed,
  - the previous vertical crop seam is no longer visible,
  - back-face purple bleed from the front atlas is resolved.
- `npm run build` passes with the approved non-sandbox build permission after the final bleed/filtering changes.
