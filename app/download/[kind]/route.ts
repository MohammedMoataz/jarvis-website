import { getRelease } from "@/lib/release";
import { downloadPage, resolveDownload } from "@/lib/download-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, ctx: RouteContext<"/download/[kind]">) {
  const { kind } = await ctx.params;
  const result = await resolveDownload(kind, getRelease, process.env.JARVIS_RELEASES_TOKEN ?? "", fetch);
  if (result.status === 302) {
    return new Response(null, { status: 302, headers: { location: result.location, "cache-control": "no-store" } });
  }
  return new Response(downloadPage(result.status), {
    status: result.status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}
