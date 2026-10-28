import type { MetadataRoute } from "next";

// Shared by link, never found by search (the JARVIS trademark rule): search engines are kept
// out, and every page also says noindex. Link-preview bots may fetch pages and
// /opengraph-image so a shared link shows its card; they do not index.
const PREVIEW_BOTS = ["Twitterbot", "LinkedInBot", "facebookexternalhit", "WhatsApp", "Slackbot", "TelegramBot", "Discordbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: PREVIEW_BOTS, allow: "/" },
      { userAgent: "*", disallow: "/" },
    ],
  };
}
