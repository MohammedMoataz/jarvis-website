// The owner's JARVIS address, as published by JARVIS scripts/publish-tunnel.mjs. Only a bare
// https quick-tunnel origin is accepted; anything else is treated as "no address".
const QUICK_TUNNEL = /^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/;

export function parseServerUrl(raw: string | undefined): string | null {
  const url = raw?.trim() ?? "";
  return QUICK_TUNNEL.test(url) ? url : null;
}
