export type ServerStatus = "online" | "offline" | "unknown";

// JARVIS answers GET /health with 200 and {"status": "ok" | "degraded"} whenever it is up
// (degraded still serves members). Anything else, including a tunnel error page, is offline.
export async function checkHealth(url: string | null, fetchImpl: typeof fetch): Promise<ServerStatus> {
  if (!url) return "unknown";
  try {
    // The route caches the answer for 60 s (app/api/status), so one health request a minute
    // reaches the owner's PC. No fetch-level window on top: stacked, they let "online" outlive a
    // switched-off PC by a second minute. `no-store` would make the route check on every visit.
    const res = await fetchImpl(`${url}/health`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return "offline";
    const body = (await res.json()) as { status?: unknown };
    return body.status === "ok" || body.status === "degraded" ? "online" : "offline";
  } catch {
    return "offline";
  }
}
