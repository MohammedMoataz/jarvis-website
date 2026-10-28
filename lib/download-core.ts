import type { Release } from "./release-core.ts";

export type DownloadResult = { status: 302; location: string } | { status: 404 | 503 };

const ASSET = "https://api.github.com/repos/MohammedMoataz/JARVIS/releases/assets/";
// Where GitHub sends a release-asset download: a short-lived signed URL on one of these hosts.
const SIGNED_HOSTS = ["https://objects.githubusercontent.com/", "https://release-assets.githubusercontent.com/"];

// Asks GitHub for the asset with the server's token and hands back the signed URL it redirects
// to. The visitor never sees the token, the private repo URL, or GitHub's error text. The release
// is read at click time, so a GitHub failure or a malformed release is a 503 too, never a throw.
export async function resolveDownload(
  kind: string,
  loadRelease: () => Promise<Release>,
  token: string,
  fetchImpl: typeof fetch,
): Promise<DownloadResult> {
  if (kind !== "apk" && kind !== "extension") return { status: 404 };
  if (!token) return { status: 503 };
  try {
    const release = await loadRelease();
    const asset = kind === "apk" ? release.apk : release.extension;
    const res = await fetchImpl(ASSET + asset.id, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/octet-stream" },
      redirect: "manual",
      signal: AbortSignal.timeout(10000),
    });
    const location = res.headers.get("location");
    if (res.status === 302 && location && SIGNED_HOSTS.some((h) => location.startsWith(h))) {
      return { status: 302, location };
    }
    return { status: 503 };
  } catch {
    return { status: 503 };
  }
}

// The page a visitor sees instead of a file. A dead link is not an outage, so only 503 says
// "try again".
export function downloadPage(status: 404 | 503): string {
  const [title, text] =
    status === 404
      ? ["No such download", "No such download. The phone app and the browser extension are on Get started."]
      : ["Download unavailable", "Download unavailable right now. Try again in a minute, or ask the owner."];
  return `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>${title} · JARVIS</title>
<body style="font:16px/1.6 system-ui,sans-serif;max-width:36rem;margin:15vh auto;padding:0 20px">
<p>${text}</p>
<p><a href="/get-started">Back to Get started</a></p></body>`;
}
