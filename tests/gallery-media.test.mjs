import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const testDir = dirname(fileURLToPath(import.meta.url));
const projectDir = dirname(testDir);
const publicDir = join(projectDir, "public");
const helperPath = join(publicDir, "gallery.js");

function galleryHelpers() {
  assert.ok(existsSync(helperPath), "The gallery helper module exists.");
  const sandbox = {};
  vm.runInNewContext(readFileSync(helperPath, "utf8"), sandbox);
  return sandbox.PhotonenGallery;
}

function galleryData() {
  const html = readFileSync(join(publicDir, "index.html"), "utf8");
  const match = html.match(
    /<script\s+id="gallery-data"\s+type="application\/json">([\s\S]*?)<\/script>/
  );

  assert.ok(match, "The deployed page contains gallery data.");
  return JSON.parse(match[1]);
}

function filesBelow(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  });
}

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

test("gallery helpers sort newest named events first and Divers last per year", () => {
  const gallery = galleryHelpers();
  const fixtures = [
    { year: 2023, eventDate: "2023-12-31", isMisc: true, event: "Divers 2023" },
    { year: 2026, eventDate: "2026-06-13", isMisc: false, event: "Realitätärätätä 2026" },
    { year: 2025, eventDate: "2025-12-31", isMisc: true, event: "Divers 2025" },
    { year: 2026, eventDate: "2026-07-03", isMisc: false, event: "Feel Free 2026" },
    { year: 2023, eventDate: "2023-08-26", isMisc: false, event: "Keller DJ Set 2023" },
    { year: 2025, eventDate: "2025-11-15", isMisc: false, event: "R42 2025" },
    { year: 2026, eventDate: "2026-07-11", isMisc: false, event: "Vauyage to space 2026" }
  ];

  assert.deepEqual(
    Array.from(gallery.groupItems(fixtures), (group) => group.event),
    [
      "Vauyage to space 2026",
      "Feel Free 2026",
      "Realitätärätätä 2026",
      "R42 2025",
      "Divers 2025",
      "Keller DJ Set 2023",
      "Divers 2023"
    ]
  );
});

test("gallery helpers expose media typing and human-readable duration", () => {
  const gallery = galleryHelpers();

  assert.equal(gallery.isVideo({ type: "video" }), true);
  assert.equal(gallery.isVideo({ type: "image" }), false);
  assert.equal(gallery.formatDuration(81), "1:21");
});

test("the real manifest resolves to the approved descending event order", () => {
  const gallery = galleryHelpers();

  assert.deepEqual(
    Array.from(gallery.groupItems(galleryData().images), (group) => group.event),
    [
      "Vauyage to space 2026",
      "Feel Free 2026",
      "Realitätärätätä 2026",
      "R42 2025",
      "Proseccival 2025",
      "Findus Anglerheim 2025",
      "Vaulymp 2025",
      "Schmecktgarten 2025",
      "Südhof 2025",
      "Divers 2025",
      "Blackwood Filmfestival 2024",
      "Proseccival 2024",
      "Kirnhalden 2024",
      "Südhof 2024",
      "Steinregen 2024",
      "Divers 2024",
      "Keller DJ Set 2023",
      "Divers 2023"
    ]
  );
});

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
    renamed.some((item) =>
      `${item.event} ${item.eventEn} ${item.alt} ${item.altEn}`.includes("Studi Sommerfest")
    ),
    false
  );
});

test("proper event names stay unchanged while Divers is localized", () => {
  const items = galleryData().images;
  const translatedProperNames = items
    .filter((item) => !item.isMisc && item.eventEn !== item.event)
    .map((item) => item.event);
  const localizedMiscNames = items
    .filter((item) => item.isMisc)
    .every((item) => item.eventEn.startsWith("Miscellaneous "));

  assert.deepEqual(translatedProperNames, []);
  assert.equal(localizedMiscNames, true);
});

test("organized gallery folders contain only optimized web media", () => {
  const organizedFiles = [2023, 2024, 2025, 2026].flatMap((year) =>
    filesBelow(join(publicDir, "images", String(year)))
  );
  const sourceFormats = organizedFiles.filter((path) =>
    [".jpg", ".jpeg", ".mov"].includes(extname(path).toLowerCase())
  );

  assert.deepEqual(sourceFormats, []);
});
