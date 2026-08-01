# Expanded Media Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish all 69 still images and six videos in a bilingual, optimized, newest-first event gallery.

**Architecture:** Keep the embedded gallery JSON in `public/index.html`, add a dependency-free `public/gallery.js` helper module for deterministic media and ordering behavior, and adapt the existing renderer/lightbox for poster-backed MP4 playback. Normalize stills to WebP and clips to fast-start H.264 MP4 while preserving historical public URLs separately.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js built-in test runner, ImageMagick, FFmpeg/FFprobe, Vercel static output.

## Global Constraints

- Stay on the existing `v3` branch and do not merge to `main`.
- Publish exactly 69 image records and six video records from the user-provided year/event folders.
- Sort years and named events descending; keep `Divers` last within its year.
- Preserve the German tag keys and provide complete German and English metadata.
- Encode still images as WebP at quality 82 with a maximum 2400-pixel edge.
- Encode MOV clips as H.264/AAC MP4, maximum 1080p, 30 fps, CRF 24, with fast start.
- Use poster-backed, non-autoplay video tiles and native lightbox controls.
- Preserve every historical URL asserted by `tests/static-deployment.test.mjs`.
- Add no runtime or development dependencies.
- Preserve the user's unrelated `.DS_Store` modification.

---

### Task 1: Establish the expanded gallery contract

**Files:**
- Modify: `tests/photonenkollektiv-portfolio.test.mjs`
- Modify: `tests/i18n-content.test.mjs`
- Create: `tests/gallery-media.test.mjs`

**Interfaces:**
- Consumes: embedded `#gallery-data` JSON and the public filesystem.
- Produces: failing tests for the 75-item manifest, optimized formats, event metadata, video posters, and sort helpers.

- [ ] **Step 1: Update the portfolio manifest expectations**

Replace the fixed 20-image assertion with literal expectations for 75 records,
69 `image` records, and six `video` records. For each record assert `year`,
`eventDate`, bilingual event/description fields, tags, unique source, and an
existing local file. Assert image sources end in `.webp`; video sources end in
`.mp4` and have an existing `.webp` poster and positive duration.

- [ ] **Step 2: Add real helper behavior tests**

Create `tests/gallery-media.test.mjs` that loads `public/gallery.js` in a VM and
uses hand-written fixtures to assert this exact event order:

```js
[
  "Studi Sommerfest 2026",
  "Feel Free 2026",
  "Realitätärätätä 2026",
  "R42 2025",
  "Divers 2025",
  "Keller DJ Set 2023",
  "Divers 2023"
]
```

Also assert `isVideo` distinguishes an explicit video record, and
`formatDuration(81)` returns `"1:21"`.

- [ ] **Step 3: Run the focused tests and verify RED**

Run:

```bash
node --test tests/photonenkollektiv-portfolio.test.mjs tests/i18n-content.test.mjs tests/gallery-media.test.mjs
```

Expected: FAIL because the manifest still has 20 records and
`public/gallery.js` does not exist.

### Task 2: Normalize the media archive

**Files:**
- Create/modify: `public/images/2023/**/*.webp`
- Create/modify: `public/images/2024/**/*.webp`
- Create/modify: `public/images/2025/**/*.webp`
- Create/modify: `public/images/2026/**/*.webp`
- Create: six `public/images/**/*.mp4` files
- Create: six `public/images/**/*-poster.webp` files
- Restore: historical files listed in `tests/static-deployment.test.mjs`
- Delete after verification: new gallery JPG/JPEG/MOV inputs

**Interfaces:**
- Consumes: the user-provided still and MOV source files.
- Produces: stable WebP/MP4/poster paths consumed by gallery JSON.

- [ ] **Step 1: Convert stills**

For each JPG/JPEG or WebP still, run the equivalent of:

```bash
magick input -auto-orient -resize '2400x2400>' -strip -quality 82 output.webp
```

Write to a temporary sibling first, validate it with `magick identify`, then
move it to the final `.webp` path. Do not treat generated video posters as
gallery still records.

- [ ] **Step 2: Convert videos and posters**

