# JARVIS Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A private-repo, link-shared Next.js site on Vercel that makes people in the owner's network believe they can have their own digital second brain, and hands them the latest JARVIS APK, extension zip and server address.

**Architecture:** Static Next.js App Router pages built from hand-written copy plus build-time data (latest JARVIS release, current tunnel address). Two small server routes: `/download/[kind]` redirects to GitHub's signed asset URL using a server-only token, and `/api/status` checks the JARVIS `/health` server-side. JARVIS notifies the site on release and on tunnel start through `repository_dispatch`; the site's deploy workflow rebuilds through the Vercel CLI (the ai-coach ↔ ai-coach-website pattern).

**Tech Stack:** Next.js 16.4.0, React 19.3.0, TypeScript, PrimeReact 10.9.9 + primeicons 7.0.0, `server-only`, npm, Node 24, `node --test`, GitHub Actions, Vercel CLI.

**Spec:** `docs/superpowers/specs/2026-10-28-jarvis-website-design.md` (read it first; §1 "Facts the copy must respect" binds every page).

## Global Constraints

- Repo `MohammedMoataz/jarvis-website`, **private**. Local path `E:\Work\jarvis-website`. `git config user.email` = the owner's personal address.
- Exact versions: `next` 16.4.0, `react`/`react-dom` 19.3.0, `primereact` 10.9.9, `primeicons` 7.0.0, `eslint-config-next` 16.4.0. Runtime deps beyond these: `server-only` only. Animation is CSS (keyframes + scroll-driven `[data-reveal]`); add `motion` only if the hero scene cannot be done in CSS, and say why in the commit.
- English only. Three pages: `/`, `/get-started`, `/how-it-works`. No analytics, forms, cookies, blog, i18n.
- Every page `noindex, nofollow`; `robots.txt` disallows `/`.
- Tokens copied from JARVIS `packages/tokens/tokens.json`: arc `#3CD6F2` dark / `#0A86A6` light is the only brand colour; gold `#D9A441` / `#8E6510` only for recall and records; fonts Chakra Petch (display), IBM Plex Sans (body), IBM Plex Mono (data); ring turn 40 s. Dark is the default.
- Copy rules (spec §1): never claim data stays on the owner's PC (stores are hosted); say the AI runs on the owner's machine; no iOS; no push notifications; no calories; no training progression; voice only "in the extension, when enabled"; Google sign-in only "if the owner added you"; the owner's audited oversight is stated plainly.
- No token, no `github.com/MohammedMoataz/JARVIS` URL, and no value from any JARVIS `.env` file ever appears in rendered HTML or client JS.
- Server address accepted only if it matches `^https://[a-z0-9-]+\.trycloudflare\.com$`.
- Release assets are matched by `^jarvis-(\d+\.\d+\.\d+)\.apk$` and `^jarvis-extension-(\d+\.\d+\.\d+)-chrome\.zip$`; both must carry the release's version.
- Every outbound fetch has a timeout: GitHub asset 10 s, health 5 s, release metadata 15 s.
- `prefers-reduced-motion` collapses every animation to its resting state; nothing is hidden at rest.
- JARVIS-side changes follow JARVIS `CLAUDE.md`: numbered feature branch from the git extension, Node `.mjs` only, LF, never the predecessor platform's name (`git grep -n -i -I -e botvy -e "reference system" --untracked` returns rc=1 before every commit), checks run on the PC before merge.

## Review Focus

1. **PC off but address published**: the address still shows, with "JARVIS is offline right now"; downloads keep working. → Task 4 test `status: unreachable host is offline`.
2. **A forged or odd `JARVIS_SERVER_URL`** (`https://evil.com`, `http://x.trycloudflare.com`, `https://a.trycloudflare.com/path`, `https://u:p@a.trycloudflare.com`, `javascript:`): treated as no address. → Task 2 tests.
3. **GitHub slow, rate-limited or the asset deleted at click time**: visitor gets the 503 page, never GitHub's error text or a private URL. → Task 3 tests.
4. **A release published with the other naming** (`jarvis-android-1.11.0.apk` from `scripts/release/package.mjs`) or a draft without both files: build fails, last good deploy stays live. → Task 2 test `throws on unexpected asset names`.
5. **Clipboard refused** (in-app browsers, older WebViews): Copy falls back to selecting the address text and says "Press Ctrl+C". → Task 5 manual check step.

