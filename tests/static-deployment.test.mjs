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
  const references = [...html.matchAll(/\s(?:src|href)="([^"]+)"/g)]
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
