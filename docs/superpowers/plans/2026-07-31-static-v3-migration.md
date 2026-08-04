# Static v3 Website Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Next.js application with the completed v3 static artifact while retaining every legacy image and video at its current URL.

**Architecture:** Vercel serves `public/` directly. The primary Open Design HTML artifact becomes `public/index.html`, its companion assets live under `public/assets/`, and the existing `public/images/` and `public/videos/` trees remain unchanged. Node's built-in test runner protects the artifact behavior and deployment layout without adding dependencies.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js built-in test runner, Vercel static output configuration.

## Global Constraints

- Use `photonenkollektiv-nachtarchiv.html`, which the Open Design metadata marks as primary, as the website source.
- Do not redesign or rewrite the v3 copy, JavaScript, or interactions, and do
  not change styling outside the two narrow-mobile overflow fixes.
- Add only one deployment-specific HTML line: the supplied v3 logo as an explicit favicon.
- Add only two narrow-mobile CSS adjustments: stack event headings below 390 px and reduce the statement display size enough to prevent horizontal overflow.
- Preserve every existing file under `public/images/` and `public/videos/` byte-for-byte and at the same URL.
- Remove the existing Next.js and React website implementation.
- Keep all work on the current `v3` branch; do not checkout, merge into, or modify `main`.
- Do not add runtime or development dependencies.

---

### Task 1: Establish the migration contract

**Files:**
- Create: `tests/photonenkollektiv-portfolio.test.mjs`
- Create: `tests/photonenkollektiv-hero.test.mjs`
- Create: `tests/static-deployment.test.mjs`
- Record temporarily: `/tmp/website-pk-legacy-before.sha1`

**Interfaces:**
- Consumes: the current `public/images/` and `public/videos/` trees and the supplied Open Design tests.
- Produces: a failing test contract for `public/index.html`, `public/assets/`, legacy URLs, removed framework files, and `vercel.json`.

- [ ] **Step 1: Record the legacy asset baseline**

Run:

```bash
rg --files -0 public/images public/videos | sort -z | xargs -0 shasum > /tmp/website-pk-legacy-before.sha1
```

Expected: the manifest contains every current legacy image and video with its SHA-1 hash.

- [ ] **Step 2: Copy the supplied behavior tests into the repository**

Run:

```bash
cp "/Users/alex/Library/Application Support/Open Design/namespaces/release-stable/data/projects/609c79da-0474-4be7-a2c9-6bd190fb5273/tests/photonenkollektiv-portfolio.test.mjs" tests/photonenkollektiv-portfolio.test.mjs
cp "/Users/alex/Library/Application Support/Open Design/namespaces/release-stable/data/projects/609c79da-0474-4be7-a2c9-6bd190fb5273/tests/photonenkollektiv-hero.test.mjs" tests/photonenkollektiv-hero.test.mjs
```

Change both HTML paths from the Open Design project root to `join(projectDir, "public", "index.html")`. In the portfolio test, resolve image files with `join(projectDir, "public", image.src)`.

- [ ] **Step 3: Add the static deployment test**

Create `tests/static-deployment.test.mjs` with:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const testDir = dirname(fileURLToPath(import.meta.url));
const projectDir = dirname(testDir);
const publicDir = join(projectDir, "public");

const legacyAssets = [
  "images/stars-bg.webp",
  "images/stars-bg.gif",
  "images/logo.svg",
  "images/photonenkollektiv_logo_ohne_schrift.svg",
  "images/2024/IMG_0822.webp",
  "images/2024/photonen-kirnhalden-24-67.webp",
  "images/2024/20240119_232427.webp",
  "images/2024/20240726_220354.webp",
  "images/2024/photonen-kirnhalden-24-87.webp",
  "images/2024/20240822_135753.webp",
  "images/events/20230506_214900.webp",
  "images/events/20230518_004455.webp",
  "images/events/signal-2023-02-28-193950.webp",
  "images/events/20240430_233848.webp",
  "images/events/IMG_0864.webp",
  "images/events/20230804_025221.webp",
  "images/events/20240503_210821.webp",
  "images/events/20230826_023800.webp",
  "images/events/20240420_203008.webp",
  "images/events/IMG_0221.webp",
  "images/events/20230804_021519.webp",
  "images/events/signal-2023-03-26-223441_013.webp",
  "images/events/20230513_235443.webp",
  "images/events/IMG_0031.webp",
  "images/events/20230819_215627.webp",
  "images/events/20240420_001734.webp",
  "videos/gled_2024.av1.mp4",
  "videos/gled_2024.mp4",
  "videos/photonen-kirnhalden-24.mp4"
];

