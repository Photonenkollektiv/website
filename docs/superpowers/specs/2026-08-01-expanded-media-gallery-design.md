# Expanded Media Gallery Design

## Goal

Replace the 20-item portfolio manifest with the complete, year-organized media
archive: 69 still images and six videos across 18 event groups. The gallery
must remain bilingual, filterable, keyboard-accessible, fast to load, and
ordered from the newest event to the oldest.

## Content model and ordering

Each gallery record has a stable `type` (`image` or `video`), optimized `src`,
numeric `year`, ISO `eventDate`, German and English event labels, German and
English descriptions, tags, and `visible`. Video records additionally have a
WebP `poster` and numeric `duration`.

Event groups sort by:

1. year descending;
2. named events before the year's `Divers` group;
3. `eventDate` descending within the year;
4. event label as a deterministic fallback.

The resulting named-event order is:

- 2026: Studi Sommerfest, Feel Free, Realitätärätätä
- 2025: R42, Proseccival, Findus Anglerheim, Vaulymp, Schmecktgarten, Südhof,
  then Divers
- 2024: Blackwood Filmfestival, Proseccival, Kirnhalden, Südhof, Steinregen,
  then Divers
- 2023: Keller DJ Set, then Divers

The existing stable German tag keys remain unchanged: `Innenraum`, `Open Air`,
`Installation`, `Laser`, `Technik`, `Lichtkunst`, and `Aufbau`. Each item gets
one or more visually verified tags and original German and English descriptive
text. Proper event names remain proper names in English; `Divers` is displayed
as `Miscellaneous` in English.

## Image pipeline

Every gallery still is delivered as WebP. JPG and JPEG sources are
auto-oriented, resized only when their longest edge exceeds 2400 pixels,
stripped of metadata, and encoded at quality 82. Existing WebP sources go
through the same maximum-dimension and quality policy so large files are not
left unoptimized. The converted JPG/JPEG originals are removed from the public
deployment after output verification.

## Video pipeline

The six MOV files are transcoded to MP4 with H.264 video, AAC audio, a maximum
1920x1080 frame, 30 frames per second, CRF 24, `yuv420p`, and fast-start
metadata. Each clip receives a WebP poster selected from a representative
frame. The MOV originals are removed only after all MP4 files are probed and
their matching posters exist.

The gallery grid shows a quiet poster tile with a play glyph and duration,
using the current site's sharp-edged visual language. It does not autoplay.
Opening the tile uses the existing modal as a video player with native
controls and inline playback. Navigating away from a video or closing the
modal pauses it and resets its source. Videos participate in tag filtering but
do not enter the rotating hero image pool.

## Static architecture

`public/index.html` keeps the embedded JSON source of truth and renderer.
`public/gallery.js` contains small deterministic helpers for item typing,
event ordering, grouping, and time formatting; it supports both browser use
and dependency-free Node tests. The renderer uses those helpers and switches
the lightbox between its image and video surfaces.

## Compatibility and performance

All URLs listed in the existing legacy-asset test remain available. The
organized optimized gallery uses `public/images/<year>/<event>/...`; legacy
copies remain at their historical paths but are not duplicated in the gallery
manifest. Gallery images keep native lazy loading, videos use posters and
`preload="metadata"`, and the hero consumes only visible image records.

## Verification

The dependency-free Node suite verifies the 75-item manifest, 69/6 media-type
split, WebP image and poster paths, MP4 video paths, bilingual metadata, unique
sources, existing files, descending event grouping, `Divers` placement,
helper behavior, legacy URLs, and static Vercel configuration. FFprobe verifies
the generated video codecs, dimensions, frame rates, and fast-start-compatible
MP4 output. A local browser pass checks responsive tiles, filters, language
switching, image and video lightboxes, keyboard focus, playback cleanup, and
network/console errors.

## Branch constraint

All work stays on `v3`. Nothing is merged into or otherwise applied to `main`.
