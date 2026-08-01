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
    new RegExp(`<script\\s+id="${id}"\\s+type="application/json">([\\s\\S]*?)<\\/script>`)
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
  const keyPattern =
    /data-i18n(?:-html|-aria-label|-alt|-content|-href)?="([^"]+)"/g;
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

  assert.equal(gallery.images.length, 75);
  assert.equal(typeof gallery.tagLabels.en, "object");

  for (const tag of gallery.tagOrder) {
    assert.equal(
      typeof gallery.tagLabels.en[tag],
      "string",
      `${tag} has an English label.`
    );
  }

  for (const [index, image] of gallery.images.entries()) {
    assert.equal(typeof image.event, "string", `Image ${index + 1} keeps German event.`);
    assert.equal(
      typeof image.eventEn,
      "string",
      `Image ${index + 1} has English event.`
    );
    assert.equal(typeof image.alt, "string", `Image ${index + 1} keeps German alt.`);
    assert.equal(typeof image.altEn, "string", `Image ${index + 1} has English alt.`);
    assert.ok(image.eventEn.trim(), `Image ${index + 1} English event is non-empty.`);
    assert.ok(image.altEn.trim(), `Image ${index + 1} English alt is non-empty.`);
  }
});
