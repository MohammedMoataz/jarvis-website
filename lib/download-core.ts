import type { Release } from "./release-core.ts";

export type DownloadResult = { status: 302; location: string } | { status: 404 | 503 };

const ASSET = "https://api.github.com/repos/MohammedMoataz/JARVIS/releases/assets/";
// Where GitHub sends a release-asset download: a short-lived signed URL on one of these hosts.
const SIGNED_HOSTS = ["https://objects.githubusercontent.com/", "https://release-assets.githubusercontent.com/"];

// Asks GitHub for the asset with the server's token and hands back the signed URL it redirects
// to. The visitor never sees the token, the private repo URL, or GitHub's error text.
export async function resolveDownload(
  kind: string,
  release: Release,
  token: string,
  fetchImpl: typeof fetch,
): Promise<DownloadResult> {
  const asset = kind === "apk" ? release.apk : kind === "extension" ? release.extension : null;
  if (!asset) return { status: 404 };
  try {
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
