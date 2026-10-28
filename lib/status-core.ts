export type ServerStatus = "online" | "offline" | "unknown";

// JARVIS answers GET /health with 200 and {"status": "ok" | "degraded"} whenever it is up
// (degraded still serves members). Anything else, including a tunnel error page, is offline.
export async function checkHealth(url: string | null, fetchImpl: typeof fetch): Promise<ServerStatus> {
  if (!url) return "unknown";
  try {
    // Cached for 60 s by Next (`next` is ignored by plain fetch): one health request a minute
    // reaches the owner's PC however many people have the page open. `no-store` would make
    // /api/status dynamic and check on every visit.
    const init: RequestInit & { next: { revalidate: number } } = {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 60 },
    };
    const res = await fetchImpl(`${url}/health`, init);
    if (!res.ok) return "offline";
    const body = (await res.json()) as { status?: unknown };
    return body.status === "ok" || body.status === "degraded" ? "online" : "offline";
  } catch {
    return "offline";
  }
}
