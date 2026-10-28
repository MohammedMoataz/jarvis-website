import "server-only";
import { parseServerUrl } from "./server-core.ts";

// Set from the repository variable JARVIS_SERVER_URL by the deploy workflow; baked in at build.
export function getServerUrl(): string | null {
  return parseServerUrl(process.env.JARVIS_SERVER_URL);
}
