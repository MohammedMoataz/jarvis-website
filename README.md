# JARVIS website

The landing page for [JARVIS](https://live-jarvis.vercel.app), a private second brain:
what it does, how it works, and the downloads for the latest Android app and Chrome extension,
with the owner's server address and whether it is online.

Private repo, non-commercial, shared by link with the owner's network. Every page is `noindex`
and `robots.txt` disallows everything.

## Pages

| Route | What |
| --- | --- |
| `/` | Hero, features, download card |
| `/get-started` | Install steps for the phone app and the extension, download card |
| `/how-it-works` | Architecture diagram and the path of a capture |
| `/download/apk`, `/download/extension` | Redirect to the latest release asset (GitHub's short-lived link) |
| `/api/status` | `{"status": "online" \| "offline" \| "unknown"}` for the owner's server, cached a minute |

## How it stays current

Nothing has to trigger a deploy:

- **Release**: the site reads the latest JARVIS release every 5 minutes and takes the
  `jarvis-<version>.apk` and `jarvis-extension-<version>-chrome.zip` assets from it.
- **Server address**: JARVIS `node scripts/publish-tunnel.mjs` stores the quick tunnel address in
  the JARVIS repository variable `JARVIS_SERVER_URL`; the site reads it every minute and accepts
  only a bare `https://*.trycloudflare.com` origin.
- Pages re-render at most once a minute.

After a release, open the site's Vercel runtime logs once: a release the site cannot read (other
asset names, a missing file) leaves the pages on the last good version and the downloads on the
"unavailable" page, and the only trace is an error there.

Both reads use one Vercel environment variable, `JARVIS_RELEASES_TOKEN`: a fine-grained token on
the JARVIS repo only, with Contents read and Variables read. It stays on the server; no page or
script carries it or a link to the private repo.

## Run

```sh
npm ci
JARVIS_RELEASE_FIXTURE=1 npm run dev   # no token needed: uses lib/release.fixture.json
npm test                               # node --test, no browser
npm run lint
npm run typecheck
```

`JARVIS_SERVER_URL=https://<name>.trycloudflare.com` shows an address locally.

## Deploy

Vercel's Git integration builds every push to `main`; `vercel.json` runs lint, typecheck and tests
before `next build`, so a failing check never reaches production. No GitHub Actions.

## Stack

Next.js 16 (App Router), React 19, PrimeReact 10 with the Lara theme recoloured onto
`app/tokens.css` by `scripts/themes.mjs`, CSS animations, dark by default with a light theme.
Fonts: Chakra Petch, IBM Plex Sans, IBM Plex Mono.

Design and plan: `docs/superpowers/specs/2026-10-28-jarvis-website-design.md`,
`docs/superpowers/plans/2026-10-28-jarvis-website.md`.
