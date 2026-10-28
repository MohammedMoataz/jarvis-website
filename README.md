# JARVIS website

The landing page for JARVIS, a private, local-first second brain. Private repo, non-commercial,
shared by link with the owner's network; every page is `noindex`.

- Design: `docs/superpowers/specs/2026-10-28-jarvis-website-design.md`
- Plan: `docs/superpowers/plans/2026-10-28-jarvis-website.md`

## Run

```sh
npm ci
JARVIS_RELEASE_FIXTURE=1 npm run dev   # no token needed: uses lib/release.fixture.json
npm test
```

Next.js 16 · PrimeReact 10.9.9 (Lara, recoloured by `scripts/themes.mjs` onto `app/tokens.css`) ·
deployed to Vercel by `.github/workflows/deploy.yml`.
