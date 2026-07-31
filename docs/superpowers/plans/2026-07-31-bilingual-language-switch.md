# Bilingual Language Switch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add complete German/English language switching to the static v3 site while preserving German as the committed SEO and no-JavaScript fallback.

**Architecture:** A dependency-free `public/language.js` resolves stored and system preferences, applies an embedded bilingual catalog, updates the DOM, and emits a language-change event. German strings remain literal HTML and stable gallery keys; English event names, tag labels, and image alternatives augment the existing gallery JSON. The existing gallery renderer localizes presentation without changing filtering identity.

**Tech Stack:** Static HTML/CSS/JavaScript, browser `localStorage`, Node.js built-in test runner, Chrome DevTools browser verification.

## Global Constraints

- Keep `<html lang="de">`, German metadata, German visible copy, German ARIA labels, and German gallery metadata in committed markup.
- Translate every current German user-facing string, including generated gallery, CSS label, accessibility, metadata, mail subject, and all 20 image alternatives.
- A saved `de` or `en` choice overrides system language.
- Without a saved choice, a primary system language beginning with `de` selects German; every other language selects English.
- Missing translations fall back to German.
- Keep the implementation dependency-free.
- Preserve existing `/images/*`, `/videos/*`, v3 asset, hero, gallery, deployment, and responsive contracts.
- Keep all work on `v3`; do not checkout, merge into, or modify `main`.

---

### Task 1: Language preference utility

**Files:**
- Create: `public/language.js`
- Create: `tests/language-switcher.test.mjs`

**Interfaces:**
- Consumes: optional stored language and primary browser language.
- Produces: `globalThis.PhotonenLanguage` with `STORAGE_KEY`, `normalizeLanguage`, `resolveLanguage`, `readStoredLanguage`, `writeStoredLanguage`, and `initialize`.

- [x] **Step 1: Write the failing language-resolution tests**

Create `tests/language-switcher.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const testDir = dirname(fileURLToPath(import.meta.url));
const projectDir = dirname(testDir);
const source = readFileSync(join(projectDir, "public", "language.js"), "utf8");
const sandbox = {};
sandbox.globalThis = sandbox;
vm.runInNewContext(source, sandbox);

const language = sandbox.PhotonenLanguage;

test("normalizes only supported German and English language tags", () => {
  assert.equal(language.normalizeLanguage("de-DE"), "de");
  assert.equal(language.normalizeLanguage("EN_us"), "en");
  assert.equal(language.normalizeLanguage("fr"), null);
  assert.equal(language.normalizeLanguage(undefined), null);
});

test("stored choice overrides the system language", () => {
  assert.equal(language.resolveLanguage("de", "en-US"), "de");
  assert.equal(language.resolveLanguage("en", "de-DE"), "en");
});

test("system German selects German and every other system language selects English", () => {
  assert.equal(language.resolveLanguage(null, "de-CH"), "de");
  assert.equal(language.resolveLanguage(null, "en-GB"), "en");
  assert.equal(language.resolveLanguage(null, "fr-FR"), "en");
  assert.equal(language.resolveLanguage("invalid", "de-DE"), "de");
});

test("storage failures never prevent language selection", () => {
  const failingStorage = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    }
  };

  assert.equal(language.readStoredLanguage(failingStorage), null);
  assert.equal(language.writeStoredLanguage(failingStorage, "en"), false);
});

test("valid choices are read from and written to storage", () => {
  const values = new Map();
  const storage = {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    }
  };

  assert.equal(language.writeStoredLanguage(storage, "en"), true);
  assert.equal(values.get("photonenkollektiv-language"), "en");
  assert.equal(language.readStoredLanguage(storage), "en");
});
```

- [x] **Step 2: Run the focused test and verify red**

Run:

```bash
node --test tests/language-switcher.test.mjs
```

Expected: FAIL with `ENOENT` for `public/language.js`.

- [x] **Step 3: Implement the dependency-free language utility**

Create `public/language.js` as a strict IIFE that exports the interfaces above
on `globalThis.PhotonenLanguage`.

The pure behavior must be:

```js
const STORAGE_KEY = "photonenkollektiv-language";

function normalizeLanguage(value) {
  if (typeof value !== "string") return null;
  const primary = value.trim().toLowerCase().split(/[-_]/)[0];
  return primary === "de" || primary === "en" ? primary : null;
}

function resolveLanguage(storedLanguage, systemLanguage) {
  return normalizeLanguage(storedLanguage) ||
    (normalizeLanguage(systemLanguage) === "de" ? "de" : "en");
}
```

