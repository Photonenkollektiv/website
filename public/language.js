(function (global) {
  "use strict";

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

  function readStoredLanguage(storage) {
    try {
      return storage ? storage.getItem(STORAGE_KEY) : null;
    } catch {
      return null;
    }
  }

  function writeStoredLanguage(storage, language) {
    const normalizedLanguage = normalizeLanguage(language);
    if (!storage || !normalizedLanguage) return false;

    try {
      storage.setItem(STORAGE_KEY, normalizedLanguage);
      return true;
    } catch {
      return false;
    }
  }

  function initialize(options) {
    const settings = options || {};
    const doc = settings.document || global.document;
    if (!doc) return null;

    const catalogElement = doc.getElementById("i18n-data");
    let catalog;

    try {
      catalog = JSON.parse(catalogElement.textContent);
    } catch {
      doc.documentElement.classList.remove("language-pending");
      return null;
    }

    let storage = settings.storage;
    if (!Object.prototype.hasOwnProperty.call(settings, "storage")) {
      try {
        storage = global.localStorage;
      } catch {
        storage = null;
      }
    }

    const browser = settings.navigator || global.navigator || {};
    const systemLanguage =
      (browser.languages && browser.languages[0]) ||
      browser.language;
    const requestedLanguage =
      normalizeLanguage(settings.language) ||
      normalizeLanguage(doc.documentElement.dataset.initialLanguage) ||
      resolveLanguage(readStoredLanguage(storage), systemLanguage);
    let currentLanguage = requestedLanguage;

    function translate(key, language) {
      const selectedLanguage = normalizeLanguage(language) || currentLanguage;
      const selectedCatalog = catalog[selectedLanguage] || {};
      const germanCatalog = catalog.de || {};

      if (typeof selectedCatalog[key] === "string") return selectedCatalog[key];
      if (typeof germanCatalog[key] === "string") return germanCatalog[key];
      return key;
    }

    function updateTargets(selector, update) {
      doc.querySelectorAll(selector).forEach(function (element) {
        const key = element.getAttribute(selector.slice(1, -1));
        update(element, translate(key));
      });
    }

    function dispatchLanguageChange() {
      const view = doc.defaultView || global;
      if (typeof view.CustomEvent !== "function") return;

      doc.dispatchEvent(new view.CustomEvent("photonenkollektiv:languagechange", {
        detail: { language: currentLanguage }
      }));
    }

    function applyLanguage(language, behavior) {
      const normalizedLanguage = normalizeLanguage(language);
      if (!normalizedLanguage) return false;

      currentLanguage = normalizedLanguage;
      doc.documentElement.lang = normalizedLanguage;
      doc.documentElement.dataset.initialLanguage = normalizedLanguage;

      updateTargets("[data-i18n]", function (element, value) {
        element.textContent = value;
      });
      updateTargets("[data-i18n-html]", function (element, value) {
        element.innerHTML = value;
      });
      updateTargets("[data-i18n-aria-label]", function (element, value) {
        element.setAttribute("aria-label", value);
      });
      updateTargets("[data-i18n-alt]", function (element, value) {
        element.setAttribute("alt", value);
      });
      updateTargets("[data-i18n-content]", function (element, value) {
        element.setAttribute("content", value);
      });
      updateTargets("[data-i18n-href]", function (element, value) {
        element.setAttribute("href", value);
      });

      doc.querySelectorAll("[data-language]").forEach(function (button) {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.language === normalizedLanguage)
        );
      });

      doc.documentElement.classList.remove("language-pending");

      if (!behavior || behavior.persist !== false) {
        writeStoredLanguage(storage, normalizedLanguage);
      }
      if (!behavior || behavior.emit !== false) {
        dispatchLanguageChange();
      }
      return true;
    }

    doc.querySelectorAll("[data-language]").forEach(function (button) {
      button.addEventListener("click", function () {
        applyLanguage(button.dataset.language);
      });
    });

    applyLanguage(requestedLanguage, { persist: false });

    return Object.freeze({
      get language() {
        return currentLanguage;
      },
      setLanguage: applyLanguage,
      translate
    });
  }

  global.PhotonenLanguage = Object.freeze({
    STORAGE_KEY,
    normalizeLanguage,
    resolveLanguage,
    readStoredLanguage,
    writeStoredLanguage,
    initialize
  });
})(globalThis);