For each MOV, run the equivalent of:

```bash
ffmpeg -i input.MOV -vf "scale=1920:1080:force_original_aspect_ratio=decrease,fps=30" -c:v libx264 -preset medium -crf 24 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart output.mp4
ffmpeg -ss <representative-time> -i output.mp4 -frames:v 1 frame.png
magick frame.png -resize '1600x1600>' -strip -quality 82 output-poster.webp
```

- [ ] **Step 3: Validate outputs before removing sources**

Run ImageMagick over all 69 stills and six posters. Run FFprobe over all six
MP4s and assert H.264 video, AAC audio, no dimension above 1920x1080, and no
frame rate above 30 fps. Confirm all six MP4/poster pairs exist, then remove
the JPG/JPEG/MOV source copies from `public/`.

- [ ] **Step 4: Restore historical URL copies**

Restore only the deleted tracked paths listed by the existing legacy-assets
test from `HEAD`. Do not alter the organized optimized files or `.DS_Store`.

### Task 3: Implement the ordered mixed-media gallery

**Files:**
- Create: `public/gallery.js`
- Modify: `public/index.html`

**Interfaces:**
- Produces: `PhotonenGallery.isVideo(item)`,
  `PhotonenGallery.sortItems(items)`,
  `PhotonenGallery.groupItems(items)`, and
  `PhotonenGallery.formatDuration(seconds)`.
- Consumes: records with `type`, `year`, `eventDate`, `isMisc`, `event`, and
  optional video `poster`/`duration`.

- [ ] **Step 1: Implement the minimal pure helpers**

Create a browser/Node-compatible module that clones before sorting, compares
year descending, forces `isMisc` after named events in the same year, compares
ISO event dates descending, and groups adjacent sorted items by year/event.

- [ ] **Step 2: Run the helper test and verify GREEN**

Run:

```bash
node --test tests/gallery-media.test.mjs
```

Expected: PASS.

- [ ] **Step 3: Rewrite the embedded gallery JSON**

Add all 75 visually reviewed records with unique optimized paths, explicit
media types and dates, event labels including year, stable tags, and original
German/English descriptions. Set the hero's initial source to the optimized
Blackwood image that also exists in the manifest.

- [ ] **Step 4: Adapt the renderer and lightbox**

Load `gallery.js` before the renderer. Sort visible records once, create image
tiles as before, create video tiles from their WebP posters with a play glyph
and formatted duration, and keep both types in tag filtering. Add a hidden
lightbox video surface with `controls`, `playsinline`, and `preload="metadata"`;
switch surfaces by item type and pause/clear video state on navigation/close.
Keep videos out of the hero source list.

- [ ] **Step 5: Run manifest and localization tests and verify GREEN**

Run:

```bash
node --test tests/photonenkollektiv-portfolio.test.mjs tests/i18n-content.test.mjs tests/photonenkollektiv-hero.test.mjs
```

Expected: PASS.

### Task 4: Verify the complete static deployment

**Files:**
- Modify only if a discovered regression requires it: `public/index.html`,
  `public/gallery.js`, or the directly related tests.

**Interfaces:**
- Consumes: the finished public artifact.
- Produces: evidence that the artifact is deployable and interactive.

- [ ] **Step 1: Run the complete test suite**

Run `npm test` and require zero failures or warnings.

- [ ] **Step 2: Audit media inventory and weight**

Confirm 69 gallery WebPs, six gallery MP4s, six gallery posters, no new gallery
JPG/JPEG/MOV inputs, and report `du -sh public` before/after.

- [ ] **Step 3: Browser-check the artifact**

Serve `public/` locally and verify desktop and mobile widths: descending event
order, `Divers` placement, tag filters, DE/EN switching, image lightbox, video
playback and cleanup, keyboard focus, no horizontal overflow, no console
errors, and no failed network requests.

- [ ] **Step 4: Review branch and diff**

Confirm `git branch --show-current` is `v3`, `.DS_Store` remains untouched by
the implementation, no main-branch action occurred, and only the approved
gallery/media/docs/tests plus restored legacy copies changed.
