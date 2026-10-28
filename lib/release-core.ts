// Pure parsing of a GitHub "latest release" payload from the JARVIS repo. No imports, so
// `node --test` loads it directly. Any surprise throws: a failed build keeps the last good deploy.

export type Asset = { id: number; name: string; size: number };
export type Release = { version: string; publishedAt: string; apk: Asset; extension: Asset };

// Release asset names from JARVIS CLAUDE.md ("Releases"); both carry the release's own version.
const APK = /^jarvis-(\d+\.\d+\.\d+)\.apk$/;
const EXTENSION = /^jarvis-extension-(\d+\.\d+\.\d+)-chrome\.zip$/;

type RawAsset = { id?: unknown; name?: unknown; size?: unknown };

function pick(assets: RawAsset[], pattern: RegExp, version: string, label: string): Asset {
  for (const a of assets) {
    const m = typeof a.name === "string" ? pattern.exec(a.name) : null;
    if (m && m[1] === version && typeof a.id === "number" && typeof a.size === "number") {
      return { id: a.id, name: a.name as string, size: a.size };
    }
  }
  throw new Error(`release v${version} has no ${label} asset named like ${pattern}`);
}

export function parseRelease(json: unknown): Release {
  const r = json as { tag_name?: unknown; published_at?: unknown; assets?: unknown };
  const tag = typeof r?.tag_name === "string" ? /^v(\d+\.\d+\.\d+)$/.exec(r.tag_name) : null;
  if (!tag || typeof r.published_at !== "string" || !Array.isArray(r.assets)) {
    throw new Error("not a JARVIS release payload (expected tag vX.Y.Z, published_at and assets)");
  }
  const version = tag[1];
  return {
    version,
    publishedAt: r.published_at,
    apk: pick(r.assets, APK, version, "apk"),
    extension: pick(r.assets, EXTENSION, version, "extension"),
  };
}

export function formatSize(bytes: number): string {
  const mb = bytes / 1048576;
  return mb < 1 ? "< 1 MB" : `${Math.round(mb)} MB`;
}
