# JARVIS website — design spec

Date: 2026-10-28 · Status: awaiting review · Repo: `MohammedMoataz/jarvis-website` (private, to be created)
Prior art this copies on purpose: `MohammedMoataz/ai-coach-website` (same stack, same deploy and
rebuild loop). Product facts come from the JARVIS Feature Atlas
(https://claude.ai/artifact/LMDjvgHaXtkGxM99zU2crc), a scan of JARVIS `main` at v1.10.0.

## 1. Intent

**Outcome.** Someone from the owner's network opens the site, leaves believing *they can have their
own second brain in a digital shape*, and has the phone app and the Chrome extension in hand,
plus the address of the owner's JARVIS server to sign up on.

**Audience.** People in the owner's network who receive the link from the owner: software
engineers and non-technical people alike. Every page must work for both: plain language first,
with technical depth available but never in the way.

**Vision and mission, as the product states them** (`CLAUDE.md`, constitution):
- JARVIS is a private, local-first second brain: *capture everything, recall it with sources, act
  on it.*
- Principle I: what you capture is stored before anything else happens; answers cite your own
  sources, and "not in your library" is a valid answer.
- Principle III: AI runs locally (Ollama on the owner's machine), never a cloud model.
- House rule for the site, taken from the constitution's "test then verify": **no claim the product
  does not back.** No invented numbers, no testimonials, no features that are not shipped. Things
  that exist only partly are described as they are.

### What the user decided (2026-10-28)
| Topic | Decision |
|---|---|
| Name | JARVIS, kept. The constitution says anything *published publicly* must use another name (`.specify/memory/constitution.md:234-235`); the owner reads a private repo plus a non-commercial site shared by link with their own network as within that rule, and keeps search engines out (`noindex`). |
| Visibility | Repo private. Site deployed on Vercel; anyone holding the link can open it. |
| Audience | The owner's network (engineers and non-technical people), reached by a link the owner shares |
| Goal | Visitors believe they can have their own digital second brain, then download |
| Call to action | Download the APK and the Chrome extension zip |
| Server address | The site shows the current quick-tunnel address of the owner's JARVIS next to the downloads |
| Stack | Next.js with PrimeReact, animations, modern styling (as ai-coach-website) |
| Repos linked | Same pattern as ai-coach ↔ ai-coach-website: JARVIS notifies the site, the site rebuilds |
| Downloads | Release files stay in the private JARVIS repo; the site links to the latest release's APK and zip |

### Facts the copy must respect (checked 2026-10-28)
- **Data is not on the owner's PC.** The live install uses hosted stores (Neon Postgres, MongoDB
  Atlas, a private Supabase bucket). The AI runs on the owner's PC. Say "AI runs on the owner's
  machine" and "your data lives in databases only this JARVIS uses"; never "your data never
  leaves the house".
- **The owner can see what members saved.** JARVIS has an audited, read-only "member libraries"
  view; every view is listed to the member in the extension's Library tab ("who accessed my
  library"; the phone has no such screen). Spec 005 asks that members are told. The site says it
  plainly in the privacy section.
- **JARVIS runs on the owner's PC.** It is reachable only while that PC and its tunnel are up.
- **The server is fixed at sign-in.** Phone Settings shows it read-only
  (`apps/mobile/lib/features/settings.dart:59-61`); changing it means signing out, and sign-out
  wipes local data including unsynced captures (`apps/mobile/lib/data/db.dart:83`,
  `apps/extension/src/core/storage.ts:40`).
- **Assistant connections and the desktop agent** are not self-serve for a visitor: connections have
  no member screen, and the desktop agent is a file in the private repo, not a release asset.
- **Google sign-in is in Testing mode** (only Google test users the owner adds can use it). The
  get-started steps lead with email or username plus password; Google is mentioned as "if the
  owner added you".
- **Android only.** There is no iOS app. The APK is side-loaded (unknown sources).
- **The extension is not in the Chrome Web Store.** It installs as an unpacked folder in developer
  mode. Its ID is pinned by the manifest key (v1.10.0), so it stays the same wherever it is loaded.
  Its default server is `http://localhost:8088`, so the visitor types the address the site shows.
- **Voice** works only as push-to-talk in the extension, and only when the owner runs the speech
  service (off by default). Present it as "voice in the extension, when enabled", or not at all.
- **No push notifications** for a closed app: the phone rings alerts it took at its last sync.
  Avoid wording like "JARVIS pings you anywhere".
- **Training** has slots, programs, logs and library suggestions, but no progression or load
  tracking. **Nutrition** has a meal line and an allergen guard, no calories by design.

### Goals
1. A first screen that makes the idea land in one line and one picture, for a non-engineer.
2. Every member-facing capability shown once, in plain words, grouped the way a person thinks
   about their life, not the way the code is split.
3. A get-started path a non-engineer can follow alone: download, install, paste the address,
   register, first capture.
4. A "how it works" page that earns an engineer's respect: architecture, privacy model, local AI,
   offline sync, with real names from the code.
5. Downloads and the server address are always current without the owner touching the site.

### Non-goals (YAGNI)
Blog, changelog page, docs search, newsletter, contact form, analytics, cookie banner, comments,
pricing, custom domain, a hosted demo, an iOS story, accounts on the site itself.

### Anti-goals (fail even if it works)
- Promising a feature JARVIS does not have, or hiding a real limit the visitor will hit.
- Leaking anything private: a token in client code, a private repo URL that 404s for visitors, the
  owner's admin details, anything from `docs/` credential files.
- Looking like a generic AI SaaS template (gradient blobs, stock "AI brain" art, emoji headings).
- A get-started flow that needs the owner on the phone to explain it.
- Search engines indexing it (the trademark rule): the site is shared by link, not discovered.

## 2. Site map and content

Three pages. Marketing copy is hand-written in `content/copy.ts`; release data is fetched at build.

### `/` landing
1. **Nav** — wordmark (ring + "JARVIS"), links: Features (anchor), How it works, Get started; theme
   toggle.
2. **Hero** — headline in the spirit of *"Your second brain. Say it once, find it forever."*
   (final wording is the builder's, inside the rules above); one sub-line: capture anything, it
   files itself, ask and get answers that cite your own notes. Primary button "Get JARVIS" →
   `/get-started`; secondary "How it works". Visual: the arc ring (token motif, slow 40 s turn)
   with a short looping scene: a typed line ("remind me to call mum at six") becomes a task card
   with "18:00" while a saved link becomes a library card.
3. **Say it once** — one capture box everywhere: phone capture sheet, Android share sheet, the
   extension (right-click a page or a selection, keyboard shortcut), photos (text read from the
   image), chat. JARVIS decides task / note / link / weight / question and files it; the member
   can confirm in the weekly review. Kept first, even offline or with the AI down.
4. **Ask your own library** — answers cite numbered sources (`[1]`, `[2]`) from the member's own
   notes, tasks, links, documents and video transcripts (with a jump to the second); when nothing
   matches, it says "Not in your library." Works in Arabic and English.
5. **Read it later, actually** — saved articles, YouTube videos with captions and chapters,
   whole playlists and site sections read in the background; summaries with key points; a
   summary never invents a number.
6. **Your day, on your clock** — tasks with labels, repeats and a 30-day bin; reminders with
   snooze; meetings with repeats and skip-one; one notification per alert even with several
   devices; evening plan for tomorrow, end-of-day check-in, morning briefing, weekly review — at
   the member's own times, in their own time zone, across clock changes.
7. **Body and habits** — weekly training slots that keep two weeks scheduled, programs, session
   logs, suggestions from the member's library; a daily meal line that never shows a declared
   allergen (and never counts calories).
8. **Works offline** — the phone keeps notes, tasks and links on the device and syncs when it
   can; the extension keeps what you type until it is sent.
9. **Private by design** — local AI on the owner's PC; JARVIS's own databases; no member can
   reach another's data; the owner's oversight is read-only, audited and listed to you; sessions
   end within seconds when revoked. (Honest wording per §1 facts.)
10. **Bring your other assistants** (short, engineer-flavoured) — MCP connections let Claude or
    another assistant search your library, see open tasks, drop captures and *propose* changes
    that wait for your Yes; a desktop agent captures from the clipboard. Ends with "ask the owner
    to set one up" (builder's call, §6: not self-serve, no download).
11. **Get it** strip — the download card (see below) repeated, then the final line.
12. **Footer** — "Private, non-commercial project", JARVIS version from the latest release, link to
    Get started. No repo links (private).

### `/get-started`
- **Download card** (shared component): two buttons, "Android app (APK) · 66 MB" and "Chrome
  extension (zip) · <size>", each labelled with the release version and date; the server address
  in a copy-to-clipboard field with "Paste this when JARVIS asks for a server". If no address is
  published, the field says "Ask the owner for the server address" instead of showing a stale one.
  A live status dot ("JARVIS is online" / "offline right now, try later") comes from the site's own
  `GET /api/status`, which checks `<server>/health` server-side with a 5 s timeout and a 60 s cache
  (no CORS needed, no backend change). Builder's call, §6.
- **Phone, step by step**: download → allow installs from this source → open → paste the server
  address → create an account (email or username + password) → onboarding (about you, your day,
  training) → first capture with the centre button.
- **Chrome extension, step by step**: download → unzip to a folder you keep → `chrome://extensions`
  → Developer mode → Load unpacked → pin it → open the side panel → paste the server address
  (Chrome asks for access to that address once) → sign in with the same account.
- **Google sign-in** note per §1. **iPhone**: "not available".
- **Troubleshooting**: JARVIS offline (the owner's PC is off: try later), "can't register"
  (registration closed: ask the owner), Android blocks the install, address changed (behaviour
  depends on the open decision in §7).
- **Updating**: install the new APK over the old one; load the new unzipped extension folder over
  the old one (`chrome://extensions` → reload). An APK signed with a different key will not
  install over the old one; releases are built and signed on the owner's PC only (builder's call,
  §6, recorded as a release rule).

### `/how-it-works`
For engineers, in this order: the loop (capture → classify → file → index → recall → act); the
architecture (clients → one nginx edge → backend, worker and backup roles → 19 bounded contexts →
stores and local services) drawn as a diagram; the patterns (vertical slices, transactional
outbox, CQRS over REST/GraphQL/one socket, ports and published commands, model work off the
event path); local AI (Ollama, `qwen2.5:3b-instruct`, `embeddinggemma`, grammar-constrained
extraction, the model never decides times); offline sync (push/pull, stale vs invalid); privacy
model; the stack list. Facts are taken from the Feature Atlas; no number appears that the atlas
does not carry.

### SEO and sharing
`robots.ts` disallows everything and every page sets `noindex` (anti-goal: indexing). Open Graph
image and title still exist, so a shared link previews well in chat apps.

## 3. Architecture and data flow

**Stack** (as ai-coach-website): Next.js 16.4 App Router, React 19, TypeScript, npm, Node 24.
Runtime deps: `primereact` 10.9.9, `primeicons`, and `motion` only for the hero scene. Section
reveals use CSS scroll-driven animations (ai-coach-website `components/Reveal.tsx` pattern).
Nothing else without a reason.

**`lib/release.ts`** — build time. Parsing and validation live in a pure module
(`lib/release-parse.mjs`, tested by `node --test`); the fetching wrapper imports `server-only`
(a runtime dependency, alongside `primereact`/`primeicons`/`motion`). The pure module is what the
tests import, so they never load `server-only`.
1. `GET api.github.com/repos/MohammedMoataz/JARVIS/releases/latest` with
   `Authorization: Bearer $JARVIS_RELEASES_TOKEN`.
2. Pick assets by name: `jarvis-<version>.apk` and `jarvis-extension-<version>-chrome.zip`
   (release naming in JARVIS `CLAUDE.md`).
3. Return `{ version, publishedAt, apk: {id, name, size}, extension: {id, name, size} }`.
4. **Fails the build** on non-2xx, a missing asset or an unexpected name: Vercel keeps the last
   good deploy live.

**Download routes** — `app/download/[kind]/route.ts`, `kind` ∈ `apk | extension`, Node runtime,
`dynamic = 'force-dynamic'`.
1. Look up the asset id from `lib/release.ts` data baked at build.
2. `GET api.github.com/repos/MohammedMoataz/JARVIS/releases/assets/<id>` with
   `Accept: application/octet-stream`, the token, `redirect: 'manual'`, and a 10 s timeout.
3. Answer `302` to the `Location` GitHub returns (a short-lived signed URL). Any failure answers a
   small page "Download unavailable right now, try again or ask the owner" with status 503.
4. The token exists only in the Vercel project's environment and in Actions secrets; it never
   reaches client code, and no private `github.com/.../JARVIS` URL is ever rendered.

**Server address** — read at build from env `JARVIS_SERVER_URL` (empty allowed). Accepted only if
it matches `^https://[a-z0-9-]+\.trycloudflare\.com$`; anything else is treated as empty. The deploy
workflow passes the GitHub repository variable `JARVIS_SERVER_URL` into `vercel build`.

**Rebuild loop** (same shape as ai-coach):
- **Site** `.github/workflows/deploy.yml` — on push to `main`, `workflow_dispatch`, and
  `repository_dispatch` types `jarvis-released` and `jarvis-tunnel`. Gate job skips (summary line,
  no failure) until `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` exist. Deploy job: `npm ci`,
  lint, typecheck, test, `vercel pull --environment=production`, `vercel build --prod`,
  `vercel deploy --prebuilt --prod`, with `JARVIS_RELEASES_TOKEN` and `JARVIS_SERVER_URL` in the
  build env. `concurrency: deploy, cancel-in-progress`.
- **Site** `.github/workflows/ci.yml` — on PR: lint, typecheck, test, `next build` (with a fixture
  release when the token is absent, so PRs from the PC work without secrets).
- **JARVIS** `.github/workflows/notify-site.yml` — `on: release: types: [published]` and
  `workflow_dispatch`; sends `jarvis-released` to `MohammedMoataz/jarvis-website` with secret
  `SITE_DISPATCH_TOKEN`; skips with a summary line when the secret is absent.
- **JARVIS** `scripts/publish-tunnel.mjs` — run after the quick tunnel starts (by hand, or from
  `scripts/up.mjs` when the `quick` profile is on: builder's call). Reads
  `docker compose -f infra/compose.yaml --env-file infra/.env logs cloudflared-quick`, takes the
  last `https://*.trycloudflare.com`, validates it with the same pattern, waits until
  `GET <url>/health` answers (timeout), then `gh variable set JARVIS_SERVER_URL -R
  MohammedMoataz/jarvis-website` and `gh api repos/MohammedMoataz/jarvis-website/dispatches -f
  event_type=jarvis-tunnel`. Runs from PowerShell or bash (Node, no shell-specific code). Every
  child process has a timeout.
- Vercel Deploy Hooks are not used (the project is CLI-deployed, as ai-coach-website).

**Secrets the owner creates.**
| Where | Name | What |
|---|---|---|
| jarvis-website Actions | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | from `vercel login` + `vercel link` |
| jarvis-website Actions + Vercel env (production) | `JARVIS_RELEASES_TOKEN` | fine-grained PAT, JARVIS repo only, Contents: read |
| JARVIS Actions | `SITE_DISPATCH_TOKEN` | fine-grained PAT, jarvis-website only, Contents: write (dispatch) |
| Owner's PC (`gh auth`) | — | `gh` must be allowed to set variables and dispatch on jarvis-website |

## 4. Visual system and motion

- **Tokens.** Copied once from JARVIS `packages/tokens/tokens.json` into `app/tokens.css`:
  void / hull / trace grounds, **arc** (`#3CD6F2` dark, `#0A86A6` light) as the only brand colour,
  **gold** reserved for recall and records (citations, the library), amber for attention, text and
  muted. Radii 4/8/16, spacing 4–48. Dark is the default look; light follows the system or the
  toggle. PrimeReact's Lara theme is made to read the same variables the way ai-coach-website
  does: its `scripts/themes.mjs` generates `app/lara.css` before every build by mapping Lara's
  hard-coded hex values onto brand variables and keeping only the components the site uses. Copy
  that script and redo its colour table for arc: one palette.
- **Fonts.** Chakra Petch (display, used sparingly), IBM Plex Sans + IBM Plex Sans Arabic (body),
  IBM Plex Mono (data, chips), self-hosted with `next/font`.
- **Motif.** The arc ring from the JARVIS apps (`motion.ringTurnMs` 40 s). Thin "trace" lines that
  connect a capture to where it was filed. Real JARVIS vocabulary on screen (PARA places, `[1]`
  citations, "Not in your library.", 18:00 in the member's zone).
- **Assets.** `assets/logo.svg` from JARVIS copied into `public/`. Screens: drawn as styled
  HTML/SVG mock cards, not phone screenshots (no screenshots exist in the repo; builder may add
  real ones later).
- **Theme.** Dark + light; blocking inline script sets `data-theme` before paint; toggle saved in
  `localStorage` inside try/catch (ai-coach-website `app/layout.tsx`).
- **Motion.** Hero scene (capture line types, splits into a task card and a library card, ring
  turns); section reveal via CSS scroll-driven animation; feature cards lift on hover; the copy
  button confirms with a check. `MotionConfig reducedMotion="user"` plus CSS
  `prefers-reduced-motion`: everything collapses to its resting state. Nothing is hidden at rest.

## 5. Errors, testing, verification, delivery

**Errors.** Build-time release fetch fails closed. Download routes never throw to the visitor and
never echo GitHub's error text. Copy and release strings render as React text only, never
`dangerouslySetInnerHTML` (except the fixed theme script).

**Tests** (`node --test lib/*.test.mjs`, as ai-coach-website): release parsing picks the right
assets and throws on a missing one; the server-address pattern accepts a trycloudflare URL and
refuses `http://`, other hosts, paths and credentials; the download route answers 302 with the
signed URL and 503 on a GitHub failure (fetch stubbed). In JARVIS: `publish-tunnel` parsing of a
sample log (last URL wins; no URL → exits non-zero with a clear message).

**Verification before "done"** (each with its output shown): Lighthouse ≥ 90 for Performance,
Accessibility and Best Practices on the production URL; for SEO, every audit passes except
`is-crawlable`, which fails by design (`noindex`) and caps the score near 70; WCAG AA contrast in both
themes; keyboard walk-through; reduced-motion pass; no horizontal scroll at 360 px; a real APK and
zip download through the production routes; a real `publish-tunnel` run changing the address on
the live site; `view-source` and the built JS contain no token and no `github.com/MohammedMoataz/JARVIS`.

**Delivery (PRs on jarvis-website, in order).**
1. Create the private repo; scaffold Next.js, PrimeReact theme, tokens, fonts, nav, footer, theme
   toggle, CI.
2. `lib/release.ts`, download routes, server-address handling, tests.
3. Landing sections and the hero scene.
4. `/get-started` and `/how-it-works`.
5. Open Graph image, `noindex`, Lighthouse fixes.
6. Vercel link and first production deploy (owner runs `vercel login`), then `deploy.yml`.

**In JARVIS** (separate change, following JARVIS's own rules: its own numbered branch, Node `.mjs`
only, LF, the name guard, checks run on the PC before merge): `notify-site.yml` and
`scripts/publish-tunnel.mjs`, plus a line in `CLAUDE.md` Commands.

## 6. Left to the builder
Exact headline and section copy (inside §1's rules); hero scene choreography; component split;
whether `publish-tunnel` is also called by `up.mjs`; how `/how-it-works` draws its diagram (SVG or
HTML, zoomable on phones); OG image design.

**Calls made while writing this (the owner may overrule):**
- Assistant connections and the desktop agent are shown, with "ask the owner"; no third download.
- Live online/offline status through the site's own `/api/status` health check.
- Update instructions on `/get-started`; releases are signed on the owner's PC only, so an APK
  update installs over the old one.
- `noindex` everywhere; Lighthouse SEO judged without `is-crawlable`.

## 7. Open decisions (owner)

Status 2026-10-28: the owner approved the design ("let's execute the plan") without answering these.
Built with defaults until the owner says otherwise: **quick tunnel** with `publish-tunnel.mjs`
(the site warns that a changed address means signing out after syncing); **English only**;
**registration stays open**.

- **Quick tunnel or a fixed address.** A quick tunnel's address changes on every restart, and a
  signed-in phone or extension cannot switch servers without signing out (which wipes unsynced
  data). A named Cloudflare tunnel (`tunnel` profile, `TUNNEL_TOKEN`) keeps one hostname, which
  removes `publish-tunnel.mjs`, the `jarvis-tunnel` dispatch and the trycloudflare pattern.
- **Languages.** English only, or English and Arabic (locale routes, RTL, two copies of the text).
- **Open registration.** The site shows the server address to anyone holding the site link, and
  `auth.registrationOpen` is on, so anyone with the link can create an account on the owner's
  JARVIS. Accept as is, or close registration and hand out accounts another way.
