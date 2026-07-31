# Bilingual Language Switch Design

## Goal

Add complete German and English presentation to the static v3 website while
keeping German as the literal HTML, SEO language, and no-JavaScript fallback.
On first visit the active language follows the visitor's system language;
after an explicit choice, the saved choice overrides the system language.

## Language resolution

The site supports `de` and `en`.

1. Read `photonenkollektiv-language` from `localStorage`.
2. If the stored value normalizes to `de` or `en`, use it.
3. Otherwise inspect the primary system language from
   `navigator.languages[0]` or `navigator.language`.
4. A system language beginning with `de` selects German. Every other system
   language selects English.
5. If storage access throws, continue with system-language detection.
6. If language initialization fails, remove any temporary anti-flash state
   and reveal the original German page.

Selecting DE or EN writes the choice to `localStorage`. The choice remains
active across future visits until the visitor selects the other language or
clears site storage.

## SEO and progressive enhancement

The committed document retains:

- `<html lang="de">`;
- the German `<title>`;
- the German meta description;
- German visible text;
- German ARIA labels;
- German gallery event names, tags, counts, and alternative text.

JavaScript enhances that German document in place. Search engines and visitors
without JavaScript receive a complete German page. Activating English changes
`<html lang>` to `en`, the title and description, visible text, ARIA labels,
the mail subject, and all generated gallery text.

A small synchronous language utility loads in the document head. It resolves
the preferred language before body rendering. When English is selected, the
root receives a short-lived `language-pending` class so the German fallback is
not visibly flashed. Initialization removes the class immediately; a timeout
also removes it if enhancement fails.

## Language control

The header gains a compact DE / EN button group:

- `role="group"` with a localized accessible label;
- one button per language;
- `aria-pressed="true"` on the active language;
- visible focus styles;
- no navigation or page reload.

On desktop the group sits with the email link at the right of the header. On
mobile it remains beside the menu button. Below 350 px the long wordmark hides
while the logo remains, preventing the additional control from causing
horizontal overflow.

## Translation architecture

`public/language.js` owns language normalization, preference persistence,
catalog lookup, DOM translation, and the language-change event. It exposes:

- `normalizeLanguage(value): "de" | "en" | null`;
- `resolveLanguage(storedLanguage, systemLanguage): "de" | "en"`;
- `readStoredLanguage(storage): string | null`;
- `writeStoredLanguage(storage, language): boolean`;
- `initialize(options): LanguageController`.

The controller exposes:

- `language`;
- `translate(key)`;
- `setLanguage(language, { persist })`.

The HTML contains one JSON translation catalog. Static elements identify their
catalog key through attributes for text, HTML, ARIA labels, alt text, metadata,
or links. Missing English values fall back to German. Missing German values
fall back to the key, keeping failures visible during development.

After applying a language, the controller dispatches
`photonenkollektiv:languagechange` with the active language and translator.
The gallery listens for this event and rebuilds filters, groups, image alt
text, counts, accessible names, and an open lightbox without reloading.

## Gallery model

The existing German gallery contract remains intact:

- `event` remains the German event name;
- `tags` remain German stable filter keys;
- `alt` remains the German alternative text.

The data gains:

- `eventEn` for English event names;
- `altEn` for English alternative text;
- `tagLabels.en` for English labels keyed by the existing German tag value.

Internal filtering and grouping continue to use the German stable values, so a
language change never loses the active filter. Presentation uses localized
labels.

## Translation coverage

Every current German user-facing string is translated, including:

- document title and description;
- skip link;
- brand, navigation, and menu-state labels;
- hero, archive, association, contact, and footer copy;
- mail subject;
- language-control label;
- gallery filter and grouping labels;
- event names, tags, singular/plural image counts, image-opening labels, and
  the CSS-generated `Öffnen` label;
- all 20 gallery alternative texts;
- lightbox name, close, previous, next, caption, and image alt text.

Proper names, the postal address, email address, years, and the
Photonenkollektiv name remain unchanged where translation would be incorrect.

### English page copy

