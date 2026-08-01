# Gallery Preview Fixes Design

## Goal

Correct four presentation defects in the v3 static gallery without changing
its overall visual direction or deployment architecture:

- portrait media must be fully visible in the lightbox;
- every Unicode gallery URL must resolve on Vercel's Linux filesystem;
- the 2026 event must display its corrected name, `Vauyage to space 2026`;
- social link previews must use `Kultur wird sichtbar` instead of
  `dokumentarische Bilder`.

All work remains on `v3`; `main` is not changed or merged.

## Lightbox layout

The clipping is caused by the image element's own grid sizing, not by
`object-fit`. At the reported desktop viewport, the portrait image creates a
1,971-pixel-tall element inside an 885-pixel-tall stage. The dialog hides the
overflow, leaving only part of the image visible.

The lightbox stage remains the fixed containing block. Its image and video
elements are positioned absolutely at `inset: 0`, with both dimensions set to
the stage and `object-fit: contain`. This makes the media element's box equal
to the available stage before its content is fitted. Portrait, landscape, and
video media therefore share the same containment behavior. The close button
remains above the media and the caption/navigation bar keeps its existing
layout.

## Cross-platform media URLs

The manifest currently contains decomposed Unicode paths such as
`Su` plus a combining umlaut, while Git stores the deployed folder as composed
`Südhof`. APFS resolves both forms locally, but Vercel's Linux filesystem
requires the exact byte representation. The same defect is present in the
`Realitätärätätä` paths.

All manifest `src` and `poster` values are stored in Unicode NFC form so they
match the paths in Git. Folder names remain readable and are not renamed. A
regression test rejects any non-NFC media URL and checks each normalized path
against the repository tree, preventing macOS filesystem normalization from
hiding the error again.

## Event naming

The six records currently grouped as `Studi Sommerfest 2026` display
`Vauyage to space 2026` in German and English. Their descriptive German and
English alt text is updated where it mentions the old event name. The internal
folder remains `images/2026/Studi Sommerfest/` because it is not user-facing
and changing it is unnecessary for correctness.

## Social and SEO metadata

German remains literal in the delivered HTML for crawlers and no-JavaScript
clients. The default metadata becomes:

- social title: `Photonenkollektiv — Kultur wird sichtbar`;
- description: `Photonenkollektiv – Freiburger Verein für die Hör- und
  Sichtbarkeit von Kulturveranstaltungen. Licht, Klang. Kultur wird sichtbar.`

The English runtime translations are:

- social title: `Photonenkollektiv — Making culture visible`;
- description: `Photonenkollektiv – Freiburg-based association supporting the
  visibility and audibility of cultural events. Light, sound. Making culture
  visible.`

Explicit Open Graph title, description, type, and German locale metadata are
added so WhatsApp and Signal do not depend on fallback heuristics. The regular
description and its German/English translation entries are updated as well.
The client-side language controller may replace translatable metadata for an
English-language visitor, while the source markup stays German by default.

## Test and verification strategy

Tests are added before implementation and must initially fail for the reported
defects. They cover:

- the lightbox media containment contract;
- NFC-normalized media URLs that exactly match Git tree paths;
- the corrected event label and removal of the obsolete label from visible
  gallery metadata;
- German default and English translated social/description strings.

After the tests pass, the full dependency-free suite is run. A real Chrome
check at the reported desktop size verifies that the portrait image's rendered
box does not exceed the stage, then checks a landscape image, a video, the
Südhof requests, lightbox navigation, and mobile overflow. Console and network
errors must remain empty.