---

### Task 1: Scaffold the private repo, theme and shell

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `.gitignore`, `AGENTS.md`, `README.md`, `vercel.json` (copy shape from ai-coach-website; names changed)
- Create: `scripts/themes.mjs` (ai-coach-website's, colour table redone for arc), `app/tokens.css`, `app/globals.css`, `app/layout.tsx`, `app/robots.ts`, `app/page.tsx` (placeholder heading), `public/logo.svg` (from JARVIS `assets/logo.svg`)
- Create: `components/Providers.tsx`, `components/ThemeToggle.tsx` (as ai-coach-website), `components/Nav.tsx`, `components/Footer.tsx`, `components/Reveal.tsx`
- Create: `lib/site.ts`, `lib/site.test.mjs`
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: `pageMeta({ title?: string; description: string; path: string }): Metadata` (always includes `robots: { index: false, follow: false }`); `SITE_URL: string` from `NEXT_PUBLIC_SITE_URL`, default `https://jarvis-website.vercel.app`; `<Reveal>` wrapper; `<Footer version={string | null} />`; CSS tokens `--void --hull --trace --arc --gold --amber --text --muted --display --body --mono`.

- [ ] **Step 1: Create the repo and folder**

Run: `gh repo create MohammedMoataz/jarvis-website --private --description "JARVIS website and landing page (private, non-commercial)"`, then in `E:\Work\jarvis-website` (the spec already lives there): `git init -b main`, `git remote add origin https://github.com/MohammedMoataz/jarvis-website.git`, set `user.email`.
Expected: `gh repo view MohammedMoataz/jarvis-website --json visibility` prints `PRIVATE`.

- [ ] **Step 2: Write the failing test** `lib/site.test.mjs`

```js
test("every page is noindex", () => {
  const m = pageMeta({ description: "d", path: "/" });
  assert.deepEqual(m.robots, { index: false, follow: false });
});
test("titled pages name JARVIS", () => {
  assert.equal(pageMeta({ title: "Get started", description: "d", path: "/get-started" }).openGraph.title, "Get started · JARVIS");
});
```

- [ ] **Step 3: Run it** — `npm test` → FAIL (module missing).

- [ ] **Step 4: Implement** `lib/site.ts` (pure, no `@/` imports so Node can load it), the package files, theme script, tokens, layout (fonts via `next/font/google`: `Chakra_Petch` 500/600/700, `IBM_Plex_Sans` 400/500/600, `IBM_Plex_Mono` 400/500; blocking theme script defaulting to **dark** when nothing is saved and the system has no preference), `robots.ts` returning `{ rules: { userAgent: "*", disallow: "/" } }`, Nav (wordmark ring + "JARVIS", links "Features" `/#features`, "How it works", "Get started", ThemeToggle), Footer ("Private, non-commercial project", `JARVIS v{version}` when given), `Reveal` + `[data-reveal]` CSS from ai-coach-website, CI (`npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` with `JARVIS_RELEASE_FIXTURE=1`). `package.json` scripts as ai-coach-website (`themes`, `predev`, `prebuild`, `dev`, `build`, `start`, `lint`, `typecheck`, `test: node --test lib/*.test.mjs content/*.test.mjs`).

- [ ] **Step 5: Verify** — `npm test` PASS; `npm run lint` and `npm run typecheck` clean; `npm run build` succeeds; `npm run dev`, open `/`: dark ground, ring turns, toggle switches light/dark, `<meta name="robots" content="noindex, nofollow">` in the page source.

- [ ] **Step 6: Commit and push** — `git add -A`, `git commit -m "chore: scaffold the JARVIS website"`, `git push -u origin main`.

### Task 2: Release and server-address data

**Files:**
- Create: `lib/release-core.ts`, `lib/release.ts`, `lib/release.fixture.json`, `lib/release.test.mjs`
- Create: `lib/server-core.ts`, `lib/server.ts`, `lib/server.test.mjs`

**Interfaces:**
- Produces (pure, testable): `type Asset = { id: number; name: string; size: number }`; `type Release = { version: string; publishedAt: string; apk: Asset; extension: Asset }`; `parseRelease(json: unknown): Release` (throws `Error` naming what is missing); `parseServerUrl(raw: string | undefined): string | null`; `formatSize(bytes: number): string` (`69572467` → `"66 MB"`, under 1 MB → `"< 1 MB"`).
- Produces (server-only): `getRelease(): Promise<Release>`; `getServerUrl(): string | null` (reads `JARVIS_SERVER_URL`).

- [ ] **Step 1: Write the failing tests**

`lib/release.test.mjs` (fixture modelled on the real v1.10.0 release: `tag_name: "v1.10.0"`, assets `jarvis-1.10.0.apk` size 69572467 and `jarvis-extension-1.10.0-chrome.zip`):
- `picks both assets and the version` → `version === "1.10.0"`, `apk.name === "jarvis-1.10.0.apk"`, `extension.name === "jarvis-extension-1.10.0-chrome.zip"`.
- `throws when the extension zip is missing` → `assert.throws(..., /extension/)`.
- `throws on unexpected asset names` (`jarvis-android-1.10.0.apk`) → throws `/apk/`.
- `throws when an asset version differs from the tag` (`jarvis-1.9.0.apk` on `v1.10.0`) → throws.
- `formats sizes` → `formatSize(69572467) === "66 MB"`, `formatSize(400000) === "< 1 MB"`.

`lib/server.test.mjs`:
- accepts `https://quiet-river-12.trycloudflare.com` (returns it unchanged).
- returns `null` for `undefined`, `""`, `"http://a.trycloudflare.com"`, `"https://evil.com"`, `"https://a.trycloudflare.com/path"`, `"https://u:p@a.trycloudflare.com"`, `"https://a.trycloudflare.com.evil.com"`, `"javascript:alert(1)"`.
- trims surrounding spaces: `" https://a.trycloudflare.com "` → `"https://a.trycloudflare.com"`.

- [ ] **Step 2: Run** — `npm test` → FAIL (modules missing).

- [ ] **Step 3: Implement** `release-core.ts` and `server-core.ts` (pure, `.ts`, no imports), then `release.ts` (`import "server-only"`; `fetch("https://api.github.com/repos/MohammedMoataz/JARVIS/releases/latest", { headers: { Authorization: \`Bearer ${token}\`, Accept: "application/vnd.github+json" }, cache: "force-cache", signal: AbortSignal.timeout(15000) })`; when `JARVIS_RELEASES_TOKEN` is unset: use `release.fixture.json` if `JARVIS_RELEASE_FIXTURE === "1"`, else throw "JARVIS_RELEASES_TOKEN is not set") and `server.ts`.

- [ ] **Step 4: Run** — `npm test` → PASS.

- [ ] **Step 5: Commit** — `git commit -m "feat: read the latest JARVIS release and the server address at build"`.

### Task 3: Download routes

**Files:**
- Create: `lib/download-core.ts`, `lib/download.test.mjs`, `app/download/[kind]/route.ts`

**Interfaces:**
- Consumes: `Release` (Task 2), `getRelease()`.
- Produces: `resolveDownload(kind: string, release: Release, token: string, fetchImpl: typeof fetch): Promise<{ status: 302; location: string } | { status: 404 | 503 }>`; route `GET /download/apk` and `GET /download/extension`.

- [ ] **Step 1: Write the failing tests** (stub `fetchImpl`):
- `redirects to the signed URL` — stub answers `new Response(null, { status: 302, headers: { location: "https://objects.githubusercontent.com/x?sig=1" } })` → `{ status: 302, location: "https://objects.githubusercontent.com/x?sig=1" }`; assert the stub received URL `https://api.github.com/repos/MohammedMoataz/JARVIS/releases/assets/<apk.id>`, header `Accept: application/octet-stream`, `redirect: "manual"`.
- `unknown kind is 404` (`"ipa"`) and the stub is never called.
- `GitHub error is 503` — stub answers 404, then 403, then throws `TimeoutError` → each `{ status: 503 }`.
- `a redirect to another host is 503` — `location: "https://evil.com/x"` → 503 (accept only `https://objects.githubusercontent.com/` and `https://release-assets.githubusercontent.com/` prefixes).

- [ ] **Step 2: Run** — FAIL.

- [ ] **Step 3: Implement** `resolveDownload` (timeout 10 s via `AbortSignal.timeout(10000)`) and the route (`export const runtime = "nodejs"`, `export const dynamic = "force-dynamic"`; 302 → `Response.redirect(location, 302)` with `cache-control: no-store`; 404/503 → a plain HTML body "Download unavailable right now. Try again in a minute, or ask the owner." with that status). The token is read from `process.env.JARVIS_RELEASES_TOKEN` inside the route only.

- [ ] **Step 4: Run** — PASS. Then with a real token in `.env.local`: `npm run build && npm start`, `curl -sI http://localhost:3000/download/apk` → `302` with `location: https://...githubusercontent.com/...`; `curl -sI .../download/ipa` → `404`.

- [ ] **Step 5: Commit** — `git commit -m "feat: download the latest APK and extension through signed links"`.

### Task 4: Server status route

**Files:**
- Create: `lib/status-core.ts`, `lib/status.test.mjs`, `app/api/status/route.ts`

**Interfaces:**
- Consumes: `getServerUrl()` (Task 2).
- Produces: `checkHealth(url: string | null, fetchImpl: typeof fetch): Promise<"online" | "offline" | "unknown">`; `GET /api/status` → `{ "status": "online" | "offline" | "unknown" }`, `revalidate = 60`.

- [ ] **Step 1: Write the failing tests**: `null` url → `"unknown"` and no fetch; 200 `{ "status": "ok" }` → `"online"`; 200 `{ "status": "degraded" }` → `"online"` (JARVIS answers; degraded is still usable); 502 → `"offline"`; thrown error → `"offline"` (`status: unreachable host is offline`); assert the stub was called with `<url>/health` and a signal.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement** with `AbortSignal.timeout(5000)`; the route returns JSON only, never the URL or error text.
- [ ] **Step 4: Run** — PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: show whether JARVIS is online"`.

### Task 5: Download card and server address

**Files:**
- Create: `components/DownloadCard.tsx` (server component), `components/ServerAddress.tsx` (`"use client"`), `components/StatusDot.tsx` (`"use client"`)

**Interfaces:**
- Consumes: `Release`, `formatSize`, `getServerUrl()`, `/api/status`.
- Produces: `<DownloadCard release={Release} serverUrl={string | null} />`, used on `/` and `/get-started`.

- [ ] **Step 1: Build the card**: two PrimeReact `Button`s rendered as links (`<a href="/download/apk">`, `<a href="/download/extension">`) labelled "Android app (APK) · 66 MB" and "Chrome extension (zip) · < 1 MB", under "JARVIS v1.10.0 · 24 Oct 2026"; `ServerAddress` shows the URL in a read-only mono field with Copy (`navigator.clipboard.writeText` in the click handler; on rejection select the text and show "Press Ctrl+C to copy"), helper line "Paste this when JARVIS asks for a server"; when `serverUrl` is null it shows "Ask the owner for the server address" and no field. `StatusDot` fetches `/api/status` once on mount: green "JARVIS is online", amber "JARVIS is offline right now. Try again later.", nothing for `unknown`.
- [ ] **Step 2: Verify by hand** in `npm run dev` with `JARVIS_RELEASE_FIXTURE=1`: with `JARVIS_SERVER_URL` unset → "Ask the owner…"; set to a valid URL → field + Copy works; in Chrome DevTools block clipboard permission → fallback text appears (Review Focus 5); keyboard Tab reaches both downloads and Copy with a visible focus ring.
- [ ] **Step 3: Commit** — `git commit -m "feat: download card with the server address and status"`.

### Task 6: Landing page

**Files:**
- Create: `content/copy.ts`, `content/copy.test.mjs`, `components/Hero.tsx`, `components/HeroScene.tsx`, `components/Section.tsx`, `components/FeatureGrid.tsx`
- Modify: `app/page.tsx`, `app/globals.css`

**Interfaces:**
- Consumes: `DownloadCard` (Task 5), `getRelease`, `getServerUrl`, `pageMeta`, `Reveal`.
- Produces: `copy` object with keys `hero`, `sayItOnce`, `askYourLibrary`, `readItLater`, `yourDay`, `bodyAndHabits`, `offline`, `privacy`, `assistants`, `getIt` (each `{ eyebrow, title, lead, points: string[] }` except `hero: { title, lead, primary, secondary }`).

- [ ] **Step 1: Write the failing test** `content/copy.test.mjs` — forbidden claims absent from `JSON.stringify(copy)` (case-insensitive): `never leaves`, `stays on your`, `iphone`, `ios app`, `app store`, `push notification`, `calorie`, `progression`, `personal record`, `cloud ai`, `gpt`, `testimonial`; and present: `Not in your library`, `owner`, `audited`.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Write `copy.ts`** following spec §2 sections 2–11 and the Global Constraints copy rules, then the page: `Hero` (headline, lead, buttons to `/get-started` and `/how-it-works`, `HeroScene`: CSS-only ring turning in 40 s, a typed line "remind me to call mum at six" that resolves into a task card showing "18:00" and a saved-link card with a "[1]" citation chip, loop 12 s, resting frame fully visible), sections in spec order with `id="features"` on the first, `FeatureGrid` cards using PrimeReact `Tag` for vocabulary chips (PARA places, `[1]`, "Not in your library."), gold only on recall/library chips, `DownloadCard` in "Get it". Add `tag` to `USED` in `scripts/themes.mjs` if not already there.
- [ ] **Step 4: Run** — `npm test` PASS; `npm run build` ok; dev check at 360 px (no horizontal scroll), both themes, `prefers-reduced-motion: reduce` emulated → scene static and complete.
- [ ] **Step 5: Commit** — `git commit -m "feat: landing page"`.

### Task 7: Get started and How it works

**Files:**
- Create: `app/get-started/page.tsx`, `app/how-it-works/page.tsx`, `components/Steps.tsx`, `components/ArchitectureDiagram.tsx`
- Modify: `content/copy.ts`, `content/copy.test.mjs`

**Interfaces:**
- Consumes: `DownloadCard`, `copy`, `pageMeta`.
- Produces: `copy.getStarted = { phone: string[]; extension: string[]; google: string; iphone: string; troubleshooting: { q: string; a: string }[]; updating: string[] }`, `copy.howItWorks = { loop: string[]; patterns: { title: string; text: string }[]; ai: string[]; sync: string[]; privacy: string[]; stack: string[] }`.

- [ ] **Step 1: Extend the copy test**: `getStarted.phone` mentions "server address" and "password"; `getStarted.extension` contains "chrome://extensions", "Developer mode", "Load unpacked"; `getStarted.iphone` contains "not available"; troubleshooting covers offline, registration closed, Android blocking installs, and a changed address that says to let the app sync, sign out, then sign in with the new address (spec §7 default); `howItWorks.ai` names `qwen2.5:3b-instruct` and `embeddinggemma`.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Write the copy and pages** per spec §2 (`/get-started`: card on top, `Steps` as numbered lists — the order is real; `/how-it-works`: loop, `ArchitectureDiagram` as semantic HTML tiers clients → edge → roles → 19 contexts → stores, horizontally scrollable on phones, then patterns, AI, sync, privacy, stack). Facts come from the Feature Atlas; no number it does not carry.
- [ ] **Step 4: Run** — `npm test` PASS; build ok; both pages checked at 360 px and in both themes.
- [ ] **Step 5: Commit** — `git commit -m "feat: get started and how it works pages"`.

### Task 8: Sharing preview and quality pass

**Files:**
- Create: `app/opengraph-image.tsx` (Next `ImageResponse`, 1200×630: ring, "JARVIS", "Your second brain", arc on void), `app/icon.svg` (ring)
- Modify: page metadata via `pageMeta`

- [ ] **Step 1:** Add the OG image and icon; every page exports `metadata = pageMeta(...)`.
- [ ] **Step 2: Verify** — `npm run build && npm start`; Lighthouse (Chrome DevTools, mobile) on `/`, `/get-started`, `/how-it-works`: Performance, Accessibility, Best Practices ≥ 90 each; SEO: every audit passes except `is-crawlable`. Fix and re-run until met; paste the scores into the PR description.
- [ ] **Step 3: Commit** — `git commit -m "feat: sharing preview and quality fixes"`.

### Task 9: Vercel project and deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `JARVIS_RELEASES_TOKEN`; repository variable `JARVIS_SERVER_URL`.
- Produces: production deploys on push to `main`, `workflow_dispatch`, and `repository_dispatch` types `jarvis-released` and `jarvis-tunnel`.

- [ ] **Step 1: Owner actions** (ask the owner; the agent cannot do them): `vercel login`; create the fine-grained PAT `JARVIS_RELEASES_TOKEN` (repository `MohammedMoataz/JARVIS`, Contents: read-only). Then the agent runs `vercel link --yes --project jarvis-website`, `vercel env add JARVIS_RELEASES_TOKEN production` (value piped on stdin), and `gh secret set` for the four secrets from `.vercel/project.json` and the PAT.
- [ ] **Step 2: Write `deploy.yml`** — ai-coach-website's `deploy.yml` with: `repository_dispatch: types: [jarvis-released, jarvis-tunnel]`; the gate also requires `JARVIS_RELEASES_TOKEN`; deploy job env adds `JARVIS_RELEASES_TOKEN: ${{ secrets.JARVIS_RELEASES_TOKEN }}` and `JARVIS_SERVER_URL: ${{ vars.JARVIS_SERVER_URL }}`; `npm i -g vercel@<exact version>` pinned instead of `latest`.
- [ ] **Step 3: Deploy** — push to `main`; `gh run watch` → success; production URL from `vercel ls --prod`.
- [ ] **Step 4: Verify on production** (show each output): `curl -sI <url>/download/apk` → 302 to a `githubusercontent.com` host; downloading it gives 69572467 bytes for v1.10.0; `curl -s <url>/api/status` answers JSON; `curl -s <url>/robots.txt` disallows `/`; leak check: `curl -s <url> <url>/get-started <url>/how-it-works` plus every `/_next/static/**/*.js` the pages reference, grepped for `github_pat_`, `ghp_`, `JARVIS_RELEASES_TOKEN`, `github.com/MohammedMoataz/JARVIS` → no matches.
- [ ] **Step 5: Commit** — `git commit -m "ci: deploy to Vercel on push, release and tunnel events"`.

### Task 10: JARVIS side — notify on release, publish the tunnel address

Work in `E:\Work\JARVIS` on a new feature branch made by the git extension:
`python .specify/extensions/git/scripts/python/create_new_feature_branch.py --json --short-name site-link "Tell the website about releases and the tunnel address"` (expected branch `029-site-link`). Write a short `specs/029-site-link/spec.md` and, at the end, `gate.md` with the evidence below.

**Files (JARVIS repo):**
- Create: `.github/workflows/notify-site.yml`, `scripts/publish-tunnel.mjs`, `scripts/lib/tunnel.mjs`, `scripts/lib/tunnel.test.mjs`
- Modify: `CLAUDE.md` (Commands: one line for `node scripts/publish-tunnel.mjs`)

**Interfaces:**
- Produces: `lastTunnelUrl(log: string): string | null` (last match of `https://[a-z0-9-]+\.trycloudflare\.com` in the text); CLI `node scripts/publish-tunnel.mjs` exits 0 after publishing, non-zero with a one-line reason otherwise.

- [ ] **Step 1: Write the failing test** `scripts/lib/tunnel.test.mjs` (`node --test`): a sample cloudflared log with two URLs (restart) → the last one; a log with none → `null`; `https://x.trycloudflare.com.evil.com` in the log is not matched as `https://x.trycloudflare.com.evil.com`.
- [ ] **Step 2: Run** — `node --test scripts/lib/tunnel.test.mjs` → FAIL.
- [ ] **Step 3: Implement** `tunnel.mjs`, then `publish-tunnel.mjs`: `execFile` (timeout 30 s, killed on timeout) of `docker compose -f infra/compose.yaml --env-file infra/.env logs --no-color cloudflared-quick`; `lastTunnelUrl`; poll `GET <url>/health` every 5 s up to 2 min (each with a 5 s timeout) until 200; `gh variable set JARVIS_SERVER_URL -R MohammedMoataz/jarvis-website --body <url>`; `gh api repos/MohammedMoataz/jarvis-website/dispatches -f event_type=jarvis-tunnel`; print `published <url>`. No shell strings (argument arrays only), so it runs the same from PowerShell and bash.
- [ ] **Step 4: Write `notify-site.yml`** — `on: release: types: [published]` and `workflow_dispatch`; `permissions: {}`; one step that skips with a summary line when `SITE_DISPATCH_TOKEN` is empty, else `gh api repos/MohammedMoataz/jarvis-website/dispatches -f event_type=jarvis-released -f "client_payload[tag]=${{ github.event.release.tag_name }}"`.
- [ ] **Step 5: Run JARVIS checks on the PC** — `node --test scripts/lib/tunnel.test.mjs` PASS; `pnpm format:check`, `pnpm lint`, `pnpm checks` (env-keys/literals must stay green: the script reads no `process.env` keys); name guard grep rc=1.
- [ ] **Step 6: Owner action** — create fine-grained PAT `SITE_DISPATCH_TOKEN` (repository `jarvis-website`, Contents: read and write) and `gh secret set SITE_DISPATCH_TOKEN -R MohammedMoataz/JARVIS`.
- [ ] **Step 7: Live evidence** (into `specs/029-site-link/gate.md`): `node scripts/publish-tunnel.mjs` → `published https://….trycloudflare.com`; the site's deploy run triggered by `jarvis-tunnel` succeeds; the production `/get-started` shows that address and "JARVIS is online"; `gh workflow run notify-site.yml -R MohammedMoataz/JARVIS` → the site redeploys (proves the release path without cutting a release).
- [ ] **Step 8: Commit, PR, merge** — commit with the attribution trailer, open a PR on JARVIS, merge after the owner's go-ahead.

---

## Self-review notes

- Spec coverage: §1 facts → Global Constraints + copy tests (Tasks 6, 7); §2 pages → Tasks 5–8; §3 data, routes, rebuild loop, secrets → Tasks 2–4, 9, 10; §4 visual → Tasks 1, 6; §5 tests and verification → each task + Tasks 8, 9; §6 calls (status dot, update steps, ask-the-owner, noindex) → Tasks 4, 5, 7, 1; §7 defaults → Task 7 troubleshooting copy.
- Deviation from the spec, decided here: `motion` is not installed by default (CSS can carry the scene; ai-coach-website also ended up CSS-only). Added only with a stated reason.