test("the static homepage resolves every local HTML asset reference", () => {
  const html = readFileSync(join(publicDir, "index.html"), "utf8");
  const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((reference) =>
      !reference.startsWith("#") &&
      !reference.startsWith("mailto:") &&
      !reference.startsWith("http://") &&
      !reference.startsWith("https://")
    );

  assert.ok(references.length > 0, "The homepage contains local asset references.");

  for (const reference of new Set(references)) {
    assert.ok(
      existsSync(join(publicDir, reference)),
      `The deployed asset ${reference} exists.`
    );
  }
});

test("the static homepage declares the v3 logo as its favicon", () => {
  const html = readFileSync(join(publicDir, "index.html"), "utf8");
  const favicon = html.match(
    /<link\s+[^>]*rel="icon"[^>]*href="([^"]+)"[^>]*>/
  );

  assert.ok(favicon, "The homepage declares an explicit favicon.");
  assert.equal(favicon[1], "logo.svg");
  assert.ok(existsSync(join(publicDir, favicon[1])), "The favicon asset exists.");
});

test("every legacy image and video remains at its public URL", () => {
  for (const asset of legacyAssets) {
    assert.ok(existsSync(join(publicDir, asset)), `Legacy asset /${asset} exists.`);
  }
});

test("Vercel serves the public directory as a clean-url static site", () => {
  const config = JSON.parse(readFileSync(join(projectDir, "vercel.json"), "utf8"));

  assert.equal(config.outputDirectory, "public");
  assert.equal(config.cleanUrls, true);
});

