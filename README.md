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
deployed by Vercel's Git integration on every push to `main` (`vercel.json` runs lint, typecheck and
tests before the build). No GitHub Actions: the private repo has no Actions minutes.

The site re-reads the latest JARVIS release every 5 minutes and the server address (the JARVIS
repository variable `JARVIS_SERVER_URL`, set by JARVIS `scripts/publish-tunnel.mjs`) every minute,
so neither needs a deploy. Both use the Vercel env `JARVIS_RELEASES_TOKEN`: a fine-grained token on
JARVIS only, Contents read and Variables read.
