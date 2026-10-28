import { getRelease } from "@/lib/release";
import { resolveDownload } from "@/lib/download-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UNAVAILABLE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Download unavailable · JARVIS</title>
<body style="font:16px/1.6 system-ui,sans-serif;max-width:36rem;margin:15vh auto;padding:0 20px">
<p>Download unavailable right now. Try again in a minute, or ask the owner.</p>
<p><a href="/get-started">Back to Get started</a></p></body>`;

export async function GET(_request: Request, ctx: RouteContext<"/download/[kind]">) {
  const { kind } = await ctx.params;
  const token = process.env.JARVIS_RELEASES_TOKEN ?? "";
  const result = token ? await resolveDownload(kind, getRelease, token, fetch) : { status: 503 as const };
  if (result.status === 302) {
    return new Response(null, { status: 302, headers: { location: result.location, "cache-control": "no-store" } });
  }
  return new Response(UNAVAILABLE, {
    status: result.status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}
