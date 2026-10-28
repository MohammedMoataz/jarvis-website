import { getServerUrl } from "@/lib/server";
import { checkHealth } from "@/lib/status-core";

export const runtime = "nodejs";
// Checked at most once a minute: every visitor shares the answer, so the owner's PC sees one
// health request per minute however many people open the page.
export const revalidate = 60;

export async function GET() {
  return Response.json({ status: await checkHealth(getServerUrl(), fetch) });
}
