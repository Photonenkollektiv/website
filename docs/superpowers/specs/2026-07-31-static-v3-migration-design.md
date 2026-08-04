# Static v3 Website Migration Design

## Goal

Replace the existing Next.js website with the completed v3 static website while preserving all legacy image and video URLs and configuring Vercel to serve the static output directly.

## Source of truth

The Open Design project at:

`/Users/alex/Library/Application Support/Open Design/namespaces/release-stable/data/projects/609c79da-0474-4be7-a2c9-6bd190fb5273`

contains two HTML artifacts. Its artifact metadata marks `photonenkollektiv-nachtarchiv.html` as the primary completed artifact, and the supplied test suite targets that file. It is therefore the migration source.

The artifact is copied without content or interaction redesign. Its inline
JavaScript remains intact. Deployment hardening adds:

- `<link rel="icon" href="logo.svg" type="image/svg+xml">`, which prevents the
  browser's implicit `/favicon.ico` request from failing after the Next.js
  favicon is removed;
- two rules below 390 px that prevent long German gallery headings and the
  statement display type from widening the page.

## Static architecture

Vercel will serve `public/` as the deployment output:

- `public/index.html` contains the primary v3 HTML artifact plus the
  deployment-only favicon and narrow-mobile overflow fixes.
- `public/logo.svg` is the v3 root logo referenced by the HTML.
- `public/assets/` contains all assets delivered with the v3 artifact.
- `public/images/` and `public/videos/` remain in place and keep their existing public URLs.

This layout exposes the v3 website at `/` while retaining every legacy `/images/*` and `/videos/*` URL. It also prevents repository-only files such as tests and documentation from becoming public deployment output.

## Removed website implementation

The current framework application and its generated scaffold assets are removed:

- `src/`
- `.eslintrc.json`
- `next.config.js`
- `tsconfig.json`
- `package-lock.json`
- `public/next.svg`
- `public/vercel.svg`

`package.json` remains only as a dependency-free test command. It contains no Next.js, React, gallery, modal, ESLint, or TypeScript dependencies.

## Vercel configuration

`vercel.json` declares:

- the current Vercel configuration schema;
- `public` as `outputDirectory`;
- `cleanUrls: true`.

There is no application build step or server runtime. Vercel serves the committed files in `public/` as a framework-free static site.

## Preserved legacy assets

Every existing file below these directories remains byte-for-byte unchanged:

- `public/images/`
- `public/videos/`

This includes files not used by the v3 homepage, such as the two currently omitted event photographs, both star backgrounds, old logo variants, and all three video encodings.

The v3 asset collection is stored separately under `public/assets/`. Some photographs intentionally duplicate legacy media because the completed HTML uses its own stable filenames.

## Tests and verification

The supplied v3 tests are migrated to run against `public/index.html` and `public/assets/`. They verify:

- all 20 gallery entries exist and retain metadata;
- gallery rendering is driven by embedded JSON;
- the initial hero image and shuffled rotation contract;
- the absence of a separate hero logo panel.

A repository-level static deployment test additionally verifies:

- `public/index.html`, the v3 logo, and every local HTML asset reference exist;
- the homepage declares the supplied v3 logo as its favicon;
- every legacy image and video path remains present;
- Vercel points to `public/`;
- removed Next.js application files no longer exist;
- `package.json` has no runtime or development dependencies.

Final verification runs the complete Node test suite, compares legacy asset
hashes captured before and after migration, serves `public/` locally, and
checks the page at desktop and mobile widths. The browser pass covers
navigation, tag filters, lightbox behavior, the mobile menu, console errors,
network failures, reduced-motion behavior, and horizontal overflow at both
390 px and the 320 px minimum width.

## Branch constraint

All work remains on the current `v3` branch. The migration does not checkout, merge into, or otherwise modify `main`.
