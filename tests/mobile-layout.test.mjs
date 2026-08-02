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

test("mobile hero details align with the responsive content shell", () => {
  const mobileCss = cssBlockAfter(html, "@media (max-width: 700px)");
  const heroBottomCss = cssBlockAfter(mobileCss, ".hero-bottom");

  assert.match(
    heroBottomCss,
    /padding-inline:\s*calc\(\(100%\s*-\s*var\(--content\)\)\s*\/\s*2\)/,
    "The mobile hero details use the same left and right gutter as .shell."
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