`readStoredLanguage` and `writeStoredLanguage` wrap storage access in
`try/catch`. `initialize` parses `#i18n-data`, updates targets carrying
`data-i18n`, `data-i18n-html`, `data-i18n-aria-label`, `data-i18n-alt`,
`data-i18n-content`, or `data-i18n-href`, updates language buttons, and emits
`photonenkollektiv:languagechange`.

- [x] **Step 4: Run the focused test and verify green**

Run:

```bash
node --test tests/language-switcher.test.mjs
```

Expected: 5 tests pass.

### Task 2: Complete bilingual catalog and page integration

**Files:**
- Modify: `public/index.html`
- Create: `tests/i18n-content.test.mjs`
- Modify: `tests/photonenkollektiv-portfolio.test.mjs`

**Interfaces:**
- Consumes: `PhotonenLanguage.initialize`, German literal markup, and the existing gallery JSON.
- Produces: the DE/EN control, a complete `#i18n-data` catalog, localized static DOM, localized gallery presentation, and persisted switching.

- [x] **Step 1: Write the failing content-coverage test**

Create `tests/i18n-content.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const testDir = dirname(fileURLToPath(import.meta.url));
const projectDir = dirname(testDir);
const html = readFileSync(join(projectDir, "public", "index.html"), "utf8");

function embeddedJson(id) {
  const match = html.match(
    new RegExp(`<script\\\\s+id="${id}"\\\\s+type="application/json">([\\\\s\\\\S]*?)<\\\\/script>`)
  );
  assert.ok(match, `#${id} exists.`);
  return JSON.parse(match[1]);
}

test("German remains the literal SEO and no-JavaScript language", () => {
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<title[^>]*>Photonenkollektiv — Licht, Klang, Kultur<\/title>/);
  assert.match(
    html,
    /<meta name="description"[^>]*content="Photonenkollektiv – Freiburger Verein/
  );
  assert.match(html, />Kultur wird <span>sichtbar\.<\/span><\/h1>/);
});

test("every marked translation key exists in German and English", () => {
  const catalog = embeddedJson("i18n-data");
  const keyPattern = /data-i18n(?:-html|-aria-label|-alt|-content|-href)?="([^"]+)"/g;
  const keys = new Set([...html.matchAll(keyPattern)].map((match) => match[1]));

  assert.ok(keys.size >= 30, "The complete page is marked for translation.");

  for (const key of keys) {
    assert.equal(typeof catalog.de[key], "string", `German ${key} exists.`);
    assert.equal(typeof catalog.en[key], "string", `English ${key} exists.`);
    assert.ok(catalog.de[key].trim(), `German ${key} is non-empty.`);
    assert.ok(catalog.en[key].trim(), `English ${key} is non-empty.`);
  }
});

test("the header exposes an accessible persistent DE and EN control", () => {
  assert.match(html, /class="language-switch"/);
  assert.match(html, /data-language="de"[^>]*aria-pressed="true"/);
  assert.match(html, /data-language="en"[^>]*aria-pressed="false"/);
  assert.match(html, /<script src="language\.js"><\/script>/);
});

test("all gallery metadata has complete English presentation", () => {
  const gallery = embeddedJson("gallery-data");

  assert.equal(gallery.images.length, 20);
  assert.equal(typeof gallery.tagLabels.en, "object");

  for (const tag of gallery.tagOrder) {
    assert.equal(typeof gallery.tagLabels.en[tag], "string", `${tag} has an English label.`);
  }

  for (const [index, image] of gallery.images.entries()) {
    assert.equal(typeof image.event, "string", `Image ${index + 1} keeps German event.`);
    assert.equal(typeof image.eventEn, "string", `Image ${index + 1} has English event.`);
    assert.equal(typeof image.alt, "string", `Image ${index + 1} keeps German alt.`);
    assert.equal(typeof image.altEn, "string", `Image ${index + 1} has English alt.`);
    assert.ok(image.eventEn.trim(), `Image ${index + 1} English event is non-empty.`);
    assert.ok(image.altEn.trim(), `Image ${index + 1} English alt is non-empty.`);
  }
});
```

Extend the portfolio test to require non-empty `eventEn` and `altEn` strings
and English labels for every tag.

- [x] **Step 2: Run the content tests and verify red**

Run:

```bash
node --test tests/i18n-content.test.mjs tests/photonenkollektiv-portfolio.test.mjs
```

Expected: FAIL because `#i18n-data`, the switch, `tagLabels.en`, `eventEn`, and
`altEn` do not exist.

