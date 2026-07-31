import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const testDir = dirname(fileURLToPath(import.meta.url));
const projectDir = dirname(testDir);
const html = readFileSync(
  join(projectDir, "public", "index.html"),
  "utf8"
);

function createClassList(initialClasses = []) {
  const classes = new Set(initialClasses);

  return {
    add(name) {
      classes.add(name);
    },
    remove(name) {
      classes.delete(name);
    },
    contains(name) {
      return classes.has(name);
    }
  };
}

test("der Hero zeigt zuerst das Startbild und spielt danach jedes übrige Galeriebild genau einmal pro Runde", () => {
  const scriptMatch = html.match(
    /<script\s+data-role="hero-rotation">([\s\S]*?)<\/script>/
  );

  assert.ok(scriptMatch, "Ein isolierter Hero-Rotator ist vorhanden.");

  const firstHeroImage = {
    src: "assets/start.webp",
    getAttribute(name) {
      return name === "src" ? this.src : null;
    },
    classList: createClassList(["is-active"])
  };
  const secondHeroImage = {
    src: "",
    getAttribute(name) {
      return name === "src" ? this.src : null;
    },
    classList: createClassList()
  };
  const heroImages = [firstHeroImage, secondHeroImage];
  const galleryData = {
    images: [
      { src: "assets/start.webp", visible: true },
      { src: "assets/one.webp", visible: true },
      { src: "assets/two.webp", visible: true },
      { src: "assets/three.webp", visible: true },
      { src: "assets/hidden.webp", visible: false }
    ]
  };
  let intervalDelay;
  let intervalCallback;

  class FakeImage {
    set src(value) {
      this._src = value;
      if (this.onload) this.onload();
    }
  }

  const sandbox = {
    document: {
      querySelectorAll(selector) {
        return selector === ".hero-media img" ? heroImages : [];
      },
      getElementById(id) {
        return id === "gallery-data"
          ? { textContent: JSON.stringify(galleryData) }
          : null;
      }
    },
    Image: FakeImage,
    Math: Object.create(Math),
    window: {
      matchMedia() {
        return { matches: false };
      },
      setInterval(callback, delay) {
        intervalCallback = callback;
        intervalDelay = delay;
      }
    }
  };
  sandbox.Math.random = () => 0;

  vm.runInNewContext(scriptMatch[1], sandbox);

  assert.equal(firstHeroImage.src, "assets/start.webp", "Das Startbild bleibt zunächst stehen.");
  assert.equal(intervalDelay, 5000, "Der Wechsel ist auf fünf Sekunden getaktet.");
  assert.equal(typeof intervalCallback, "function", "Der Wechsel wurde eingeplant.");

  const firstRound = [];

  for (let index = 0; index < 3; index += 1) {
    intervalCallback();
    const activeImage = heroImages.find((image) =>
      image.classList.contains("is-active")
    );
    firstRound.push(activeImage.src);
  }

  assert.deepEqual(
    new Set(firstRound),
    new Set(["assets/one.webp", "assets/two.webp", "assets/three.webp"]),
    "Nach dem Startbild erscheint jedes übrige sichtbare Bild genau einmal."
  );

  const lastSourceInFirstRound = firstRound.at(-1);
  intervalCallback();
  const firstSourceInSecondRound = heroImages.find((image) =>
    image.classList.contains("is-active")
  ).src;

  assert.notEqual(
    firstSourceInSecondRound,
    lastSourceInFirstRound,
    "An der Rundengrenze gibt es keine direkte Wiederholung."
  );

  const secondRound = [firstSourceInSecondRound];

  for (let index = 1; index < 4; index += 1) {
    intervalCallback();
    secondRound.push(
      heroImages.find((image) =>
        image.classList.contains("is-active")
      ).src
    );
  }

  assert.deepEqual(
    new Set(secondRound),
    new Set([
      "assets/start.webp",
      "assets/one.webp",
      "assets/two.webp",
      "assets/three.webp"
    ]),
    "Ab der zweiten Runde erscheint auch das Startbild wieder genau einmal."
  );
});

test("der Hero enthält keine separate rechte Logo-Fläche", () => {
  const heroMatch = html.match(
    /<section class="hero"[\s\S]*?<\/section>/
  );

  assert.ok(heroMatch, "Der Hero ist vorhanden.");
  assert.doesNotMatch(
    heroMatch[0],
    /class="hero-logo"/,
    "Das separate Logo rechts im Hero wurde entfernt."
  );
});

test("das beibehaltene Startbild ist Teil der sichtbaren Galerie", () => {
  const startImageMatch = html.match(
    /<div class="hero-media"[\s\S]*?<img class="is-active" src="([^"]+)"/
  );
  const galleryDataMatch = html.match(
    /<script\s+id="gallery-data"\s+type="application\/json">([\s\S]*?)<\/script>/
  );

  assert.ok(startImageMatch, "Das aktive Startbild ist im Hero definiert.");
  assert.ok(galleryDataMatch, "Die Galeriedaten sind vorhanden.");

  const visibleSources = JSON.parse(galleryDataMatch[1]).images
    .filter((image) => image.visible)
    .map((image) => image.src);

  assert.ok(
    visibleSources.includes(startImageMatch[1]),
    "Das Startbild wird in der ersten Runde übersprungen und ab Runde zwei gleichwertig abgespielt."
  );
});
