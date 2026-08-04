# Gallery Preview Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make portrait lightbox media fit completely, make Unicode gallery URLs deploy reliably, correct the 2026 event name, and publish predictable bilingual social-preview metadata.

**Architecture:** Keep the dependency-free static architecture and embedded gallery manifest. Fix the lightbox at the CSS layout boundary, normalize manifest paths at the data boundary, and express social copy through the existing `data-i18n-content` mechanism so German remains literal in source while English remains selectable at runtime.

**Tech Stack:** Static HTML/CSS/JavaScript, embedded JSON, Node.js built-in test runner, Git tree inspection, Chrome DevTools Protocol.

## Global Constraints

- Work only on `v3`; do not merge or modify `main`.
- Keep German literal in delivered markup for SEO and no-JavaScript clients.
- Keep the site dependency-free and statically deployable from `public/` on Vercel.
- Keep all 75 gallery media records and their current optimized assets.
- Display the exact proper name `Vauyage to space 2026` in German and English.
- Preserve the internal `images/2026/Studi Sommerfest/` folder path.
- Store every gallery `src` and `poster` path in Unicode NFC form.
- Use `Photonenkollektiv — Kultur wird sichtbar` as the default social title.

---

### Task 1: Constrain Lightbox Media to the Stage

**Files:**
- Modify: `tests/photonenkollektiv-portfolio.test.mjs`
- Modify: `public/index.html:884-889`

**Interfaces:**
- Consumes: the existing `.lightbox-stage` positioned containing block.
- Produces: an image/video element box that is exactly the stage rectangle before `object-fit: contain` fits its content.

- [ ] **Step 1: Write the failing containment contract**

Add this assertion after the existing lightbox video assertion:

```js
assert.match(
  html,
  /\.lightbox-stage img,\s*\.lightbox-stage video\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*width:\s*100%;[^}]*height:\s*100%;[^}]*object-fit:\s*contain;/s,
  "Bild und Video werden innerhalb der Lightbox-Bühne vollständig eingepasst."
);
```

- [ ] **Step 2: Run the targeted test and verify RED**

Run: `node --test tests/photonenkollektiv-portfolio.test.mjs`

Expected: FAIL because the existing rule has width, height, and `object-fit`, but no `position: absolute` or `inset: 0`.

- [ ] **Step 3: Implement the minimal layout fix**

Change the shared media rule to:

```css
.lightbox-stage img,
.lightbox-stage video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
```

- [ ] **Step 4: Run the targeted test and verify GREEN**

Run: `node --test tests/photonenkollektiv-portfolio.test.mjs`

Expected: PASS and the gallery contract still reports 75 media across 18 groups.

- [ ] **Step 5: Commit the isolated layout fix**

```bash
git add public/index.html tests/photonenkollektiv-portfolio.test.mjs
git commit -m "fix: contain portrait lightbox media"
```

### Task 2: Normalize Gallery URLs and Correct the Event Name

**Files:**
- Modify: `tests/gallery-media.test.mjs`
- Modify: `public/index.html:1537-1542,1550-1555,1588-1590,1609-1610`

**Interfaces:**
- Consumes: `galleryData().images` and Git's tracked `public/images` paths.
- Produces: NFC-normalized `src`/`poster` strings and corrected bilingual public event metadata.

- [ ] **Step 1: Write failing manifest regression tests**

Add the import and helper:

```js
import { execFileSync } from "node:child_process";

function trackedPaths() {
  return new Set(
    execFileSync("git", ["ls-files", "-z", "public/images"], {
      cwd: projectDir
    })
      .toString("utf8")
      .split("\0")
      .filter(Boolean)
  );
}
```

Add these tests:

```js
test("manifest media URLs use deployable NFC paths from the Git tree", () => {
  const tracked = trackedPaths();

  for (const item of galleryData().images) {
    for (const mediaPath of [item.src, item.poster].filter(Boolean)) {
      assert.equal(mediaPath, mediaPath.normalize("NFC"), `${mediaPath} uses NFC.`);
      assert.ok(tracked.has(`public/${mediaPath}`), `${mediaPath} matches the Git tree.`);
    }
  }
});

test("the corrected 2026 event name replaces the obsolete public copy", () => {
  const items = galleryData().images;
  const renamed = items.filter((item) =>
    item.src.startsWith("images/2026/Studi Sommerfest/")
  );

  assert.equal(renamed.length, 6);
  assert.equal(
    renamed.every((item) =>
      item.event === "Vauyage to space 2026" &&
      item.eventEn === "Vauyage to space 2026"
    ),
    true
  );
  assert.equal(
    renamed.some((item) => `${item.event} ${item.eventEn} ${item.alt} ${item.altEn}`.includes("Studi Sommerfest")),
    false
  );
});
```

Update the real-manifest expected order so its first entry is `Vauyage to space 2026`.

- [ ] **Step 2: Run the targeted tests and verify RED**

Run: `node --test tests/gallery-media.test.mjs`

Expected: FAIL because the Südhof and Realitätärätätä paths are decomposed and the manifest still exposes `Studi Sommerfest 2026`.

- [ ] **Step 3: Normalize paths and public copy minimally**

In the embedded JSON:

- replace every `Su\u0308dhof` path segment with `S\u00fcdhof`;
- replace every `Realita\u0308ta\u0308ra\u0308ta\u0308ta\u0308` path segment with `Realit\u00e4t\u00e4r\u00e4t\u00e4t\u00e4`;
- replace the six `event` and `eventEn` values with `Vauyage to space 2026`;
- rewrite the one German and English alt description containing `Studi Sommerfest` to refer to the `Vauyage to space` stage.

