import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const testDir = dirname(fileURLToPath(import.meta.url));
const projectDir = dirname(testDir);
const htmlPath = join(projectDir, "public", "index.html");
const html = readFileSync(htmlPath, "utf8");

const match = html.match(
  /<script\s+id="gallery-data"\s+type="application\/json">([\s\S]*?)<\/script>/
);

assert.ok(match, "Die Seite stellt die Galeriedaten als eingebettetes JSON bereit.");

const data = JSON.parse(match[1]);
assert.ok(Array.isArray(data.images), "Das Galerie-JSON enthält ein images-Array.");
assert.equal(data.images.length, 75, "Alle 69 Bilder und 6 Videos sind erfasst.");
assert.equal(typeof data.tagLabels?.en, "object", "Die Tags besitzen englische Anzeigenamen.");

assert.equal(
  data.images.filter((image) => image.type === "image").length,
  69,
  "Die Galerie enthält 69 Bilder."
);
assert.equal(
  data.images.filter((image) => image.type === "video").length,
  6,
  "Die Galerie enthält 6 Videos."
);

for (const tag of data.tagOrder) {
  assert.equal(
    typeof data.tagLabels.en[tag],
    "string",
    `Der Tag ${tag} besitzt einen englischen Anzeigenamen.`
  );
  assert.ok(data.tagLabels.en[tag].trim(), `Der englische Anzeigename für ${tag} ist nicht leer.`);
}

const sources = new Set();
const events = new Set();

for (const [index, image] of data.images.entries()) {
  assert.ok(
    image.type === "image" || image.type === "video",
    `Medium ${index + 1} besitzt einen unterstützten Typ.`
  );
  assert.equal(typeof image.src, "string", `Bild ${index + 1} besitzt eine Quelle.`);
  assert.ok(
    Number.isInteger(image.year) && image.year >= 2023 && image.year <= 2026,
    `Medium ${index + 1} besitzt ein gültiges Jahr.`
  );
  assert.match(
    image.eventDate,
    /^20\d{2}-\d{2}-\d{2}$/,
    `Medium ${index + 1} besitzt ein ISO-Eventdatum.`
  );
  assert.equal(
    typeof image.isMisc,
    "boolean",
    `Medium ${index + 1} kennzeichnet Divers eindeutig.`
  );
  assert.equal(typeof image.event, "string", `Bild ${index + 1} ist einem Event zugeordnet.`);
  assert.ok(image.event.trim(), `Bild ${index + 1} hat einen nichtleeren Eventnamen.`);
  assert.equal(
    typeof image.eventEn,
    "string",
    `Bild ${index + 1} besitzt einen englischen Eventnamen.`
  );
  assert.ok(image.eventEn.trim(), `Bild ${index + 1} hat einen nichtleeren englischen Eventnamen.`);
  assert.ok(Array.isArray(image.tags), `Bild ${index + 1} besitzt Tags.`);
  assert.ok(image.tags.length > 0, `Bild ${index + 1} besitzt mindestens einen Tag.`);
  for (const tag of image.tags) {
    assert.ok(data.tagOrder.includes(tag), `Medium ${index + 1} verwendet den bekannten Tag ${tag}.`);
  }
  assert.equal(typeof image.alt, "string", `Bild ${index + 1} besitzt einen Alternativtext.`);
  assert.ok(image.alt.trim(), `Bild ${index + 1} hat einen nichtleeren Alternativtext.`);
  assert.equal(
    typeof image.altEn,
    "string",
    `Bild ${index + 1} besitzt einen englischen Alternativtext.`
  );
  assert.ok(
    image.altEn.trim(),
    `Bild ${index + 1} hat einen nichtleeren englischen Alternativtext.`
  );
  assert.ok(!sources.has(image.src), `Die Quelle ${image.src} kommt nur einmal vor.`);
  assert.ok(
    existsSync(join(projectDir, "public", image.src)),
    `Die lokale Bilddatei ${image.src} ist vorhanden.`
  );

  if (image.type === "image") {
    assert.match(image.src, /\.webp$/i, `Bild ${index + 1} wird als WebP ausgeliefert.`);
  } else {
    assert.match(image.src, /\.mp4$/i, `Video ${index + 1} wird als MP4 ausgeliefert.`);
    assert.match(image.poster, /\.webp$/i, `Video ${index + 1} besitzt ein WebP-Poster.`);
    assert.ok(
      existsSync(join(projectDir, "public", image.poster)),
      `Das Video-Poster ${image.poster} ist vorhanden.`
    );
    assert.ok(image.duration > 0, `Video ${index + 1} besitzt eine positive Dauer.`);
  }

  sources.add(image.src);
  events.add(image.event);
}

assert.equal(events.size, 18, "Die Medien sind in 18 Eventgruppen gegliedert.");
assert.match(
  html,
  /function\s+renderGallery\s*\(/,
  "Die Galerie wird aus der JSON-Struktur gerendert."
);
assert.match(
  html,
  /class="event-groups"/,
  "Die Seite stellt einen Zielbereich für die Eventgruppen bereit."
);
assert.match(
  html,
  /<video\s+id="lightbox-video"[^>]*\bcontrols\b[^>]*\bplaysinline\b[^>]*>/,
  "Die Medienansicht besitzt eine steuerbare Inline-Videofläche."
);

console.log(`Galerievertrag erfüllt: ${data.images.length} Medien in ${events.size} Eventgruppen.`);
