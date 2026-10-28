// The owner's JARVIS address, as published by JARVIS scripts/publish-tunnel.mjs. Only a bare
// https quick-tunnel origin is accepted; anything else is treated as "no address".
const QUICK_TUNNEL = /^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/;

export function parseServerUrl(raw: string | undefined): string | null {
  const url = raw?.trim() ?? "";
  return QUICK_TUNNEL.test(url) ? url : null;
}

const VARIABLE = "https://api.github.com/repos/MohammedMoataz/JARVIS/actions/variables/JARVIS_SERVER_URL";

// publish-tunnel.mjs stores the address as a repository variable on JARVIS, so a new tunnel
// shows up within a minute with no deploy. Needs Variables: read on the token.
export async function readServerVariable(token: string, fetchImpl: typeof fetch): Promise<string | null> {
  try {
    const init: RequestInit & { next: { revalidate: number } } = {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 60 },
    };
    const res = await fetchImpl(VARIABLE, init);
    if (!res.ok) return null;
    return parseServerUrl(((await res.json()) as { value?: string }).value);
  } catch {
    return null;
  }
}