Keep all `images/2026/Studi Sommerfest/` source paths unchanged.

- [ ] **Step 4: Run the targeted tests and verify GREEN**

Run: `node --test tests/gallery-media.test.mjs`

Expected: all gallery helper, manifest-order, path, name, and optimization tests PASS.

- [ ] **Step 5: Commit the data-boundary fix**

```bash
git add public/index.html tests/gallery-media.test.mjs
git commit -m "fix: normalize gallery paths and event copy"
```

### Task 3: Define Social Preview Metadata

**Files:**
- Modify: `tests/i18n-content.test.mjs`
- Modify: `public/index.html:8-10,1409-1410,1460-1461`

**Interfaces:**
- Consumes: `public/language.js` support for `[data-i18n-content]` elements.
- Produces: literal German Open Graph metadata with complete German and English runtime catalog values.

- [ ] **Step 1: Write the failing social metadata test**

Extend the literal German SEO test with:

```js
assert.match(
  html,
  /<meta property="og:title" content="Photonenkollektiv — Kultur wird sichtbar" data-i18n-content="meta\.socialTitle">/
);
assert.match(
  html,
  /<meta property="og:description" content="Photonenkollektiv – Freiburger Verein[^>]*Kultur wird sichtbar\." data-i18n-content="meta\.description">/
);
assert.match(html, /<meta property="og:type" content="website">/);
assert.match(html, /<meta property="og:locale" content="de_DE">/);
assert.doesNotMatch(html, /dokumentarische Bilder|documentary images/i);
```

Add a catalog assertion test using these hand-derived literals:

```js
test("social preview copy is complete in German and English", () => {
  const catalog = embeddedJson("i18n-data");

  assert.equal(catalog.de["meta.socialTitle"], "Photonenkollektiv — Kultur wird sichtbar");
  assert.equal(catalog.en["meta.socialTitle"], "Photonenkollektiv — Making culture visible");
  assert.equal(
    catalog.de["meta.description"],
    "Photonenkollektiv – Freiburger Verein für die Hör- und Sichtbarkeit von Kulturveranstaltungen. Licht, Klang. Kultur wird sichtbar."
  );
  assert.equal(
    catalog.en["meta.description"],
    "Photonenkollektiv – Freiburg-based association supporting the visibility and audibility of cultural events. Light, sound. Making culture visible."
  );
});
```

- [ ] **Step 2: Run the targeted tests and verify RED**

Run: `node --test tests/i18n-content.test.mjs`

Expected: FAIL because the Open Graph fields and `meta.socialTitle` translations do not exist and the old description remains.

- [ ] **Step 3: Add literal German and translated English metadata**

Place these tags after the standard description:

```html
<meta property="og:title" content="Photonenkollektiv — Kultur wird sichtbar" data-i18n-content="meta.socialTitle">
<meta property="og:description" content="Photonenkollektiv – Freiburger Verein für die Hör- und Sichtbarkeit von Kulturveranstaltungen. Licht, Klang. Kultur wird sichtbar." data-i18n-content="meta.description">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
```

Change the literal standard description to the same approved German description. Add `meta.socialTitle` and the exact approved descriptions to both `de` and `en` in `#i18n-data`. Leave the regular document-title translations unchanged.

- [ ] **Step 4: Run the targeted tests and verify GREEN**

Run: `node --test tests/i18n-content.test.mjs`

Expected: all language and metadata tests PASS.

- [ ] **Step 5: Commit the metadata fix**

```bash
git add public/index.html tests/i18n-content.test.mjs
git commit -m "fix: update bilingual social preview metadata"
```

### Task 4: Full Regression and Browser Verification

**Files:**
- Verify: `public/index.html`
- Verify: `tests/*.test.mjs`

**Interfaces:**
- Consumes: the completed lightbox, manifest, naming, and metadata changes.
- Produces: evidence that the static website remains deployable and the reported browser defects are resolved.

- [ ] **Step 1: Run the complete automated suite**

Run: `npm test`

Expected: all tests PASS with 75 media in 18 event groups and zero failures.

- [ ] **Step 2: Check patch hygiene and branch scope**

```bash
git diff --check
git branch --show-current
git status --short
```

Expected: no whitespace errors, branch `v3`, and only intended committed changes.

- [ ] **Step 3: Reproduce the reported desktop case in Chrome**

Serve `public/`, open the seventh gallery item at a 2048-pixel-wide desktop viewport, and evaluate:

```js
const stage = document.querySelector(".lightbox-stage").getBoundingClientRect();
const media = document.getElementById("lightbox-image").getBoundingClientRect();
({
  stage: { width: stage.width, height: stage.height },
  media: { width: media.width, height: media.height },
  fits: media.width <= stage.width && media.height <= stage.height
});
```

Expected: `fits: true`, equal stage/media dimensions, and the complete 1800×2400 portrait visible with black side bars rather than clipping.

- [ ] **Step 4: Check remaining media and responsive behavior**

In the same Chrome session:

- navigate to a landscape image and verify it stays contained;
- open a video and verify controls/playback remain available;
- request every Südhof and Realitätärätätä URL and verify HTTP 200;
- switch DE/EN and verify the social-description DOM values update;
- resize to 390 pixels and verify no horizontal document overflow;
- verify the console and failed-request lists are empty.

- [ ] **Step 5: Record the final commit state without pushing**

```bash
git log -4 --oneline --decorate
git status --short
```

Expected: the design and three implementation commits are on local `v3`, the working tree is clean, and no push or merge has occurred unless the user separately requests it.
