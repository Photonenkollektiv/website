# Photonenkollektiv – Next.js Website

This repository contains a modern, dark‑themed website for **Photonenkollektiv** built with
Next.js and TypeScript.  It combines the strongest ideas from previous design iterations
with a brand new colour palette based on the latest wireframes.

### Features

* **Hero section with neon glow** – the landing page features a parallax‑enabled
  glowing sphere inspired by the latest design sketch.  The headline uses the
  Akony font while the supporting copy is set in Inter.
* **Left/right aligned sections** – content blocks alternate alignment to
  create visual rhythm.  Each section includes a subtle gradient rail to guide
  the eye.
* **Gradient cards** – service offerings are presented in cards with
  magenta‑to‑cyan gradients and modern hover effects.  Card definitions live in
  a reusable component for easy maintenance.
* **Masonry gallery with lightbox** – images and videos are loaded
  responsively and can be enlarged via a modal.  The lightbox preserves focus
  and is accessible via keyboard.
* **Scroll reveal animations** – elements fade or slide into view as the user
  scrolls the page, respecting the user’s reduced motion preferences.
* **Parallax and modern interactions** – the hero’s glow subtly follows the
  cursor and sections have tiny parallax shifts to give depth without
  distracting from the content.

### Development

To start the development server run the following commands after installing
dependencies with `npm install` or `pnpm install`:

```bash
npm run dev
```

Tailwind CSS is configured out of the box.  Global styles live in
`src/app/globals.css` and can be customised via `tailwind.config.js`.

### Deployment

The project uses the Next.js app router (app directory).  To build a
production version run:

```bash
npm run build
```

The output can be served using `npm run start` or deployed on platforms like
Vercel.