| German | English |
| --- | --- |
| Photonenkollektiv — Licht, Klang, Kultur | Photonenkollektiv — Light, Sound, Culture |
| Zum Inhalt | Skip to content |
| Nachtarchiv | Night archive |
| Der Verein | The association |
| Kontakt | Contact |
| Kultur wird sichtbar. | Culture becomes visible. |
| Wir schaffen Licht- und Klangräume für lokale, selbstorganisierte Kulturveranstaltungen. | We create lighting and sound environments for local, self-organized cultural events. |
| Vor Ort & mobil | On site & mobile |
| Zum Nachtarchiv ↓ | Explore the night archive ↓ |
| Ein Verein zur Förderung der Hör- und Sichtbarkeit von Kulturveranstaltungen. | An association supporting the audibility and visibility of cultural events. |
| Aus dem Archiv | From the archive |
| Nächte, die bleiben. | Nights that stay with us. |
| Ein Blick auf Räume, Installationen und gemeinsame Arbeit — geordnet nach Veranstaltung. | A look at spaces, installations, and collaborative work — grouped by event. |
| Was wir beitragen | What we contribute |
| Technik teilen. Kultur möglich machen. | Share technology. Make culture possible. |
| Veranstaltungen unterstützen | Support events |
| Wir unterstützen selbstorganisierte Kulturveranstaltungen bei Licht, Klang, Aufbau und Betrieb — passend zu Raum, Idee und vorhandenen Mitteln. | We support self-organized cultural events with lighting, sound, setup, and operation — adapted to the space, idea, and available resources. |
| Technik gemeinsam bauen | Build technology together |
| In unserer Technikwerkstatt entwickeln und reparieren wir LED-Lösungen und Elektrotechnik für temporäre Kulturräume. | In our technical workshop, we develop and repair LED systems and electrical equipment for temporary cultural spaces. |
| Wissen offen weitergeben | Share knowledge openly |
| In How-tos und gemeinsamen Werkstattterminen zeigen wir, wie die Technik funktioniert — zum Verstehen, Nachbauen und Weiterentwickeln. | Through how-tos and collaborative workshop sessions, we show how the technology works — so it can be understood, recreated, and developed further. |
| Du brauchst Support bei deinem Event oder hast eine Idee? | Need support for your event or have an idea? |
| E-Mail schreiben ↗ | Write an email ↗ |
| Verein zur Förderung der Hör- und Sichtbarkeit von Kulturveranstaltungen | Association supporting the audibility and visibility of cultural events |
| Adresse | Address |
| Direkt | Direct contact |
| Nach oben ↑ | Back to top ↑ |

### English gallery vocabulary

| German | English |
| --- | --- |
| Alle | All |
| Innenraum | Indoor |
| Open Air | Open air |
| Installation | Installation |
| Laser | Laser |
| Technik | Technology |
| Lichtkunst | Light art |
| Aufbau | Setup |
| Veranstaltungen 2024 | Events 2024 |
| Veranstaltungen 2023 | Events 2023 |
| Weitere Veranstaltungen | More events |
| Bild / Bilder | image / images |
| Öffnen | Open |

### English gallery alternative text

1. Green laser beams cross an indoor venue.
2. Mobile control unit on a workbench.
3. Stage lit in violet at Holzrock 2024.
4. Red light ring with a mirror ball beneath a wooden roof.
5. Green laser fans above an audience in a club.
6. Red-and-blue-lit installation in an event space.
7. Turquoise laser lines behind a silhouette at the mixing desk.
8. Yellow light projection in a vaulted room.
9. White beams of light in front of a projection screen.
10. Red light objects and trusses beneath a marquee roof.
11. Geometric light objects above a dance floor.
12. Lighting control setup in red fog.
13. Red luminous objects and projections above a dance floor.
14. Colorful lighting among trees in an outdoor space.
15. Forest lit in violet and red at night.
16. Event space lit in green.
17. Green laser beams in the haze of a club.
18. Wooden structure lit in blue outdoors.
19. Violet light bars in an event space.
20. Beams of light above an outdoor venue at night.

## Error handling

- Invalid stored values are ignored.
- Storage read/write failures do not stop language switching for the current
  page.
- Missing catalog keys fall back to German.
- An unsupported language passed to the controller normalizes to the current
  language instead of corrupting document state.
- The anti-flash class always has a timed removal fallback.

## Tests and browser verification

Node tests verify:

- language normalization and resolution;
- stored choice precedence and storage failure handling;
- German SEO markup before JavaScript;
- both catalog languages contain every static key;
- every translatable DOM key exists in both languages;
- all 20 images retain German metadata and gain English event and alt values;
- every German tag has an English label;
- existing hero, gallery, asset, and deployment contracts still pass.

Browser verification covers:

- German and English system-language defaults with empty storage;
- stored choice overriding system language;
- switching in both directions without reload;
- persistence after reload;
- title, description, `<html lang>`, static copy, ARIA, mail subject, filters,
  counts, event headings, alt text, and lightbox captions;
- desktop and 390/320 px layouts with no horizontal overflow;
- no console errors or failed asset requests.

## Branch constraint

All work remains on the current `v3` branch. The implementation does not
checkout, merge into, or modify `main`.
