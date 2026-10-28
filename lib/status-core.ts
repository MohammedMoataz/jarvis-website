export type ServerStatus = "online" | "offline" | "unknown";

// JARVIS answers GET /health with 200 and {"status": "ok" | "degraded"} whenever it is up
// (degraded still serves members). Anything else, including a tunnel error page, is offline.
export async function checkHealth(url: string | null, fetchImpl: typeof fetch): Promise<ServerStatus> {
  if (!url) return "unknown";
  try {
    const res = await fetchImpl(`${url}/health`, { signal: AbortSignal.timeout(5000), cache: "no-store" });
    if (!res.ok) return "offline";
    const body = (await res.json()) as { status?: unknown };
    return body.status === "ok" || body.status === "degraded" ? "online" : "offline";
  } catch {
    return "offline";
  }
}