- [x] **Step 3: Add the header control and responsive styling**

Wrap the email and mobile menu button in `.header-actions`. Add the accessible
DE/EN group before them. Style it as a restrained text control with visible
focus and pressed states. Keep it visible below 980 px, and hide `.brand span`
below 350 px so 320 px remains overflow-free.

- [x] **Step 4: Mark every static German string and add the catalog**

Add translation attributes to title, description, static text, structured
HTML, ARIA labels, alt text, and the localized mailto link. Add
`<script id="i18n-data" type="application/json">` with complete `de` and `en`
flat catalogs.

The catalog must use the exact copy and gallery translations from:

`docs/superpowers/specs/2026-07-31-bilingual-language-switch-design.md`

It must also contain dynamic keys for:

```text
language.label
menu.open
menu.close
gallery.filterAll
gallery.imagesByTag
gallery.imagesGrouped
gallery.imagesByEvent
gallery.openImage
gallery.open
gallery.countOne
gallery.countMany
lightbox.viewer
lightbox.close
lightbox.previous
lightbox.next
```

- [x] **Step 5: Add complete English gallery metadata**

Keep `event`, `tags`, and `alt` unchanged. Add `eventEn` and `altEn` to all 20
records using the exact translations in the design spec. Add:

```json
"tagLabels": {
  "de": {
    "Innenraum": "Innenraum",
    "Open Air": "Open Air",
    "Installation": "Installation",
    "Laser": "Laser",
    "Technik": "Technik",
    "Lichtkunst": "Lichtkunst",
    "Aufbau": "Aufbau"
  },
  "en": {
    "Innenraum": "Indoor",
    "Open Air": "Open air",
    "Installation": "Installation",
    "Laser": "Laser",
    "Technik": "Technology",
    "Lichtkunst": "Light art",
    "Aufbau": "Setup"
  }
}
```

- [x] **Step 6: Localize the dynamic menu, gallery, and lightbox**

Initialize `PhotonenLanguage` before the existing interaction script. Resolve
dynamic labels through `languageController.translate(key)`. Keep `activeTag`
as the German stable key. Rebuild filters and groups after
`photonenkollektiv:languagechange`; repaint an open lightbox.

Change the CSS overlay label from a fixed German string to:

```css
.image-wrap::after {
  content: attr(data-open-label);
}
```

Set `imageWrap.dataset.openLabel` from `gallery.open`.

- [x] **Step 7: Run the complete test suite and verify green**

Run:

```bash
npm test
```

Expected: all 18 tests pass.

### Task 3: Browser behavior and responsive verification

**Files:**
- Verify: `public/index.html`
- Verify: `public/language.js`
- Verify: `tests/language-switcher.test.mjs`
- Verify: `tests/i18n-content.test.mjs`

**Interfaces:**
- Consumes: the complete static bilingual output.
- Produces: browser evidence for language negotiation, persistence, total translation coverage, accessibility state, and layout stability.

- [x] **Step 1: Start the static preview**

Run:

```bash
python3 -m http.server 4173 -d public
```

- [x] **Step 2: Verify system-language defaults with empty storage**

In isolated browser contexts:

- `de-DE` resolves to German;
- `en-US` resolves to English;
- `fr-FR` resolves to English;
- German remains visible when JavaScript is disabled.

- [x] **Step 3: Verify manual choice and persistence**

Starting from English system language:

- select DE and confirm `aria-pressed`, `<html lang>`, title, description,
  static copy, gallery, alt text, lightbox, and mail subject switch to German;
- reload and confirm German persists;
- select EN, reload, and confirm English persists.

- [x] **Step 4: Verify responsive and accessibility behavior**

At 1440 × 1000, 390 × 844, and 320 × 720:

- the language control is visible and keyboard/touch operable;
- the mobile menu, filters, and lightbox still work;
- the page has no horizontal overflow;
- focus indicators remain visible;
- no German user-facing copy remains while English is active, except proper
  names, address, and values intentionally shared by both languages.

- [x] **Step 5: Run final verification**

Run:

```bash
npm test
git diff --check
git branch --show-current
git status --short --branch
```

Expected: the suite passes, whitespace is clean, the branch is `v3`, and no
merge or checkout of `main` occurred.
