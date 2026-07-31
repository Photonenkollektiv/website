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
