import "server-only";
import fixture from "./release.fixture.json" with { type: "json" };
import { parseRelease, type Release } from "./release-core.ts";

export type { Asset, Release } from "./release-core.ts";
export { formatSize } from "./release-core.ts";

const LATEST = "https://api.github.com/repos/MohammedMoataz/JARVIS/releases/latest";

// The latest JARVIS release, re-read every 5 minutes, so a new release reaches the site with no
// deploy. The JARVIS repo is private, so this needs
// JARVIS_RELEASES_TOKEN (read-only Contents on JARVIS). Without it, only an explicit
// JARVIS_RELEASE_FIXTURE=1 (CI and local dev) falls back to the checked-in v1.10.0 payload.
export async function getRelease(): Promise<Release> {
  const token = process.env.JARVIS_RELEASES_TOKEN;
  if (!token) {
    if (process.env.JARVIS_RELEASE_FIXTURE === "1") return parseRelease(fixture);
    throw new Error("JARVIS_RELEASES_TOKEN is not set (set JARVIS_RELEASE_FIXTURE=1 to build with the fixture)");
  }
  const res = await fetch(LATEST, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`GitHub answered ${res.status} for the latest JARVIS release`);
  return parseRelease(await res.json());
}
