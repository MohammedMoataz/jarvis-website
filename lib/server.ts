import "server-only";
import { parseServerUrl, readServerVariable } from "./server-core.ts";

// From the JARVIS repository variable JARVIS_SERVER_URL; without a token (local dev) from the
// environment variable of the same name.
export async function getServerUrl(): Promise<string | null> {
  const token = process.env.JARVIS_RELEASES_TOKEN;
  return token ? readServerVariable(token, fetch) : parseServerUrl(process.env.JARVIS_SERVER_URL);
}