test("the framework application is removed and the test package has no dependencies", () => {
  const removedPaths = [
    "src",
    ".eslintrc.json",
    "next.config.js",
    "tsconfig.json",
    "package-lock.json",
    "public/next.svg",
    "public/vercel.svg"
  ];

  for (const path of removedPaths) {
    assert.equal(existsSync(join(projectDir, path)), false, `${path} is removed.`);
  }

  const packageJson = JSON.parse(
    readFileSync(join(projectDir, "package.json"), "utf8")
  );

  assert.deepEqual(packageJson.dependencies ?? {}, {});
  assert.deepEqual(packageJson.devDependencies ?? {}, {});
});
```

- [ ] **Step 4: Run the tests and verify the red state**

Run:

```bash
node --test tests/*.test.mjs
```

Expected: FAIL because `public/index.html` and `vercel.json` do not exist and the Next.js files are still present. The supplied tests must already have passed against the Open Design source artifact, confirming the failure is caused by the missing migration.

### Task 2: Replace the framework website with the static artifact

**Files:**
- Create: `public/index.html`
- Create: `public/logo.svg`
- Create: `public/assets/`
- Create: `vercel.json`
- Modify: `package.json`
- Modify: `.gitignore`
- Modify: `README.md`
- Delete: `src/`
- Delete: `.eslintrc.json`
- Delete: `next.config.js`
- Delete: `tsconfig.json`
- Delete: `package-lock.json`
- Delete: `public/next.svg`
- Delete: `public/vercel.svg`

**Interfaces:**
- Consumes: the completed Open Design artifact and Task 1's tests.
- Produces: a framework-free static deployment rooted at `public/`, with `/images/*` and `/videos/*` unchanged.

- [ ] **Step 1: Copy the v3 artifact and its assets**

Run:

```bash
cp "/Users/alex/Library/Application Support/Open Design/namespaces/release-stable/data/projects/609c79da-0474-4be7-a2c9-6bd190fb5273/photonenkollektiv-nachtarchiv.html" public/index.html
cp "/Users/alex/Library/Application Support/Open Design/namespaces/release-stable/data/projects/609c79da-0474-4be7-a2c9-6bd190fb5273/logo.svg" public/logo.svg
cp -R "/Users/alex/Library/Application Support/Open Design/namespaces/release-stable/data/projects/609c79da-0474-4be7-a2c9-6bd190fb5273/assets" public/assets
```

Add this line in `<head>`:

```html
<link rel="icon" href="logo.svg" type="image/svg+xml">
```

Add these declarations inside `@media (max-width: 390px)`:

```css
.statement-copy {
  font-size: clamp(2.2rem, 11.5vw, 3.2rem);
}

.event-group-head {
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
```

- [ ] **Step 2: Remove the old application and scaffold assets**

Run only against these exact paths:

```bash
rm -rf src
rm -f .eslintrc.json next.config.js tsconfig.json package-lock.json public/next.svg public/vercel.svg
```

- [ ] **Step 3: Replace package and Vercel configuration**

Set `package.json` to:

```json
{
  "name": "photonenkollektiv-static",
  "version": "3.0.0",
  "private": true,
  "scripts": {
    "test": "node --test tests/*.test.mjs"
  }
}
```

Create `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "outputDirectory": "public",
  "cleanUrls": true
}
```

- [ ] **Step 4: Update repository documentation and ignores**

Set `README.md` to:

````md
# Photonenkollektiv website

Static v3 website for photonenkollektiv.de.

## Local preview

```bash
python3 -m http.server 4173 -d public
```

Open http://localhost:4173.

## Tests

```bash
npm test
```

## Deployment

Vercel serves `public/` directly. Pushing this branch deploys according to the connected Vercel project's Git settings.
````

Reduce `.gitignore` to the static project's local artifacts:

```gitignore
.DS_Store
node_modules/
coverage/
.vercel/
.env
.env.*
!.env.example
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

- [ ] **Step 5: Run the complete test suite and verify green**

Run:

```bash
npm test
```

Expected: all nine tests pass with zero failures.

- [ ] **Step 6: Prove the legacy assets are byte-for-byte unchanged**

Run:

```bash
rg --files -0 public/images public/videos | sort -z | xargs -0 shasum > /tmp/website-pk-legacy-after.sha1
diff -u /tmp/website-pk-legacy-before.sha1 /tmp/website-pk-legacy-after.sha1
```

Expected: `diff` exits 0 with no output.

- [ ] **Step 7: Prove the deployed v3 assets match the source**

Run:

```bash
cmp public/logo.svg "/Users/alex/Library/Application Support/Open Design/namespaces/release-stable/data/projects/609c79da-0474-4be7-a2c9-6bd190fb5273/logo.svg"
diff -qr public/assets "/Users/alex/Library/Application Support/Open Design/namespaces/release-stable/data/projects/609c79da-0474-4be7-a2c9-6bd190fb5273/assets"
```

Expected: both commands exit 0 with no output. The deployment-only HTML
changes are covered by tests and browser verification.

### Task 3: Browser and deployment-quality verification

**Files:**
- Verify: `public/index.html`
- Verify: `public/assets/`
- Verify: `public/images/`
- Verify: `public/videos/`
- Verify: `vercel.json`

**Interfaces:**
- Consumes: Task 2's complete static output.
- Produces: fresh evidence that the exact artifact behaves correctly as a deployed static site at desktop and mobile widths.

- [ ] **Step 1: Start a local static server**

Run:

```bash
python3 -m http.server 4173 -d public
```

Expected: the server listens on `http://127.0.0.1:4173`.

- [ ] **Step 2: Verify the desktop experience**

At a 1440 × 1000 viewport:

- confirm the hero and first image load;
- activate the Nachtarchiv navigation link;
- select and clear a gallery tag filter;
- open and close a gallery lightbox;
- confirm the address and email link;
- confirm there are no console errors and no failed local asset requests.

- [ ] **Step 3: Verify the mobile and reduced-motion experience**

At a 390 × 844 viewport:

- open and close the navigation menu;
- follow a navigation link and confirm the menu closes;
- open and close a gallery lightbox;
- emulate `prefers-reduced-motion: reduce` and confirm content remains visible and usable;
- confirm no horizontal page overflow.

- [ ] **Step 4: Run final repository verification**

Run:

```bash
npm test
git diff --check
git status --short --branch
git branch --show-current
```

Expected: tests pass, `git diff --check` reports no whitespace errors, the branch is `v3`, and only the intended migration files are changed.
