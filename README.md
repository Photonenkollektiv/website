# Photonenkollektiv website

Static v3 website for photonenkollektiv.de.

## Local preview

```bash
python3 -m http.server 4173 -d public
```

Open http://localhost:4173.

## Tests

```bash
npm test
```

## Deployment

Vercel serves `public/` directly. Pushes deploy according to the connected
Vercel project's Git settings.
