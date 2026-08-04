# Solidarity Copy Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved reference to solidarity-based event formats to support bullet 01 in German and English.

**Architecture:** Keep German as the literal SEO and no-JavaScript fallback in `public/index.html`. Update the matching German and English `about.support.copy` catalog entries so runtime language switching remains synchronized.

**Tech Stack:** Static HTML, embedded JSON translations, Node.js built-in test runner.

## Global Constraints

- Use the approved German copy verbatim.
- Translate the added concept as “solidarity-based event formats” in English.
- Do not change layout, behavior, assets, or other copy.
- Keep all work on branch `v3`.

---

### Task 1: Update synchronized support copy

**Files:**
- Modify: `public/index.html`
- Verify: `tests/i18n-content.test.mjs`

**Interfaces:**
- Consumes: German literal markup and the `about.support.copy` translation key.
- Produces: synchronized German fallback and DE/EN runtime copy.

- [x] **Step 1: Update the German literal and catalog value**

Replace the current support sentence with:

```text
Wir unterstützen selbstorganisierte Kulturveranstaltungen und solidarische Veranstaltungsformate bei Licht, Klang, Aufbau und Betrieb — passend zu Raum, Idee und vorhandenen Mitteln.
```

- [x] **Step 2: Update the English catalog value**

Use:

```text
We support self-organized cultural events and solidarity-based event formats with lighting, sound, setup, and operation — adapted to the space, idea, and available resources.
```

- [x] **Step 3: Verify the complete site**

Run:

```bash
npm test
git diff --check
```

Expected: all tests pass and the diff has no whitespace errors.
