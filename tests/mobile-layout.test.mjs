import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const testDir = dirname(fileURLToPath(import.meta.url));
const projectDir = dirname(testDir);
const html = readFileSync(join(projectDir, "public", "index.html"), "utf8");

function cssBlockAfter(source, marker) {
  const markerIndex = source.indexOf(marker);
  assert.notEqual(markerIndex, -1, `CSS block ${marker} exists.`);

  const openingBrace = source.indexOf("{", markerIndex);
  let depth = 0;

  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;

    if (depth === 0) {
      return source.slice(openingBrace + 1, index);
    }
  }

  assert.fail(`CSS block ${marker} is closed.`);
}

test("hero details align with the responsive content shell at every viewport", () => {
  const heroBottomCss = cssBlockAfter(html, ".hero-bottom");

  assert.match(
    heroBottomCss,
    /padding-inline:\s*var\(--hero-axis\)/,
    "The hero details use the shared photon-line axis."
  );
});

test("hero headline aligns with the photon line and supporting copy", () => {
  const heroCopyCss = cssBlockAfter(html, ".hero-copy");

  assert.match(
    heroCopyCss,
    /padding-inline:\s*var\(--hero-axis\)/,
    "The hero headline uses the same left and right gutter as the details."
  );
});

test("the shared hero axis controls the photon line and both text blocks", () => {
  const rootCss = cssBlockAfter(html, ":root");
  const photonLineCss = cssBlockAfter(html, ".photon-line");
  const mobileRootCss = cssBlockAfter(
    cssBlockAfter(html, "@media (max-width: 700px)"),
    ":root"
  );

  assert.match(rootCss, /--hero-axis:\s*clamp\(20px,\s*5\.5vw,\s*104px\)/);
  assert.match(photonLineCss, /left:\s*var\(--hero-axis\)/);
  assert.match(mobileRootCss, /--hero-axis:\s*16px/);
});

test("the mobile hero fills the viewport when preview tooling narrows the body", () => {
  const mobileCss = cssBlockAfter(html, "@media (max-width: 700px)");

  assert.match(
    mobileCss,
    /\.hero\s*\{[^}]*width:\s*100vw;/s,
    "The mobile hero remains edge-to-edge independently of its containing block."
  );
});

test("the Verein slogan stays within the content shell across mobile widths", () => {
  const mobileCss = cssBlockAfter(html, "@media (max-width: 700px)");
  const statementMatch = mobileCss.match(
    /\.statement-copy\s*\{[^}]*font-size:\s*clamp\([^,]+,\s*([\d.]+)vw,/s
  );

  assert.ok(statementMatch, "The mobile Verein slogan has a dedicated fluid size.");
  assert.ok(
    Number(statementMatch[1]) <= 10.5,
    "The fluid slogan size keeps ‘Kulturveranstaltungen.’ inside the mobile shell."
  );
});
